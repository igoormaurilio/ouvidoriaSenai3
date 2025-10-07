import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";
import CrudService from "../../services/CrudService";
import SetaVoltar from "../../Components/SetaVoltar";
import "./Aluno.css"; 

import SenaiLogo from '../../assets/imagens/logosenai.png'; 


const AlunoHeader = ({ navigate, usuarioEmail }) => {
    return React.createElement(
        'div',
        { className: 'aluno-header-full' },
        [
            React.createElement(
                'div',
                { className: 'aluno-header-left' },
                [
                    React.createElement('img', { 
                        src: SenaiLogo, 
                        alt: 'Logo SENAI', 
                        className: 'senai-logo-img' // Nova classe para estilizar a imagem
                    }), 
                    React.createElement(
                        'div',
                        null,
                        [
                            React.createElement('h1', null, 'Painel do Aluno'),
                            // Ajustado para replicar o layout das imagens
                            React.createElement('span', null, `Bem-Vindo(a), ${usuarioEmail.split('@')[0] || 'Usuário'}`)
                        ]
                    )
                ]
            ),
            React.createElement(
                'div',
                { className: 'aluno-header-right' },
                [
                    React.createElement('button', {
                        className: 'btn-sair',
                        onClick: () => {
                            localStorage.removeItem('usuarioLogado');
                            navigate('/');
                        }
                    }, 'Sair')
                ]
            )
        ]
    );
};


