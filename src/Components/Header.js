import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom'; // ✅ Importa useNavigate
import logoSenai from '../assets/imagens/logosenai.png';
import iconeUsuario from '../assets/imagens/boneco.png';

import ModalLogin from './ModalLogin';
import ModalCadastro from './ModalCadastro';
import ModalSenha from './ModalSenha';

function Header() {
  const navigate = useNavigate(); // ✅ Hook de navegação
  const [modalAberto, setModalAberto] = useState(''); // 'login', 'cadastro', 'senha', ''

  const menuItems = [
    { texto: 'O SENAI', ativo: true, link: 'https://www.sp.senai.br/' },
    { texto: 'Transparência', link: 'https://transparencia.sp.senai.br/' },
    { texto: 'Contato com a Ouvidoria' }
  ];

  // Detecta se há aluno logado para alterar o texto do botão
  let isAlunoLogado = false;
  try {
    const uStr = localStorage.getItem('usuarioLogado');
    if (uStr) {
      const u = JSON.parse(uStr);
      isAlunoLogado = !!(u && u.email && u.email.endsWith('@aluno.senai.br'));
    }
  } catch (_) {}

  // Detecta se está logado e implementa login/logout no botão do usuário
  function isLogged() {
    return !!localStorage.getItem('usuarioLogado');
  }

  function handleUsuarioClick() {
    if (isLogged()) {
      // Logout
      try {
        localStorage.removeItem('usuarioLogado');
      } catch (_) {}
      setModalAberto('');
      navigate('/');
      return;
    }
    // Não logado → abre modal de login
    setModalAberto('login');
  }

  return (
    <>
      <header className="header">
        <img src={logoSenai} alt="Logo SENAI" className="logo-senai" />

        <nav className="nav-menu">
          {menuItems.map(({ texto, ativo, link }, index) => (
            <a
              href={link ? link : '#'}
              key={index}
              className={`nav-item ${ativo ? 'ativo' : ''}`}
              {...(link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {texto}
            </a>
          ))}

          {/* Botão/link do Painel do Aluno quando aluno estiver logado */}
          {isAlunoLogado && (
            <a
              href="#"
              className="nav-item ativo"
              onClick={(e) => { e.preventDefault(); navigate('/aluno'); }}
            >
              Painel do Aluno
            </a>
          )}
        </nav>

        <button
          className="usuario"
          type="button"
          onClick={handleUsuarioClick}
        >
          <div className="divisor" />
          <img src={iconeUsuario} alt="Usuário" className="icone-usuario" />
          <span className="sou-aluno">{isLogged() ? 'Sair' : 'Entrar'}</span>
        </button>
      </header>

      {/* Modal Login */}
      {React.createElement(ModalLogin, {
        key: 'modal-login',
        isOpen: modalAberto === 'login',
        onClose: () => setModalAberto(''),
        onCadastro: () => setModalAberto('cadastro'),
        onEsqueciSenha: () => setModalAberto('senha')
      })}

      {/* Modal Cadastro */}
      {React.createElement(ModalCadastro, {
        key: 'modal-cadastro',
        isOpen: modalAberto === 'cadastro',
        onClose: () => setModalAberto('login')
      })}

      {/* Modal Esqueci Senha */}
      {React.createElement(ModalSenha, {
        key: 'modal-senha',
        isOpen: modalAberto === 'senha',
        onClose: () => setModalAberto('login')
      })}
    </>
  );
}

export default Header;