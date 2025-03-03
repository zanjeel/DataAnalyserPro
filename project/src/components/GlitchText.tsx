import React from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  text: string;
  primaryColor?: string;
  glitchColor1?: string;
  glitchColor2?: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  primaryColor = '#ffffff',
  glitchColor1 = '#ff0000',
  glitchColor2 = '#0000ff',
  className = '',
}) => {
  return (
    <div className={`glitch-container ${className}`} style={{ '--primary-color': primaryColor } as React.CSSProperties}>
      <div className="glitch" data-text={text}>
        <span className="glitch-text" style={{ '--glitch-color-1': glitchColor1, '--glitch-color-2': glitchColor2 } as React.CSSProperties}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default GlitchText; 