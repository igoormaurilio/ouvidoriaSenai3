import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSimples from "../../Components/HeaderSimples";
import Footer from "../../Components/Footer";
import CrudService from "../../services/CrudService";
import SetaVoltar from "../../Components/SetaVoltar";
import "./Funcionario.css";

function Funcionario() {
  const navigate = useNavigate();
  const [manifestacoes, setManifestacoes] = useState([]);
  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  const [itemVisualizando, setItemVisualizando] = useState(null);

  // Verifica se o usuário está logado com email de aluno
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado || !usuarioLogado.email?.endsWith("@senai.br")) {
      alert("Apenas funcionarios com e-mail @senai.br podem acessar esta página.");
      navigate("/");
      return;
    }

    carregarManifestacoes();
  }, [navigate]);

  // Carrega manifestações do aluno logado
  const carregarManifestacoes = () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) return;

    let dados = CrudService.getByEmail(usuarioLogado.email);

    // Mostra apenas manifestações visíveis para o aluno
    dados = dados.filter(
      (item) => item.visibilidade === "todos" || item.status === "resolvido"
    );

    setManifestacoes(dados);
  };

  const iniciarVisualizacao = (item) => {
    setModoVisualizacao(true);
    setItemVisualizando({ ...item });
  };

  const fecharVisualizacao = () => {
    setModoVisualizacao(false);
    setItemVisualizando(null);
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
  };

  const traduzirTipo = (tipo) => {
    const tipos = {
      [CrudService.TIPOS_MANIFESTACAO.RECLAMACAO]: "Reclamação",
      [CrudService.TIPOS_MANIFESTACAO.DENUNCIA]: "Denúncia",
      [CrudService.TIPOS_MANIFESTACAO.ELOGIO]: "Elogio",
      [CrudService.TIPOS_MANIFESTACAO.SUGESTAO]: "Sugestão",
    };
    return tipos[tipo] || tipo;
  };

  const traduzirStatus = (status) => {
    const statusMap = {
      pendente: "Pendente",
      em_analise: "Em Análise",
      resolvido: "Resolvido",
      arquivado: "Arquivado",
    };
    return statusMap[status] || status;
  };

  return React.createElement(
    "div",
    { className: "aluno-container" },
    React.createElement(HeaderSimples),
    React.createElement('div', { className: 'seta-voltar-container' }, 
        React.createElement(SetaVoltar)
    ),
    React.createElement(
      "div",
      { className: "aluno-content" },
      React.createElement(
        "div",
        { className: "aluno-header" },
        React.createElement(
          "div",
          null,
          React.createElement("h2", null, "Painel do Funcionario"),
          React.createElement("p", null, "Acompanhe suas manifestações na ouvidoria")
        ),
        React.createElement(
          "button",
          {
            className: "btn-logout",
            onClick: () => {
              localStorage.removeItem("usuarioLogado");
              navigate("/");
            },
          },
          "Sair"
        )
      ),
      modoVisualizacao && itemVisualizando
        ? React.createElement(
            "div",
            { className: "detalhes-manifestacao" },
            React.createElement("h3", null, "Detalhes da Manifestação"),
            ["tipo", "nome", "contato", "local", "dataHora", "descricao", "status", "dataCriacao"].map((campo) =>
              React.createElement(
                "div",
                { className: "campo-visualizacao", key: campo },
                React.createElement("label", null, campo[0].toUpperCase() + campo.slice(1) + ":"),
                React.createElement(
                  campo === "descricao" ? "p" : "span",
                  { className: campo === "descricao" ? "descricao-texto" : "" },
                  campo === "tipo"
                    ? traduzirTipo(itemVisualizando[campo])
                    : campo === "status"
                    ? traduzirStatus(itemVisualizando[campo])
                    : campo === "dataCriacao"
                    ? formatarData(itemVisualizando[campo])
                    : itemVisualizando[campo] || "-"
                )
              )
            ),
            itemVisualizando.dataAtualizacao &&
              React.createElement(
                "div",
                { className: "campo-visualizacao" },
                React.createElement("label", null, "Última Atualização:"),
                React.createElement("span", null, formatarData(itemVisualizando.dataAtualizacao))
              ),
            React.createElement(
              "div",
              { className: "acoes-visualizacao" },
              React.createElement(
                "button",
                { className: "btn-voltar", onClick: fecharVisualizacao },
                "Voltar"
              )
            )
          )
        : React.createElement(
            "div",
            { className: "lista-manifestacoes" },
            React.createElement("h3", null, "Minhas Manifestações"),
            manifestacoes.length === 0
              ? React.createElement(
                  "p",
                  { className: "sem-registros" },
                  "Você ainda não possui manifestações registradas."
                )
              : React.createElement(
                  "table",
                  { className: "tabela-manifestacoes" },
                  React.createElement(
                    "thead",
                    null,
                    React.createElement(
                      "tr",
                      null,
                      ["Tipo", "Data Criação", "Status", "Ações"].map((h, i) =>
                        React.createElement("th", { key: i }, h)
                      )
                    )
                  ),
                  React.createElement(
                    "tbody",
                    null,
                    manifestacoes.map((item) =>
                      React.createElement(
                        "tr",
                        { key: item.id },
                        React.createElement("td", null, traduzirTipo(item.tipo)),
                        React.createElement("td", null, formatarData(item.dataCriacao)),
                        React.createElement(
                          "td",
                          null,
                          React.createElement(
                            "span",
                            { className: `status-${item.status}` },
                            traduzirStatus(item.status)
                          )
                        ),
                        React.createElement(
                          "td",
                          null,
                          React.createElement(
                            "button",
                            {
                              className: "btn-visualizar",
                              onClick: () => iniciarVisualizacao(item),
                            },
                            "Visualizar"
                          )
                        )
                      )
                    )
                  )
                )
          )
    ),
    React.createElement(Footer)
  );
}

export default Funcionario;
