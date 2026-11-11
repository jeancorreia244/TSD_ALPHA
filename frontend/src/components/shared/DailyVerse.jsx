import React, { useState, useEffect } from 'react';

const verses = [
  {
    text: 'Aquietai-vos e sabei que eu sou Deus; serei exaltado entre as nações, serei exaltado sobre a terra.',
    reference: 'Salmos 46:10'
  },
  {
    text: 'O Senhor é o meu pastor; nada me faltará.',
    reference: 'Salmos 23:1'
  },
  {
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    reference: 'João 3:16'
  },
  {
    text: 'Posso todas as coisas naquele que me fortalece.',
    reference: 'Filipenses 4:13'
  },
  {
    text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.',
    reference: 'Provérbios 3:5'
  }
];

export function DailyVerse() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(verses[0]);

  useEffect(() => {
    // Seleciona versículo do dia baseado na data
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const verseIndex = dayOfYear % verses.length;
    setCurrentVerse(verses[verseIndex]);

    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`verse-banner transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, var(--tsd-primary) 0%, var(--tsd-primary-dark) 100%)',
        padding: '2rem 1.5rem',
        borderRadius: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Quote decoration */}
      <div
        style={{
          content: '""',
          position: 'absolute',
          top: '-20px',
          left: '20px',
          fontSize: '180px',
          color: 'rgba(255, 255, 255, 0.08)',
          fontFamily: 'Georgia, serif',
          lineHeight: 1,
          pointerEvents: 'none'
        }}
      >
        "
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          className={`verse-text transition-all duration-1000 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{
            fontSize: '1.5rem',
            fontWeight: 400,
            color: 'white',
            marginBottom: '0.75rem',
            lineHeight: 1.5,
            fontStyle: 'italic'
          }}
        >
          {currentVerse.text}
        </p>
        <p
          className={`verse-reference transition-all duration-1000 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
          style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 500
          }}
        >
          {currentVerse.reference}
        </p>
      </div>
    </div>
  );
}

export default DailyVerse;
