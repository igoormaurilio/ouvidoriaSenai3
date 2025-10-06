import React from 'react';
import './Footer.css';

function Footer() {
  return React.createElement('footer', { className: 'footer' }, [
    React.createElement('div', { key: 'redes', className: 'redes-sociais' }, [
      React.createElement('a', { key: 'facebook', href: 'https://www.facebook.com/senai.suico/?locale=pt_BR', className: 'icon-circle' },
        React.createElement('img', { src: require('../assets/imagens/facebook.png'), alt: 'Facebook' })
      ),
      React.createElement('a', { key: 'x', href: 'https://x.com/senaisuico', className: 'icon-circle' },
        React.createElement('img', { src: require('../assets/imagens/x.png'), alt: 'X' })
      ),
      React.createElement('a', { key: 'youtube', href: 'https://www.youtube.com/@SenaiSuico-BrasileiraPauloETol', className: 'icon-circle' },
        React.createElement('img', { src: require('../assets/imagens/yt.png'), alt: 'YouTube' })
      ),
      React.createElement('a', { key: 'linkedin', href: 'https://br.linkedin.com/school/senaisp-suico/', className: 'icon-circle' },
        React.createElement('img', { src: require('../assets/imagens/linkedin.png'), alt: 'LinkedIn' })
      ),
      React.createElement('a', { key: 'instagram', href: 'https://www.instagram.com/senai.suico/', className: 'icon-circle' },
        React.createElement('img', { src: require('../assets/imagens/instagram.png'), alt: 'Instagram' })
      ),
      React.createElement('a', { key: 'whatsapp', href: 'https://wa.me/551156423407', className: 'icon-circle', target: '_blank', rel: 'noopener noreferrer' },
        React.createElement('img', { src: require('../assets/imagens/whatsappp.png'), alt: 'WhatsApp' })
      ),
    ]),
    React.createElement('div', { key: 'info', className: 'footer-info' }, [
      React.createElement('div', { key: 'unidade', className: 'info-bloco' }, [
        React.createElement('h4', { key: 'titulo' }, 'EDIFÍCIO SEDE FIESP'),
        React.createElement('p', { key: 'linha1' }, 'Av. Paulista, 1313, São Paulo/SP'),
        React.createElement('p', { key: 'linha2' }, 'CEP 01311-923')
      ]),
      React.createElement('div', { key: 'unidade2', className: 'info-bloco' }, [
        React.createElement('h4', { key: 'titulo' }, 'SENAI Santo Amaro - Suíço-Brasileira'),
        React.createElement('p', { key: 'linha1' }, 'Rua Bento Branco de Andrade Filho, 379 - Santo Amaro'),
        React.createElement('p', { key: 'linha2' }, 'São Paulo - SP - CEP: 04757-000'),
        React.createElement('p', { key: 'linha3' }, 'Telefone: (11) 5642-3400'),
        React.createElement('p', { key: 'linha4' }, 'WhatsApp: (11) 5642-3407')
      ]),
      React.createElement('div', { key: 'unidade3', className: 'info-bloco' }, [
        React.createElement('h4', { key: 'titulo' }, 'CENTRAL DE RELACIONAMENTO'),
        React.createElement('p', { key: 'linha1' }, '(11) 3322-0050 (Telefone/WhatsApp)'),
        React.createElement('p', { key: 'linha2' }, '0800-055-1000 (Interior de SP, somente telefone fixo)')
      ])
    ]),
    React.createElement('div', { key: 'links', className: 'footer-links' }, [
      React.createElement('a', { key: 'link1', href: 'https://www.sp.senai.br/unidades' }, 'Unidades'),
      React.createElement('a', { key: 'link2', href: 'https://www.sp.senai.br/' }, 'O SENAI'), 
      React.createElement('a', { key: 'link4', href: 'https://transparencia.sp.senai.br/sac' }, 'Fale Conosco'),
      React.createElement('a', { key: 'link5', href: 'https://transparencia.sp.senai.br/' }, 'Transparência'),
    
    ]),
    React.createElement('p', { key: 'copy', className: 'footer-copy' }, 'Copyright 2025 © Todos os direitos reservados.')
  ]);
}


export default Footer;
