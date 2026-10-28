import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const whatsappUrl = 'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20Thamy%20Thamy%20%C3%93tica!';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Thamy+Thamy+Ótica';
const glassesPhoto = '/manus-storage/IMG_6757_443e1419.JPG';

const collections = [
  { number: '01', name: 'Essenciais', detail: 'Linhas limpas para todos os dias', tone: 'sand', shape: 'round' },
  { number: '02', name: 'Autoria', detail: 'Formas que deixam presença', tone: 'wine', shape: 'cat' },
  { number: '03', name: 'Leves', detail: 'Conforto que quase desaparece', tone: 'rose', shape: 'square' },
];

const services = [
  { number: '01', title: 'Curadoria de armações', text: 'A gente olha junto para encontrar o formato que conversa com você.' },
  { number: '02', title: 'Lentes sob medida', text: 'Orientação próxima para transformar necessidade em clareza.' },
  { number: '03', title: 'Ajuste e cuidado', text: 'Pequenos ajustes para sua armação vestir bem todos os dias.' },
];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

function GlassesModel() {
  const modelRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<gsap.core.Timeline | null>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, rotationX: -2, rotationY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
    idle.to(model, { rotationY: 7, rotationX: -4, duration: 3.4, ease: 'sine.inOut' })
      .to(model, { rotationY: -7, rotationX: 3, duration: 3.8, ease: 'sine.inOut' });
    idleRef.current = idle;
    idle.play();

    return () => {
      idle.kill();
      idleRef.current = null;
    };
  }, []);

  const setModelRotation = (rotationX: number, rotationY: number, duration = 0.35) => {
    if (!modelRef.current) return;
    gsap.to(modelRef.current, { rotationX, rotationY, duration, ease: 'power3.out', overwrite: true });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    if (dragRef.current.active) {
      const nextY = dragRef.current.rotationY + (event.clientX - dragRef.current.x) * 0.28;
      const nextX = dragRef.current.rotationX - (event.clientY - dragRef.current.y) * 0.18;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      dragRef.current.rotationX = Math.max(-22, Math.min(22, nextX));
      dragRef.current.rotationY = Math.max(-32, Math.min(32, nextY));
      setModelRotation(dragRef.current.rotationX, dragRef.current.rotationY, 0.1);
      return;
    }

    const bounds = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    idleRef.current?.pause();
    setModelRotation(y * -10, x * 16, 0.5);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!modelRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    idleRef.current?.pause();
    const rotation = gsap.getProperty(modelRef.current, 'rotationY');
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      rotationX: Number(gsap.getProperty(modelRef.current, 'rotationX')) || -2,
      rotationY: Number(rotation) || 0,
    };
    setIsDragging(true);
  };

  const releasePointer = () => {
    dragRef.current.active = false;
    setIsDragging(false);
    idleRef.current?.restart();
  };

  return (
    <div
      ref={stageRef}
      className={`glasses-stage ${isDragging ? 'is-dragging' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerLeave={() => {
        if (!dragRef.current.active) {
          idleRef.current?.restart();
          setModelRotation(-2, 0, 0.8);
        }
      }}
      role="img"
      aria-label="Óculos em 3D interativo. Arraste para explorar."
    >
      <div className="glasses-aura" aria-hidden="true" />
      <div className="glasses-shadow" aria-hidden="true" />
      <div ref={modelRef} className="glasses-model glasses-photo-model">
        <img className="glasses-photo" src={glassesPhoto} alt="Óculos inteligentes em vista explodida, com lentes, câmera e componentes internos destacados" draggable="false" />
      </div>
      <div className="drag-hint"><span className="drag-dot" /> arraste para explorar</div>
    </div>
  );
}

function CollectionCard({ item }: { item: typeof collections[number] }) {
  return (
    <article className={`collection-card ${item.tone} reveal`}>
      <div className="card-topline"><span>{item.number}</span><span>ver detalhes <ArrowIcon /></span></div>
      <div className={`mini-glasses ${item.shape}`} aria-hidden="true">
        <div className="mini-lens" /><div className="mini-bridge" /><div className="mini-lens" />
      </div>
      <div className="card-copy"><h3>{item.name}</h3><p>{item.detail}</p></div>
    </article>
  );
}

function App() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.site-header', { y: -24, opacity: 0, duration: 0.8 })
        .from('.hero-kicker', { y: 18, opacity: 0, duration: 0.65 }, '-=0.3')
        .from('.hero-title-line', { yPercent: 110, opacity: 0, stagger: 0.12, duration: 1.05 }, '-=0.3')
        .from('.hero-description, .hero-actions', { y: 20, opacity: 0, duration: 0.8 }, '-=0.55')
        .from('.hero-visual', { scale: 0.88, opacity: 0, duration: 1.15 }, '-=0.8');

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        });
      });

      gsap.to('.marquee-track', {
        xPercent: -38,
        duration: 24,
        ease: 'none',
        repeat: -1,
      });

      gsap.to('.section-orbit', {
        rotation: 360,
        duration: 34,
        ease: 'none',
        repeat: -1,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Thamy Thamy Ótica, início"><span>thamy</span><i>thamy</i></a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#colecoes">coleções</a>
          <a href="#cuidado">cuidado</a>
          <a href="#loja">a loja</a>
        </nav>
        <a className="header-contact" href={whatsappUrl} target="_blank" rel="noreferrer">falar com a gente <ArrowIcon /></a>
      </header>

      <main>
        <section id="inicio" className="hero section-pad">
          <div className="hero-copy">
            <p className="hero-kicker"><span className="eyebrow-dot" /> ótica autoral · desde 2018</p>
            <h1 className="hero-title" aria-label="Cada detalhe importa">
              <span className="hero-title-line">Cada detalhe</span>
              <span className="hero-title-line title-italic">importa.</span>
            </h1>
            <p className="hero-description">Armações escolhidas para acompanhar o seu jeito de ver o mundo — com tempo, escuta e intenção.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#colecoes">explorar coleções <ArrowIcon /></a>
              <a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">falar no WhatsApp <ArrowIcon /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-index">01 <span>/</span> 03</div>
            <GlassesModel />
            <div className="hero-note"><span>toque e gire</span><span className="note-line" /></div>
          </div>
          <div className="hero-bottom-note"><span>uma nova forma de ver</span><span>↓</span></div>
        </section>

        <section className="marquee" aria-label="Manifesto da marca">
          <div className="marquee-track"><span>olhar com intenção</span><b>✳</b><span>cuidar dos detalhes</span><b>✳</b><span>olhar com intenção</span><b>✳</b><span>cuidar dos detalhes</span><b>✳</b></div>
        </section>

        <section id="colecoes" className="collections section-pad section-wine">
          <div className="section-heading reveal"><div><p className="eyebrow">o seu próximo olhar</p><h2>Peças com<br /><em>presença.</em></h2></div><p className="section-intro">Uma curadoria que mistura desenho, conforto e personalidade. Escolha pela sensação que fica.</p></div>
          <div className="collection-grid">{collections.map((item) => <CollectionCard key={item.number} item={item} />)}</div>
          <div className="section-foot reveal"><span>coleção 2024 / 2025</span><a className="text-link light" href={whatsappUrl} target="_blank" rel="noreferrer">ver a coleção completa <ArrowIcon /></a></div>
        </section>

        <section id="cuidado" className="services section-pad">
          <div className="services-art reveal"><div className="orbit-ring section-orbit" /><span className="art-number">02</span><p>ver bem<br /><em>é se sentir</em><br />bem.</p></div>
          <div className="services-content"><div className="section-heading reveal"><div><p className="eyebrow">mais que uma ótica</p><h2>Um cuidado<br /><em>à sua medida.</em></h2></div></div><div className="service-list">{services.map((service) => <article className="service-item reveal" key={service.number}><span className="service-number">{service.number}</span><div><h3>{service.title}</h3><p>{service.text}</p></div><ArrowIcon /></article>)}</div></div>
        </section>

        <section id="loja" className="store section-pad section-rose">
          <div className="store-copy reveal"><p className="eyebrow">vem de perto</p><h2>A gente te<br /><em>espera.</em></h2><p>Tem coisa que só acontece quando a gente experimenta com calma. Passe na loja para conversar, provar e encontrar a armação que parece ter sido feita para você.</p><a className="button button-dark" href={mapsUrl} target="_blank" rel="noreferrer">abrir localização <ArrowIcon /></a></div>
          <div className="store-info reveal"><div className="store-block"><span className="info-label">onde</span><p>Rua das Flores, 128<br />Jardim — São Paulo, SP</p><a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">ver no mapa <ArrowIcon /></a></div><div className="store-block"><span className="info-label">quando</span><p>seg a sex · 9h — 18h<br />sáb · 9h — 13h</p></div><div className="store-block"><span className="info-label">conversa</span><p>Quer perguntar alguma coisa?<br />A equipe responde por WhatsApp.</p><a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">falar com a equipe <ArrowIcon /></a></div></div>
        </section>

        <section className="final-cta section-pad"><p className="eyebrow reveal">seu olhar merece atenção</p><h2 className="reveal">Vamos encontrar<br /><em>a sua próxima armação?</em></h2><a className="button button-dark reveal" href={whatsappUrl} target="_blank" rel="noreferrer">chamar no WhatsApp <ArrowIcon /></a></section>
      </main>

      <footer className="site-footer"><a className="wordmark" href="#inicio"><span>thamy</span><i>thamy</i></a><p>cada detalhe importa.</p><div className="footer-links"><a href="https://instagram.com" target="_blank" rel="noreferrer">instagram <ArrowIcon /></a><a href={whatsappUrl} target="_blank" rel="noreferrer">whatsapp <ArrowIcon /></a></div><small>© 2024 Thamy Thamy Ótica</small></footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
