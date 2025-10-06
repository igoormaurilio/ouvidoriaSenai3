import React from 'react';
import './BotaoOuvidoria.css';

function BotaoOuvidoria({ imagem, texto, onClick }) {
  return React.createElement('div', { className: 'botao-ouvidoria', onClick }, [
    React.createElement('img', {
      key: 'img',
      src: require(`../assets/imagens/${imagem}`),
      alt: texto,
      className: 'icone-ouvidoria'
    }),
    React.createElement('p', { key: 'texto' }, texto)
  ]);
}

export default BotaoOuvidoria;
