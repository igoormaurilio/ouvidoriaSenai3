import React from 'react';
import './HeaderSimples.css';
import { useLocation, useNavigate } from 'react-router-dom';

function HeaderSimples() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioLogado = (() => {
    try { return JSON.parse(localStorage.getItem('usuarioLogado')); } catch { return null; }
  })();
  const podeVerMural = !!(usuarioLogado && (usuarioLogado.tipo === 'Funcionário' || usuarioLogado.tipo === 'Administrador'));
  const isAdminPage = location.pathname === '/admin';

  return React.createElement('div', { className: 'header-simples-container' }, [
    React.createElement('img', {
      key: 'logo',
      src: require('../assets/imagens/logosenai.png'),
      alt: 'Logo SENAI',
      className: 'logo-simples'
    }),
    podeVerMural && location.pathname !== '/mural-ocorrencias' && !isAdminPage && React.createElement('button', {
      key: 'mural-btn',
      className: 'mural-link-simples',
      onClick: () => navigate('/mural-ocorrencias')
    }, 'Mural de Ocorrências'),
    React.createElement('div', {
      key: 'linha',
      className: 'linha-simples'
    })
  ]);
}

export default HeaderSimples;