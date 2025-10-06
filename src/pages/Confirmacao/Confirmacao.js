import React from 'react';
import HeaderSimples from '../../Components/HeaderSimples';
import Footer from '../../Components/Footer';
import '../Confirmacao/Confirmacao.css';
import SetaVoltar from '../../Components/SetaVoltar';

function Confirmacao() {
  return React.createElement('div', { className: 'confirmacao-container' }, [
    React.createElement(HeaderSimples, { key: 'header' }),

    React.createElement(SetaVoltar, { key: 'seta-voltar' }),

    React.createElement('div', { key: 'mensagem', className: 'mensagem-sucesso' }, [
      React.createElement('h2', { key: 'titulo' }, 'Sua manifestação foi enviada com sucesso!'),
      React.createElement('p', { key: 'texto' },
        'Agradecemos por sua colaboração. Seu feedback será analisado com devida confidencialidade e encaminhado para as respostas da Ouvidoria'
      )
    ]),

    React.createElement(Footer, { key: 'footer' })
  ]);
}

export default Confirmacao;