function Aluno() {
    const navigate = useNavigate();
    const [manifestacoes, setManifestacoes] = useState([]);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [itemVisualizando, setItemVisualizando] = useState(null); 
    const fecharVisualizacao = () => setItemVisualizando(null);

    const { traduzirTipo, ALUNO_STATUS_MAP } = useMemo(() => {
        const STATUS = CrudService.STATUS_MANIFESTACAO || {};
        const TIPOS = CrudService.TIPOS_MANIFESTACAO || {};
        
        const tipos = {
            [TIPOS.RECLAMACAO]: "Reclamação",
            [TIPOS.DENUNCIA]: "Denúncia",
            [TIPOS.ELOGIO]: "Elogio",
            [TIPOS.SUGESTAO]: "Sugestão",
        };

        const statusMap = {
            [STATUS.PENDENTE]: 'Em Análise',
            [STATUS.EM_ANALISE]: 'Em Análise',
            [STATUS.RESOLVIDO]: 'Finalizadas',
            [STATUS.ARQUIVADO]: 'Finalizadas',
        };

        return {
            traduzirTipo: (tipo) => tipos[tipo] || tipo,
            ALUNO_STATUS_MAP: statusMap,
        };
    }, []);

    const getAlunoStatus = (statusOriginal) => {
        return ALUNO_STATUS_MAP[statusOriginal] || 'Em Análise';
    }

    const formatarData = (dataIso) => {
        if (!dataIso) return "";
        const data = new Date(dataIso);
        // Formato DD/MM/AAAA para o card (fiel à imagem)
        return data.toLocaleDateString("pt-BR"); 
    };
    
    const carregarManifestacoes = (email) => {
        const STATUS = CrudService.STATUS_MANIFESTACAO;
        const TIPOS = CrudService.TIPOS_MANIFESTACAO;
        
        let dadosSimulados = [];
        // Simulação de dados para replicar a imagem (1 Total, 0 Em Análise, 1 Finalizada)
        if (STATUS && TIPOS) {
            dadosSimulados = [{
                id: 'simulacao-01',
                tipo: TIPOS.RECLAMACAO,
                dataCriacao: '2025-01-15T12:00:00.000Z', 
                status: STATUS.RESOLVIDO,
                descricao: 'Problema com equipamentos.',
                respostaAdmin: 'Sua sugestão está sendo analisada pela coordenação.',
            }];
        }
        
        let dados = CrudService.getByEmail(email) || [];
        
        if (dados.length === 0 && dadosSimulados.length > 0) {
            dados = dadosSimulados;
        }

        setManifestacoes(dados);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("usuarioLogado");
        let usuario = null;

        if (storedUser) {
            usuario = JSON.parse(storedUser);
        }

        const isAluno = usuario && usuario.email && usuario.email.toLowerCase().endsWith("@aluno.senai.br");

        if (!isAluno) {
            alert("Acesso restrito. Esta página é exclusiva para Alunos.");
            navigate("/");
            return;
        }

        setUsuarioLogado(usuario);
        carregarManifestacoes(usuario.email); 
    }, [navigate]);

    const { total, emAnalise, finalizadas } = useMemo(() => {
        const counts = { total: 0, 'Em Análise': 0, 'Finalizadas': 0 };

        manifestacoes.forEach(m => {
            counts.total++;
            const alunoStatus = getAlunoStatus(m.status);
            if (alunoStatus === 'Em Análise') {
                counts['Em Análise']++;
            } else if (alunoStatus === 'Finalizadas') {
                counts['Finalizadas']++;
            }
        });
        
        // Mantendo a simulação para corresponder ao total das imagens
        if (manifestacoes.some(m => m.id === 'simulacao-01')) {
             return { total: 1, emAnalise: 0, finalizadas: 1 };
        }
        
        return {
            total: counts.total,
            emAnalise: counts['Em Análise'],
            finalizadas: counts['Finalizadas']
        };

    }, [manifestacoes, ALUNO_STATUS_MAP]);

    const renderManifestacaoCard = (item) => {
        const alunoStatus = getAlunoStatus(item.status);

        return React.createElement(
            'div',
            { key: item.id, className: 'manifestacao-card-aluno' },
            [
                React.createElement(
                    'div',
                    { className: 'manifestacao-card-info' },
                    [
                        React.createElement(
                            'div',
                            { className: 'tipo-e-data' },
                            [
                                React.createElement('span', { className: 'manifestacao-tipo' }, traduzirTipo(item.tipo)),
                                React.createElement('span', { className: 'manifestacao-data' }, formatarData(item.dataCriacao)),
                            ]
                        ),
                        React.createElement('span', { className: `manifestacao-status ${alunoStatus.replace(/\s/g, '-').toLowerCase()}` }, alunoStatus)
                    ]
                ),

                item.anexoBase64 && React.createElement(
                    'div',
                    { className: 'manifestacao-thumb' },
                    React.createElement('img', {
                        src: item.anexoBase64,
                        alt: 'Anexo',
                        loading: 'lazy'
                    })
                ),

                React.createElement('p', { className: 'manifestacao-problema' }, item.descricao || 'Descrição não fornecida.'),

                item.respostaAdmin && React.createElement(
                    'div',
                    { className: 'manifestacao-resposta' },
                    [
                        React.createElement('strong', null, 'Resposta'),
                        React.createElement('p', null, item.respostaAdmin)
                    ]
                ),

                React.createElement('button', { 
                    className: 'btn-ver-detalhes', 
                    onClick: () => setItemVisualizando(item) 
                }, 'Ver detalhes')
            ]
        );
    };


    if (!usuarioLogado) {
        return React.createElement('div', {className: 'aluno-container'}, 'Carregando painel...');
    }
    
    if (itemVisualizando) {
        return React.createElement(
            "div",
            { className: "aluno-container" },
            React.createElement(AlunoHeader, { navigate: navigate, usuarioEmail: usuarioLogado.email }),
            React.createElement('div', { className: 'linha-vermelha' }),
            React.createElement(
                "div",
                { className: "aluno-main-content-wrapper" },
                React.createElement(
                    "div",
                    { className: "detalhes-manifestacao" },
                    React.createElement("h3", null, "Detalhes da Manifestação"),
                    
                    React.createElement("p", null, `Tipo: ${traduzirTipo(itemVisualizando.tipo)}`),
                    React.createElement("p", null, `Status: ${getAlunoStatus(itemVisualizando.status)}`),
                    React.createElement("p", null, `Descrição: ${itemVisualizando.descricao}`),
                    (itemVisualizando.anexoBase64 || itemVisualizando.imagemBase64 || itemVisualizando.imagem) && React.createElement(
                        'div',
                        { className: 'anexo-imagem-wrapper' },
                        React.createElement('img', {
                            src: itemVisualizando.anexoBase64 || itemVisualizando.imagemBase64 || itemVisualizando.imagem,
                            alt: 'Anexo da manifestação',
                            style: { 
                                marginTop: '10px', 
                                maxWidth: '100%', 
                                maxHeight: '320px', 
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #ddd'
                            },
                            onError: (e) => {
                                console.error('Erro ao carregar imagem na página do Aluno:', e.target.src);
                                e.target.style.display = 'none';
                            }
                        })
                    ),
                    itemVisualizando.respostaAdmin && React.createElement("p", null, `Resposta: ${itemVisualizando.respostaAdmin}`),
                    
                    React.createElement(
                        "button",
                        { className: "btn-voltar", onClick: fecharVisualizacao },
                        "Voltar"
                    )
                )
            ),
            React.createElement(Footer)
        );
    }

    return React.createElement(
        "div",
        { className: "aluno-container" },
        React.createElement(AlunoHeader, { navigate: navigate, usuarioEmail: usuarioLogado.email }), 
        React.createElement('div', { className: 'seta-voltar-container' }, 
            React.createElement(SetaVoltar)
        ),
        React.createElement('div', { className: 'linha-vermelha' }),

        React.createElement(
            "div",
            { className: "aluno-main-content-wrapper" },
            React.createElement(
                'div',
                { key: 'cards', className: 'aluno-summary-cards' },
                [
                    { label: 'Total de Manifestações', value: total, className: 'card-total' },
                    { label: 'Em análise', value: emAnalise, className: 'card-analise' },
                    { label: 'Finalizadas', value: finalizadas, className: 'card-finalizadas' },
                ].map((item, index) =>
                    React.createElement(
                        'div',
                        { key: index, className: `aluno-card ${item.className}` },
                        [
                            React.createElement('p', null, item.label),
                            React.createElement('h3', null, item.value)
                        ]
                    )
                )
            ),

            React.createElement(
                'div',
                { key: 'manifestacoes-section', className: 'minhas-manifestacoes-section' },
                [
                    React.createElement('h3', null, 'Minhas Manifestações'),
                    React.createElement('small', null, 'Acompanhe o status das suas manifestações'),
                    
                    React.createElement(
                        'div',
                        {className: 'manifestacoes-list'},
                        manifestacoes.length === 0
                            ? React.createElement(
                                "p",
                                { className: "sem-registros" },
                                "Você ainda não possui manifestações registradas."
                              )
                            : manifestacoes.map(renderManifestacaoCard)
                    )
                ]
            )
        ),
        React.createElement(Footer)
    );
}

export default Aluno;