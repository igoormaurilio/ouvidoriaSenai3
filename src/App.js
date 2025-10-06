import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas de Conteúdo
import Home from './pages/Home/Home';
import Confirmacao from './pages/Confirmacao/Confirmacao';
import Denuncia from './pages/Denuncia/Denuncia';
import Elogio from './pages/Elogio/Elogio';
import Sugestao from './pages/Sugestao/Sugestao';
import Reclamacao from './pages/Reclamacao/Reclamacao';
import Aluno from './pages/Aluno/Aluno';
import Funcionario from './pages/Funcionario/Funcionario';

// Páginas de Administração (Corrigidas: AdmAQV estava faltando)
import Admin from './pages/Admin/Admin';
import AdmInfo from './pages/AdmInfo/AdmInfo';
import AdmMec from './pages/AdmMecan/AdmMec';
import AdmFac from './pages/AdmFac/AdmFac'; 

// Páginas de Usuários (Corrigidas: UsuariosAQV estava faltando)
import UsuariosInfo from './pages/Usuarios/UsuariosInfo';
import UsuariosMec from './pages/Usuarios/UsuariosMec';
import UsuariosGeral from './pages/Usuarios/UsuariosGeral';
import UsuariosFac from './pages/Usuarios/UsuariosFac.js'; // <-- IMPORTAÇÃO ADICIONADA

// Componentes Modais
import ModalLogin from './Components/ModalLogin';
import ModalCadastro from './Components/ModalCadastro';
import ModalSenha from './Components/ModalSenha';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isSenhaOpen, setIsSenhaOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openCadastroModal = () => setIsCadastroOpen(true);
  const closeCadastroModal = () => setIsCadastroOpen(false);

  const openSenhaModal = () => setIsSenhaOpen(true);
  const closeSenhaModal = () => setIsSenhaOpen(false);

  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Routes,
        null,

        // Rotas de Conteúdo Público
        React.createElement(Route, {
          key: 'home',
          path: '/',
          element: React.createElement(Home, { openLoginModal })
        }),
        React.createElement(Route, {
          key: 'confirmacao',
          path: '/confirmacao',
          element: React.createElement(Confirmacao)
        }),
        React.createElement(Route, {
          key: 'denuncia',
          path: '/denuncia',
          element: React.createElement(Denuncia)
        }),
        React.createElement(Route, {
          key: 'elogio',
          path: '/elogio',
          element: React.createElement(Elogio)
        }),
        React.createElement(Route, {
          key: 'sugestao',
          path: '/sugestao',
          element: React.createElement(Sugestao)
        }),
        React.createElement(Route, {
          key: 'reclamacao',
          path: '/reclamacao',
          element: React.createElement(Reclamacao)
        }),
        React.createElement(Route, {
          key: 'aluno',
          path: '/aluno',
          element: React.createElement(Aluno)
        }),
        React.createElement(Route, {
          key: 'funcionario',
          path: '/funcionario',
          element: React.createElement(Funcionario)
        }),

        // Rotas de Administração Geral
        React.createElement(Route, {
          key: 'admin',
          path: '/admin',
          element: React.createElement(Admin)
        }),
        React.createElement(Route, {
          key: 'usuarios-geral',
          path: '/admin/usuarios-geral',
          element: React.createElement(UsuariosGeral)
        }),

        // Rotas da Área de Informática
        React.createElement(Route, {
          key: 'usuarios-info',
          path: '/admin/usuarios-info',
          element: React.createElement(UsuariosInfo)
        }),
        React.createElement(Route, {
          key: 'adm-info',
          path: '/admin/adm-info',
          element: React.createElement(AdmInfo)
        }),

        // Rotas da Área de Mecânica
        React.createElement(Route, {
          key: 'usuarios-mec',
          path: '/admin/usuarios-mec',
          element: React.createElement(UsuariosMec)
        }),
        React.createElement(Route, {
          key: 'adm-mec',
          path: '/admin/adm-mec',
          element: React.createElement(AdmMec)
        }),

        
        React.createElement(Route, {
          key: 'adm-fac',
          path: '/admin/adm-fac',
          element: React.createElement(AdmFac)
        }),
        React.createElement(Route, {
          key: 'usuarios-fac', 
          path: '/admin/usuarios-fac',
          element: React.createElement(UsuariosFac)
        })
      ),

      // Modais
      React.createElement(ModalLogin, {
        key: 'modal-login',
        isOpen: isLoginOpen,
        onClose: closeLoginModal,
        onCadastro: openCadastroModal,
        onEsqueciSenha: openSenhaModal
      }),
      React.createElement(ModalCadastro, {
        key: 'modal-cadastro',
        isOpen: isCadastroOpen,
        onClose: closeCadastroModal
      }),
      React.createElement(ModalSenha, {
        key: 'modal-senha',
        isOpen: isSenhaOpen,
        onClose: closeSenhaModal
      })
    )
  );
}

export default App;
