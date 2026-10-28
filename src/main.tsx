import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const whatsappUrl = 'https://wa.me/5566999573381?text=Ol%C3%A1%2C%20Studio%20Marcelio%20Nogueira!%20Quero%20agendar%20um%20hor%C3%A1rio.';
const instagramUrl = 'https://www.instagram.com/studiomarcelionogueira/';
const tiktokUrl = 'https://www.tiktok.com/@studiomarcelionogueira';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Rua+dos+Cedros+503+Jardim+Botânico+Sinop+MT';
const logoPhoto = './photos/logo.jpg';

const portfolio = [
  { image: './photos/6762.jpg', label: 'Morena iluminada', note: 'luz natural · movimento' },
  { image: './photos/6761.jpg', label: 'Alisamentos', note: 'brilho · alinhamento' },
  { image: './photos/6765.jpg', label: 'Mechas', note: 'cor · dimensão' },
  { image: './photos/6766.jpg', label: 'Cortes', note: 'forma · personalidade' },
  { image: './photos/6767.jpg', label: 'Mãos', note: 'manicure · detalhe' },
  { image: './photos/6770.jpg', label: 'Mãos', note: 'cor · acabamento' },
  { image: './photos/6763.jpg', label: 'Morena iluminada', note: 'brilho · textura' },
  { image: './photos/6768.jpg', label: 'Mãos', note: 'cor · cuidado' },
  { image: './photos/6769.jpg', label: 'Mãos', note: 'acabamento · cor' },
];

const services = [
  { number: '01', title: 'Loiros e mechas', text: 'Iluminação pensada para valorizar o seu tom e a saúde dos fios.' },
  { number: '02', title: 'Alisamentos', text: 'Alinhamento, brilho e movimento com cuidado em cada etapa.' },
  { number: '03', title: 'Cortes e escovas', text: 'Forma que acompanha sua rotina e traduz sua personalidade.' },
  { number: '04', title: 'Manicure e beleza', text: 'Mãos, maquiagem e detalhes para completar o seu momento.' },
];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

function InteractivePhoto() {
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const idleRef = useRef<gsap.core.Timeline | null>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, rotationX: -2, rotationY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!photoRef.current) return;
    const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
    idle.to(photoRef.current, { rotationY: 4, rotationX: -2, y: -8, duration: 3.8, ease: 'sine.inOut' })
      .to(photoRef.current, { rotationY: -4, rotationX: 2, y: 2, duration: 4.2, ease: 'sine.inOut' });
    idleRef.current = idle;
    idle.play();
    return () => { idle.kill(); };
  }, []);

  const rotatePhoto = (rotationX: number, rotationY: number, duration = 0.45) => {
    if (!photoRef.current) return;
    gsap.to(photoRef.current, { rotationX, rotationY, duration, ease: 'power3.out', overwrite: true });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    if (dragRef.current.active) {
      const nextY = dragRef.current.rotationY + (event.clientX - dragRef.current.x) * 0.22;
      const nextX = dragRef.current.rotationX - (event.clientY - dragRef.current.y) * 0.16;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      dragRef.current.rotationX = Math.max(-16, Math.min(16, nextX));
      dragRef.current.rotationY = Math.max(-18, Math.min(18, nextY));
      rotatePhoto(dragRef.current.rotationX, dragRef.current.rotationY, 0.1);
      return;
    }
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    idleRef.current?.pause();
    rotatePhoto(y * -7, x * 12, 0.5);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!photoRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    idleRef.current?.pause();
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      rotationX: Number(gsap.getProperty(photoRef.current, 'rotationX')) || -2,
      rotationY: Number(gsap.getProperty(photoRef.current, 'rotationY')) || 0,
    };
    setIsDragging(true);
  };

  const release = () => {
    dragRef.current.active = false;
    setIsDragging(false);
    idleRef.current?.restart();
  };

  return (
    <div ref={stageRef} className={`hero-photo-stage ${isDragging ? 'is-dragging' : ''}`} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={release} onPointerCancel={release} onPointerLeave={() => !dragRef.current.active && idleRef.current?.restart()}>
      <div className="hero-photo-halo" aria-hidden="true" />
      <div className="hero-photo-orbit orbit-one" aria-hidden="true" />
      <div className="hero-photo-orbit orbit-two" aria-hidden="true" />
      <div className="hero-photo-frame">
        <img ref={photoRef} className="hero-photo" src="./photos/6762.jpg" alt="Resultado de morena iluminada realizado pelo Studio Marcelio Nogueira" draggable="false" />
      </div>
      <div className="photo-tip"><span className="drag-dot" /> toque e arraste</div>
    </div>
  );
}

