import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Dropdown from '../../Components/Dropdown';
import BotaoOuvidoria from '../../Components/BotaoOuvidoria';
import Footer from '../../Components/Footer';
import bannerImage from '../../assets/imagens/bannersenai.png';
import './Home.css';
import ModalHorario from '../../Components/ModalHorario';
import ModalLogin from '../../Components/ModalLogin';
import ModalCadastro from '../../Components/ModalCadastro';
import ModalSenha from '../../Components/ModalSenha';

function Home() {
  const navigate = useNavigate();

  const [modalHorarioVisivel, setModalHorarioVisivel] = useState(false);
  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalCadastroVisivel, setModalCadastroVisivel] = useState(false);
  const [modalSenhaVisivel, setModalSenhaVisivel] = useState(false);

  const [destinoPosLogin, setDestinoPosLogin] = useState('');

  // Detecta usuário logado e se é aluno
  const usuarioLogado = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuarioLogado'));
    } catch (_) {
      return null;
    }
  })();
  const isAlunoLogado = !!(usuarioLogado && usuarioLogado.email && usuarioLogado.email.endsWith('@aluno.senai.br'));

  function isLoggedIn() {
    return !!localStorage.getItem('usuarioLogado');
  }

  function handleOuvidoriaClick(path) {
    if (isLoggedIn()) {
      navigate(path);
    } else {
      setDestinoPosLogin(path);
      setModalLoginVisivel(true);
    }
  }

  function abrirCadastro() {
    setModalLoginVisivel(false);
    setModalCadastroVisivel(true);
  }

  function abrirLogin() {
    setModalCadastroVisivel(false);
    setModalSenhaVisivel(false);
    setModalLoginVisivel(true);
  }

  function abrirSenha() {
    setModalLoginVisivel(false);
    setModalSenhaVisivel(true);
  }

  // Ajuste para receber o usuário logado e decidir a navegação
  function onLoginSuccess(usuario) {
    setModalLoginVisivel(false);
    setModalCadastroVisivel(false);
    setModalSenhaVisivel(false);

    if (destinoPosLogin) {
      navigate(destinoPosLogin);
    } else if (usuario && usuario.tipo) {
      // Redireciona conforme tipo do usuário
      switch (usuario.tipo) {
        case 'Administrador':
          navigate('/admin');
          break;
        case 'Aluno':
          navigate('/aluno');
          break;
        case 'Funcionário':
          navigate('/funcionario');
          break;
        default:
          navigate('/denuncia');
          break;
      }
    } else {
      navigate('/denuncia'); // fallback genérico
    }
  }

  return React.createElement(
    'div',
    { className: 'home-container' },
    [
      React.createElement(Header, { key: 'header' }),

      React.createElement(
        'div',
        { className: 'banner-container', key: 'banner-container' },
        [
          React.createElement('img', {
            src: bannerImage,
            alt: 'Banner SENAI',
            className: 'banner',
            key: 'banner',
          }),
          React.createElement(
            'div',
            { className: 'texto-bemvindo', key: 'texto-bemvindo' },
            [
              React.createElement('h1', { key: 'titulo-ouvidoria' }, 'OUVIDORIA'),
              React.createElement(
                'h2',
                { key: 'subtitulo-bemvindo' },
                'Bem-vindo à Ouvidoria do SENAI Suíço Brasileira'
              ),
            ]
          ),
        ]
      ),

      React.createElement(
        'div',
        { className: 'conteudo-ouvidoria', key: 'conteudo-ouvidoria' },
        [
          React.createElement(
            'div',
            { className: 'drop-area', key: 'drops' },
            [
              React.createElement(
                Dropdown,
                { titulo: 'O que é?', key: 'dropdown-1' },
                'A Ouvidoria é um canal de comunicação entre a comunidade e a escola, onde é possível enviar denúncias, reclamações, sugestões e elogios. Ela busca garantir um atendimento transparente e imparcial.'
              ),
              React.createElement(
                Dropdown,
                { titulo: 'Quem pode utilizar este serviço?', key: 'dropdown-2' },
                'Alunos, pais, colaboradores e todos os membros da comunidade escolar podem acessar a Ouvidoria para expressar suas preocupações, sugestões e reconhecimentos.'
              ),
              React.createElement(
                Dropdown,
                { titulo: 'Etapas para utilização deste serviço', key: 'dropdown-3' },
                '1- Escolha o tipo de manifestação (denúncia, reclamação, elogio ou sugestão). 2- Preencha o formulário com as informações solicitadas. 3- Envie a manifestação e aguarde o retorno da Ouvidoria. 4- Acompanhe o status da sua manifestação, se disponível.'
              ),
              React.createElement(
                Dropdown,
                { titulo: 'Perguntas Frequentes sobre a Ouvidoria', key: 'dropdown-4' },
                'Veja o FAQ no rodapé.'
              ),
              React.createElement(
                Dropdown,
                { titulo: 'Outras informações', key: 'dropdown-5' },
                'Entre em contato conosco.'
              ),
            ]
          ),
          React.createElement(
            'div',
            { className: 'descricao', key: 'desc' },
            'A Ouvidoria da Escola SENAI Suiço-Brasileira é um canal de diálogo que busca garantir transparência e escuta ativa para denúncias, reclamações, sugestões e elogios. Seu objetivo é identificar oportunidades de melhoria e tratar todas as manifestações com imparcialidade, contribuindo para o aperfeiçoamento da escola e a satisfação dos usuários.'
          ),
        ]
      ),

      React.createElement(
        'div',
        { className: 'botoes-ouvidoria', key: 'botoes' },
        [
          React.createElement(BotaoOuvidoria, {
            imagem: 'denuncia.png',
            texto: 'DENÚNCIA',
            onClick: () => handleOuvidoriaClick('/denuncia'),
            key: 'botao-denuncia',
          }),
          React.createElement(BotaoOuvidoria, {
            imagem: 'reclamacao.png',
            texto: 'RECLAMAÇÃO',
            onClick: () => handleOuvidoriaClick('/reclamacao'),
            key: 'botao-reclamacao',
          }),
          React.createElement(BotaoOuvidoria, {
            imagem: 'elogio.png',
            texto: 'ELOGIO',
            onClick: () => handleOuvidoriaClick('/elogio'),
            key: 'botao-elogio',
          }),
          React.createElement(BotaoOuvidoria, {
            imagem: 'sugestao.png',
            texto: 'SUGESTÃO',
            onClick: () => handleOuvidoriaClick('/sugestao'),
            key: 'botao-sugestao',
          }),
        ]
      ),


      React.createElement(
        'button',
        {
          className: 'botao-horario',
          key: 'btn',
          onClick: () => setModalHorarioVisivel(true),
        },
        'VEJA O HORÁRIO DE ATENDIMENTO'
      ),

      modalHorarioVisivel &&
        React.createElement(ModalHorario, {
          onClose: () => setModalHorarioVisivel(false),
          key: 'modal-horario',
        }),

      modalLoginVisivel &&
        React.createElement(ModalLogin, {
          isOpen: modalLoginVisivel,
          onClose: () => setModalLoginVisivel(false),
          onCadastro: abrirCadastro,
          onEsqueciSenha: abrirSenha,
          onLoginSuccess: onLoginSuccess,
          key: 'modal-login',
        }),

      modalCadastroVisivel &&
        React.createElement(ModalCadastro, {
          isOpen: modalCadastroVisivel,
          onClose: () => setModalCadastroVisivel(false),
          onLogin: abrirLogin,
          key: 'modal-cadastro',
        }),

      modalSenhaVisivel &&
        React.createElement(ModalSenha, {
          isOpen: modalSenhaVisivel,
          onClose: () => setModalSenhaVisivel(false),
          onLogin: abrirLogin,
          key: 'modal-senha',
        }),

      React.createElement(Footer, { key: 'footer' }),
    ]
  );
}

export default Home;