import React, { useState } from 'react';
import './Dropdown.css';


function Dropdown({ titulo, children }) {
  const [aberto, setAberto] = useState(false);

  return React.createElement('div', { 
    className: 'dropdown',
    style: { height: '50px' }
  }, [
    React.createElement('div', {
      className: 'dropdown-titulo',
      onClick: () => setAberto(!aberto),
      key: 'titulo'
    }, `${titulo} ▾`),
    aberto ? React.createElement('div', { 
      className: 'dropdown-conteudo', 
      key: 'conteudo'
    }, children) : null
  ]);
}

export default Dropdown;
