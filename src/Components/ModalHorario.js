import React from 'react';
import './ModalHorario.css';

function ModalHorario({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2><strong>Horário de Atendimento</strong></h2>
        <hr />
        <p><strong>Horário de Atendimento da Recepção e/ou Secretaria:</strong></p>
        <p>De Segunda a Sexta-feira das 8h às 20h.<br />
        Aos Sábados das 8h às 16h.</p>

        <p><strong>Horário de Atendimento da Biblioteca</strong></p>
        <p>Segunda-feira: 12h30 às 21h30 – intervalo 18h às 19h<br />
        Terça a sexta-feira: 9h às 21h30 – intervalo 12h15 às 13h15<br />
        Aos Sábados das 9h às 13h.</p>

        <p>Também continuamos atendendo pelas nossas mídias sociais:</p>
        <p><strong>Facebook:</strong> <span className="red">@senai.suico</span></p>
        <p><strong>Instagram:</strong> <span className="red">@senai.suico</span></p>
        <p><strong>e-mail:</strong> <span className="red">secretaria115@sp.senai.br</span></p>

        <button className="fechar-btn" onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}

export default ModalHorario;
