import React from "react";
import "./hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__inner">
        {/* Jeśli w projekcie jest inny plik animacji, podmień ścieżkę poniżej */}
        <video
          className="hero__logo"
          src="/hero_logo_video.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Animowane logo BK"
        />
        <h1 className="hero__title">
          Tworzę strony internetowe i wizualizacje 3D
        </h1>
        <p className="hero__subtitle">
          Szybkie, nowoczesne, dopieszczone pod Core Web Vitals.
        </p>
      </div>
      <div className="hero__peek" />
    </section>
  );
}
