import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

function ModalSenha({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const redirecionarPorEmail = (email) => {
    // Administradores específicos
    if (email === "pino@senai.br") return navigate("/admin/adm-mec");
    if (email === "chile@senai.br") return navigate("/admin/adm-info");
    if (email === "diretor@senai.br") return navigate("/admin");
    if (email === "viera@senai.br") return navigate("/adm-fac");
    
    // Coordenadores
    if (email === "chile@coordenador.senai") return navigate("/admin/adm-fac");
    if (email === "pino@coordenador.senai") return navigate("/admin/adm-fac");
    if (email === "vieira@coordenador.senai") return navigate("/admin/adm-fac");
    
    // Outros usuários
    if (email.endsWith("@aluno.senai.br")) return navigate("/aluno");
    if (email.endsWith("@senai.br")) return navigate("/funcionario");
    alert("E-mail não autorizado.");
  };

  const handleSenha = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = usuarios.findIndex((u) => u.email === email);

    if (index === -1) {
      alert("Usuário não encontrado.");
      return;
    }

    usuarios[index].senha = novaSenha;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[index]));
    alert("Senha redefinida com sucesso!");

    redirecionarPorEmail(email);
    setEmail("");
    setNovaSenha("");
    onClose();
  };

  return React.createElement(
    "div",
    { className: "modal-overlay", onClick: onClose },
    React.createElement(
      "div",
      { className: "modal-container", onClick: (e) => e.stopPropagation() },
      React.createElement("button", { className: "close-btn", onClick: onClose }, "×"),
      React.createElement("h2", { className: "titulo-principal" }, "Redefinir Senha"),
      React.createElement(
        "form",
        { onSubmit: handleSenha },
        React.createElement("input", {
          type: "email",
          placeholder: "Digite seu e-mail",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
        }),
        React.createElement("input", {
          type: "password",
          placeholder: "Nova senha",
          value: novaSenha,
          onChange: (e) => setNovaSenha(e.target.value),
          required: true,
        }),
        React.createElement("button", { type: "submit", className: "submit-btn" }, "Salvar Senha")
      )
    )
  );
}

export default ModalSenha;
