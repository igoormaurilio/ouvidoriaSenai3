import React from 'react';
import seta from '../assets/imagens/icone-voltar.png'; 
import { useNavigate } from 'react-router-dom';

function SetaVoltar() {
  const navigate = useNavigate();

  return React.createElement('img', {
    src: seta,
    alt: 'Voltar',
    className: 'seta-voltar',
    onClick: () => navigate(-1),
  });
}

export default SetaVoltar;
