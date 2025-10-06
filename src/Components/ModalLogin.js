import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";
import logosenai from "../assets/imagens/logosenai.png";
import boneco from "../assets/imagens/boneco.png";
import cadeado from "../assets/imagens/cadeado.png";

function ModalLogin({ isOpen, onClose, onCadastro, onEsqueciSenha }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const redirecionarPorEmail = (email) => {
    if (email === "pino@senai.br") return navigate("/admin/adm-mec");
    if (email === "chile@senai.br") return navigate("/admin/adm-info");
    if (email === "diretor@senai.br") return navigate("/admin");
    if (email === "viera@senai.br") return navigate("/admin/adm-fac");
    if (email.endsWith("@aluno.senai.br")) return navigate("/");
    if (email.endsWith("@senai.br")) return navigate("/funcionario");
    alert("E-mail não autorizado.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
    if (!usuario) {
      alert("Usuário ou senha inválidos.");
      return;
    }
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    redirecionarPorEmail(email);
    setEmail("");
    setSenha("");
    onClose();
  };

  return React.createElement(
    "div",
    { className: "modal-overlay", onClick: onClose },
    React.createElement(
      "div",
      { className: "modal-container", onClick: (e) => e.stopPropagation() },
      React.createElement("button", { className: "close-btn", onClick: onClose }, "×"),
      React.createElement("img", { src: logosenai, alt: "Logo SENAI", className: "logo-senai-modal" }),
      React.createElement("div", { className: "linha-vermelha" }),
      React.createElement("h2", { className: "titulo-principal" }, "Login"),
      React.createElement(
        "form",
        { onSubmit: handleSubmit },
        React.createElement(
          "div",
          { className: "input-icon-container" },
          React.createElement("img", { src: boneco, alt: "usuário" }),
          React.createElement("input", {
            type: "email",
            placeholder: "E-mail institucional",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          })
        ),
        React.createElement(
          "div",
          { className: "input-icon-container" },
          React.createElement("img", { src: cadeado, alt: "senha" }),
          React.createElement("input", {
            type: "password",
            placeholder: "Senha",
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            required: true,
          })
        ),
        React.createElement("button", { type: "submit", className: "submit-btn" }, "Entrar")
      ),
      React.createElement(
        "div",
        { className: "actions-links" },
        React.createElement("button", { onClick: onEsqueciSenha }, "Esqueceu sua senha?"),
        React.createElement("button", { onClick: onCadastro }, "Primeiro acesso?")
      )
    )
  );
}

export default ModalLogin;