function PortfolioCard({ item, index }: { item: typeof portfolio[number]; index: number }) {
  return (
    <article className={`portfolio-card portfolio-card-${index + 1} reveal`}>
      <div className="portfolio-image-wrap"><img className="portfolio-image" src={item.image} alt={`${item.label} realizado pelo Studio Marcelio Nogueira`} loading={index > 1 ? 'lazy' : 'eager'} /></div>
      <div className="portfolio-meta"><span>{item.label}</span><small>{item.note}</small></div>
    </article>
  );
}

function App() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.site-header', { y: -25, opacity: 0, duration: .75 })
        .from('.hero-copy > *', { y: 30, opacity: 0, stagger: .09, duration: .8 }, '-=.35')
        .from('.hero-photo-frame', { scale: .82, rotate: -5, opacity: 0, duration: 1.1 }, '-=.7')
        .from('.hero-photo-orbit', { scale: .4, opacity: 0, stagger: .1, duration: .8 }, '-=.9');

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, { y: 45, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } });
      });

      gsap.to('.hero-photo-frame', { yPercent: -13, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero-photo-halo', { scale: 1.14, opacity: .55, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.marquee-track', { xPercent: -40, duration: 24, ease: 'none', repeat: -1 });
      gsap.to('.gold-orbit', { rotation: 360, duration: 32, ease: 'none', repeat: -1 });
      gsap.utils.toArray<HTMLElement>('.portfolio-image').forEach((image) => {
        gsap.to(image, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="Studio Marcelio Nogueira, início"><img src={logoPhoto} alt="Studio Marcelio Nogueira" /><span>studio<br /><b>marcelio</b><br />nogueira</span></a>
        <nav className="desktop-nav" aria-label="Navegação principal"><a href="#trabalhos">trabalhos</a><a href="#servicos">serviços</a><a href="#studio">o studio</a></nav>
        <a className="header-contact" href={whatsappUrl} target="_blank" rel="noreferrer">agendar horário <ArrowIcon /></a>
      </header>

      <main>
        <section id="inicio" className="hero section-pad">
          <div className="hero-copy">
            <p className="hero-kicker"><span className="eyebrow-dot" /> salão de beleza · sinop</p>
            <h1 className="hero-title"><span>Beleza</span><em>com presença.</em></h1>
            <p className="hero-description">Cabelo, cor e cuidado para você se reconhecer no espelho — com técnica, conversa e acabamento.</p>
            <div className="hero-actions"><a className="button button-dark" href="#trabalhos">ver resultados <ArrowIcon /></a><a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">falar com o studio <ArrowIcon /></a></div>
          </div>
          <div className="hero-visual"><div className="hero-index">01 <span>/</span> 04</div><InteractivePhoto /><div className="hero-note"><span>resultado em movimento</span><span className="note-line" /></div></div>
          <div className="hero-bottom-note"><span>cada detalhe transforma</span><span>↓</span></div>
        </section>

        <section className="marquee" aria-label="Especialidades do Studio"><div className="marquee-track"><span>loiros</span><b>✳</b><span>alisamentos</span><b>✳</b><span>cortes</span><b>✳</b><span>mãos impecáveis</span><b>✳</b><span>loiros</span><b>✳</b><span>alisamentos</span><b>✳</b></div></section>

        <section id="trabalhos" className="portfolio-section section-pad section-dark">
          <div className="section-heading reveal"><div><p className="eyebrow">feito no studio</p><h2>Resultado que<br /><em>fala por si.</em></h2></div><p className="section-intro">Cada trabalho começa com uma conversa. O resultado aparece na cor, no movimento e no jeito como você se sente.</p></div>
          <div className="portfolio-grid">{portfolio.map((item, index) => <PortfolioCard key={item.image} item={item} index={index} />)}</div>
          <div className="section-foot reveal"><span>seleção de trabalhos · 2024 / 2025</span><a className="text-link light" href={instagramUrl} target="_blank" rel="noreferrer">ver mais no Instagram <ArrowIcon /></a></div>
        </section>

        <section id="servicos" className="services section-pad">
          <div className="services-art reveal"><img src={logoPhoto} alt="" /><div className="gold-orbit" /><span className="art-number">02</span></div>
          <div className="services-content"><div className="section-heading reveal"><div><p className="eyebrow">o que fazemos</p><h2>Cuidado em<br /><em>cada etapa.</em></h2></div></div><div className="service-list">{services.map((service) => <article className="service-item reveal" key={service.number}><span className="service-number">{service.number}</span><div><h3>{service.title}</h3><p>{service.text}</p></div><ArrowIcon /></article>)}</div></div>
        </section>

        <section id="studio" className="studio-section section-pad section-gold">
          <div className="studio-copy reveal"><p className="eyebrow">sobre o studio</p><h2>Seu tempo<br /><em>bem cuidado.</em></h2><p>O Studio Marcelio Nogueira é um espaço para desacelerar, conversar e sair se sentindo ainda mais você. Técnica e acolhimento caminham juntos em cada atendimento.</p><a className="button button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">marcar meu horário <ArrowIcon /></a></div>
          <div className="studio-strip reveal"><img src="./photos/6767.jpg" alt="Detalhe de manicure do Studio Marcelio Nogueira" /><img src="./photos/6764.jpg" alt="Resultado de mechas do Studio Marcelio Nogueira" /><img src="./photos/6771.jpg" alt="Detalhe de manicure do Studio Marcelio Nogueira" /></div>
        </section>

        <section className="visit-section section-pad"><div className="visit-copy reveal"><p className="eyebrow">vem de perto</p><h2>A gente<br /><em>te espera.</em></h2><p>Rua dos Cedros, nº 503<br />Jardim Botânico · Sinop, MT</p><a className="button button-dark" href={mapsUrl} target="_blank" rel="noreferrer">abrir localização <ArrowIcon /></a></div><div className="visit-info reveal"><div><span>horários</span><p>segunda a sábado<br />08h — 18h</p></div><div><span>conversa</span><p>Agende pelo WhatsApp<br />ou acompanhe no Instagram.</p></div><div className="social-links"><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <ArrowIcon /></a><a href={tiktokUrl} target="_blank" rel="noreferrer">TikTok <ArrowIcon /></a></div></div></section>

        <section className="final-cta section-pad"><p className="eyebrow reveal">seu próximo resultado</p><h2 className="reveal">Vamos criar<br /><em>algo seu?</em></h2><a className="button button-dark reveal" href={whatsappUrl} target="_blank" rel="noreferrer">chamar no WhatsApp <ArrowIcon /></a></section>
      </main>

      <footer className="site-footer"><a className="brand-lockup footer-brand" href="#inicio"><img src={logoPhoto} alt="Studio Marcelio Nogueira" /><span>studio<br /><b>marcelio</b><br />nogueira</span></a><p>beleza com presença.</p><div className="footer-links"><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <ArrowIcon /></a><a href={tiktokUrl} target="_blank" rel="noreferrer">TikTok <ArrowIcon /></a></div><small>© 2025 Studio Marcelio Nogueira</small></footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
