import { isLoggedIn } from "@/api/Auth";
import Header from "@/components/Header";
import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import gemini from "../assets/img/gemini.png"
import ProyectoCard, { CardColorsType } from "@/components/ProyectoCard";
import { Usuario } from "@/api/remoto/types";

interface data {
  usuario: Usuario | null;
}
export function WelcomePage({ usuario }: data) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);

  const [showHeaderPercent, setShowHeaderPercent] = useState(0);
  const [contentFixed, setContentFixed] = useState(true);

  const logedIn = isLoggedIn();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      const start = 0.5 * viewportHeight;
      const end = 0.85 * viewportHeight;

      if (scrollY < start) {
        setShowHeaderPercent(0);
      } else if (scrollY > end) {
        setShowHeaderPercent(1);
      } else {
        const progress = (scrollY - start) / (end - start);
        setShowHeaderPercent(progress);
      }
      if (contentFixed && scrollY >= viewportHeight) setContentFixed(false)
    };

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navigator = useNavigate();

  const empezar = () => {
    if (logedIn) {
      navigator("/perfil");
    } else {
      navigator("/login");
    }
  }

  const empezarProyectos = () => {
    if (logedIn) {
      navigator("/proyectos");
    } else {
      navigator("/login");
    }
  }

  return (
    <div className="main-page">
      <Header style={{
        "opacity": showHeaderPercent,
        "pointerEvents": showHeaderPercent < 0.2 ? "none" : undefined,
      }} onClickLogo={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
      <div className="hero">
        <div className="hero-left">
          <h1>Proyect</h1>
          <small>Proyecta Proyectos</small>
        </div>
        <div className="hero-right">
          <h1>IA</h1>
          <small>con IA</small>
        </div>
      </div>
      <div className="content" style={contentFixed ? { position: "fixed" } : { top: `100vh` }}>
        <section style={{ width: "80%" }}>
          <h1>Tu asistente inteligente para organizar tus ideas</h1>
          <p>¿Tienes una <i>idea</i> o buscas inspiración para tu próximo proyecto? <span className="proyectIA"><b>Proyect IA</b></span> es una plataforma web innovadora diseñada para guiar a los usuarios a través del proceso de conceptualización y estructuración de sus ideas de proyectos. Utilizando la inteligencia artificial, <span className="proyectIA"><b>Proyect IA</b></span> ofrece una experiencia interactiva y personalizada que ayuda a los usuarios a transformar sus visiones en planes concretos y presentables.</p>
        </section>
        <section className="about">
          <div className="about-content">
            <div className="about-text">
              <h1>¿Como funciona <span className="proyectIA">Proyect IA</span> ?</h1>
              <p>
                <span className="proyectIA">Proyect IA</span> usa la{" "}
                <b>API deGemini</b> para convertir tus ideas en proyectos reales. A través de{" "}
                <b>formularios generados dinámicamente</b>, el asistente comprende lo que
                imaginas y te guía paso a paso hasta crear una memoria de proyecto lista
                para exportar.
              </p>
              <p>¡Añade una <b>API key</b> de Gemini a tu cuenta de <b>Proyect AI</b> y empieza hoy mismo!</p>
            </div>
            <div className="gemini-logo">
              <img src={gemini} alt="Gemini logo" onClick={() => window.open('https://aistudio.google.com/api-keys', '_blank', 'noopener,noreferrer')} />
            </div>
          </div>
        </section>
        <section className="funcionalidades">
          <div style={{ display: "flex" }}>
            <div className="funcionalidades-proyectos-grid">
              {
                ["Magenta", "Azul", "Naranja", "Rojo"].map((color, n) => {
                  return <ProyectoCard text={`Proyecto ${n + 1}`} fontSize={2.2} color={color as CardColorsType} onClick={empezarProyectos} specialClass={"tamaño-variable"}></ProyectoCard>;
                })}
            </div>
            <div className="funcionalidades-text">
              <h1>¡No hay límites para tus ideas!</h1>
              <p>
                <span className="proyectIA">Proyect IA</span> te ofrece un espacio ilimitado para que guardes y gestiones todos tus proyectos en un solo lugar. No importa cuántas ideas tengas, aquí podrás estructuraras, paso a paso y sin límites.
              </p>
              <button onClick={empezar}><span>- EMPIEZA AHORA -</span></button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
