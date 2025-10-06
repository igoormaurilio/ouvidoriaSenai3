import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";
import logosenai from "../assets/imagens/logosenai.png";
import boneco from "../assets/imagens/boneco.png";
import cadeado from "../assets/imagens/cadeado.png";

function ModalCadastro({ isOpen, onClose }) {
  // 1. NOVOS ESTADOS ADICIONADOS: telefone e cpf
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState(""); // NOVO ESTADO
  const [cpf, setCpf] = useState("");       // NOVO ESTADO
  const [mostrarCurso, setMostrarCurso] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const redirecionarPorEmail = (email) => {
    if (email === "pino@senai.br") return navigate("/admin/adm-mec");
    if (email === "chile@senai.br") return navigate("/admin/adm-info");
    if (email === "diretor@senai.br") return navigate("/admin");
    if (email === "viera@senai.br") return navigate("/adm-fac");
    if (email.endsWith("@aluno.senai.br")) return navigate("/");
    if (email.endsWith("@senai.br")) return navigate("/funcionario");
    alert("E-mail não autorizado.");
  };

  // Cadastro inicial
  const handleCadastro = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.find((u) => u.email === email)) {
      alert("E-mail já cadastrado!");
      return;
    }

    // 2. NOVOS CAMPOS INCLUÍDOS NO OBJETO TEMPORÁRIO
    const usuarioTemp = { nome, email, senha, telefone, cpf };
    setNovoUsuario(usuarioTemp);

    // Mostrar tela de curso apenas para alunos e funcionários
    if (email.endsWith("@aluno.senai.br") || email.endsWith("@senai.br")) {
      setMostrarCurso(true);
    } else {
      usuarios.push(usuarioTemp);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioTemp));
      alert("Cadastro realizado com sucesso!");
      redirecionarPorEmail(email);
      setNome(""); setEmail(""); setSenha(""); setTelefone(""); setCpf(""); // Limpa estados
      onClose();
    }
  };

  // Quando o usuário escolhe o curso
  const handleEscolhaCurso = (curso) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // O objeto novoUsuario já contém nome, email, senha, telefone e cpf
    const usuarioFinal = { ...novoUsuario, curso }; 
    usuarios.push(usuarioFinal);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioFinal));
    alert("Cadastro realizado com sucesso!");
    redirecionarPorEmail(novoUsuario.email);
    
    // Limpa todos os estados
    setNome(""); setEmail(""); setSenha(""); setTelefone(""); setCpf(""); 
    setNovoUsuario(null); setMostrarCurso(false);
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
      // Tela de cadastro inicial
      !mostrarCurso &&
        React.createElement(
          "div",
          null,
          React.createElement("h2", { className: "titulo-principal" }, "Cadastro"),
          React.createElement(
            "form",
            { onSubmit: handleCadastro },
            React.createElement(
              "div",
              { className: "input-icon-container" },
              React.createElement("img", { src: boneco, alt: "nome" }),
              React.createElement("input", {
                type: "text",
                placeholder: "Nome Completo",
                value: nome,
                onChange: (e) => setNome(e.target.value),
                required: true,
              })
            ),
            // NOVO CAMPO: CPF
            React.createElement(
              "div",
              { className: "input-icon-container" },
              React.createElement("img", { src: boneco, alt: "cpf" }),
              React.createElement("input", {
                type: "text",
                placeholder: "CPF (Somente números)",
                value: cpf,
                onChange: (e) => setCpf(e.target.value.replace(/\D/g, '').substring(0, 11)), // Limita a 11 dígitos numéricos
                required: true,
                maxLength: 11
              })
            ),
            // NOVO CAMPO: TELEFONE
            React.createElement(
              "div",
              { className: "input-icon-container" },
              React.createElement("img", { src: boneco, alt: "telefone" }),
              React.createElement("input", {
                type: "tel",
                placeholder: "Telefone (ex: 11987654321)",
                value: telefone,
                onChange: (e) => setTelefone(e.target.value.replace(/\D/g, '').substring(0, 11)), // Limita a 11 dígitos numéricos
                required: true,
                maxLength: 11
              })
            ),
            
            React.createElement(
              "div",
              { className: "input-icon-container" },
              React.createElement("img", { src: boneco, alt: "email" }),
              React.createElement("input", {
                type: "email",
                placeholder: "E-mail (obrigatório: @senai.br ou @aluno.senai.br)",
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
            React.createElement(
              "button",
              { type: "submit", className: "submit-btn" },
              "Cadastrar"
            )
          )
        ),

      // Tela de escolha de curso
      mostrarCurso &&
        React.createElement(
          "div",
          null,
          React.createElement("h2", { className: "titulo-principal" }, "Cadastro"),
          React.createElement("h2", { className: "titulo-principal" }, "Escolha seu curso"),
          React.createElement(
            "p",
            null,
            "Selecione se você é da Mecânica ou da Informática:"
          ),
          React.createElement(
            "div",
            { className: "botoes-curso" },
            React.createElement(
              "button",
              { onClick: () => handleEscolhaCurso("Mecânica") },
              "Mecânica"
            ),
            React.createElement(
              "button",
              { onClick: () => handleEscolhaCurso("Informática") },
              "Informática"
            )
          )
        )
    )
  );
}

export default ModalCadastro;