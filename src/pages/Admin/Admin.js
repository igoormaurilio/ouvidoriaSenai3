import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer';
import SenaiLogo from '../../assets/imagens/logosenai.png';
import ModalGerenciar from '../../Components/ModalGerenciar';
import './Admin.css';

const { createElement: e } = React;

// --- Função de Normalização ---
// Remove acentos e converte para minúsculas para garantir que "denúncia" e "denuncia" sejam iguais.
const normalizeString = (str) => {
    return String(str || '')
        .normalize('NFD') // Normaliza para decompor acentos (ex: 'ú' vira 'u' + acento)
        .replace(/[\u0300-\u036f]/g, "") // Remove os acentos decompostos
        .toLowerCase()
        .trim();
};
// ------------------------------

const ManifestacaoService = {
    getAllManifestacoes: () => {
        try {
            const data = localStorage.getItem('manifestacoes');
            if (data) {
                return JSON.parse(data).map((m, index) => ({
                    id: m.id || index + 1,
                    ...m
                }));
            }
            return [];
        } catch (e) {
            console.error("Erro ao carregar manifestações do localStorage:", e);
            return [];
        }
    },
    updateManifestacoes: (manifestacoes) => {
        // Remove a propriedade 'id' gerada no frontend antes de salvar
        const manifestacoesToSave = manifestacoes.map(({ id, ...rest }) => rest);
        localStorage.setItem('manifestacoes', JSON.stringify(manifestacoesToSave));
    }
};

function Admin() {
    const navigate = useNavigate();

    const [manifestacoes, setManifestacoes] = useState([]);

    const [manifestacaoSelecionada, setManifestacaoSelecionada] = useState(null);
    const [filtro, setFiltro] = useState('Todos');

    useEffect(() => {
        let usuarioLogado = null;
        const ADMIN_EMAIL = 'diretor@senai.br';

        try {
            const stored = localStorage.getItem('usuarioLogado');
            if (stored) {
                usuarioLogado = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Erro ao fazer parse do localStorage:', error);
        }

        if (!usuarioLogado || usuarioLogado.email !== ADMIN_EMAIL) {
            alert('Você precisa estar logado como administrador para acessar esta página.');
            navigate('/');
            return;
        }

        const todasManifestacoes = ManifestacaoService.getAllManifestacoes();

        setManifestacoes(todasManifestacoes);

    }, [navigate]);

    // --- Lógica do Filtro AGORA ROBUSTA ---
    const manifestacoesFiltradas = filtro === 'Todos'
        ? manifestacoes
        // Filtra comparando strings normalizadas (sem acento, minúsculas e sem espaços)
        : manifestacoes.filter(m =>
            normalizeString(m.tipo) === normalizeString(filtro)
        );

    const excluirManifestacao = (id) => {
        if (window.confirm('Tem certeza que deseja excluir essa manifestação?')) {
            const listaAtualizada = manifestacoes.filter(m => m.id !== id);

            setManifestacoes(listaAtualizada);

            ManifestacaoService.updateManifestacoes(listaAtualizada);
        }
    };

    const gerenciarManifestacao = (id) => {
        const manifestacao = manifestacoes.find(m => m.id === id);
        setManifestacaoSelecionada(manifestacao);
    };

    const fecharModal = () => {
        setManifestacaoSelecionada(null);
    };

    const salvarRespostaModal = (id, novoStatus, resposta) => {
        const listaAtualizada = manifestacoes.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    status: novoStatus,
                    respostaAdmin: resposta,
                    dataResposta: new Date().toLocaleDateString('pt-BR')
                };
            }
            return m;
        });

        setManifestacoes(listaAtualizada);
        ManifestacaoService.updateManifestacoes(listaAtualizada);

        fecharModal();
    };

    const total = manifestacoes.length;
    const pendentes = manifestacoes.filter(m => m.status === 'Pendente').length;
    const resolvidas = manifestacoes.filter(m => m.status === 'Resolvida').length;

    const tiposFiltro = ['Todos', 'Denúncia', 'Sugestão', 'Elogio', 'Reclamação'];

    const renderCustomHeader = () => {
        return e(
            'div',
            { key: 'admin-header-full', className: 'admin-header-full' },
            [
                e(
                    'div',
                    { key: 'admin-header-left', className: 'admin-header-left' },
                    [
                        e('img', {
                            key: 'logo',
                            src: SenaiLogo,
                            alt: 'SENAI Logo'
                        }),
                        e(
                            'div',
                            { key: 'texts' },
                            [
                                e('h1', null, 'Painel Administrativo - Geral'),
                                e('span', null, 'Bem-vindo(a), Admin')
                            ]
                        )
                    ]
                )
                , e(
                    'div',
                    { key: 'admin-header-right', className: 'admin-header-right' },
                    [
                        e('button', {
                            key: 'manifestacoes-btn',
                            className: 'btn-manifestacoes active'
                        }, 'Manifestações'),
                        e('button', {
                            key: 'usuarios-btn',
                            className: 'btn-usuarios',
                            onClick: () => navigate('/admin/usuarios-geral')
                        }, 'Usuários'),
                        e('button', {
                            key: 'sair-btn',
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

    return e(
        'div',
        { className: 'admin-container' },
        [
            renderCustomHeader(),

            e('div', { key: 'linha-vermelha', className: 'linha-vermelha' }),

            e(
                'div',
                { key: 'main-content-wrapper', className: 'admin-main-content-wrapper' },
                [
                    e(
                        'div',
                        { key: 'cards', className: 'summary-cards' },
                        // ******* CORREÇÃO APLICADA AQUI *******
                        // O '...' (spread operator) desestrutura o array do .map, 
                        // passando os elementos como filhos separados para o div.
                        ...[
                            { label: 'Total de Manifestações', value: total },
                            { label: 'Pendentes', value: pendentes },
                            { label: 'Resolvidas', value: resolvidas },
                        ].map((item, index) =>
                            e(
                                'div',
                                { key: index, className: 'card' },
                                [
                                    e('p', { key: 'p' + index }, item.label),
                                    e('h3', { key: 'h3' + index }, item.value)
                                ]
                            )
                        )
                    ),

                    e(
                        'div',
                        { key: 'table-and-title-wrapper', className: 'table-and-title-wrapper' },
                        [
                            e(
                                'div',
                                { key: 'titulo', className: 'manifestacoes-title' },
                                [
                                    e('h3', { key: 'h3' }, 'Manifestações Registradas'),
                                    e('small', { key: 'small' }, 'Gerencie todas as manifestações do sistema')
                                ]
                            ),

                            e(
                                'div',
                                { key: 'filtros', className: 'filter-buttons' },
                                tiposFiltro.map((tipo) =>
                                    e(
                                        'button',
                                        {
                                            key: tipo,
                                            className: normalizeString(filtro) === normalizeString(tipo) ? 'active' : '',
                                            onClick: () => setFiltro(tipo)
                                        },
                                        tipo
                                    )
                                )
                            ),

                            e(
                                'div',
                                { key: 'tabela-container', className: 'admin-table-container' },
                                manifestacoesFiltradas.length === 0
                                    ? e('p', { className: 'empty-table-message' }, 'Nenhuma manifestação cadastrada para este filtro.')
                                    : e(
                                        'table',
                                        { className: 'manifestacoes-table' },
                                        [
                                            e(
                                                'thead',
                                                { key: 'thead' },
                                                e(
                                                    'tr',
                                                    null,
                                                    ['Tipo', 'Nome', 'Contato', 'Data Criação', 'Status', 'Ações'].map((th, i) =>
                                                        e('th', { key: i }, th)
                                                    )
                                                )
                                            ),
                                            e(
                                                'tbody',
                                                { key: 'tbody' },
                                                manifestacoesFiltradas.map((m) =>
                                                    e(
                                                        'tr',
                                                        { key: m.id },
                                                        [
                                                            e('td', null, m.tipo),
                                                            e('td', null, m.nome),
                                                            e('td', null, m.contato),
                                                            e('td', null, m.dataCriacao),
                                                            e(
                                                                'td',
                                                                null,
                                                                e(
                                                                    'span',
                                                                    { className: `status-label ${m.status ? m.status.toLowerCase() : 'pendente'}` },
                                                                    m.status || 'Pendente'
                                                                )
                                                            ),
                                                            e(
                                                                'td',
                                                                { className: 'acoes-coluna' },
                                                                [
                                                                    e(
                                                                        'button',
                                                                        {
                                                                            key: 'gerenciar',
                                                                            className: 'btn-gerenciar',
                                                                            onClick: () => gerenciarManifestacao(m.id)
                                                                        },
                                                                        'Gerenciar'
                                                                    ),
                                                                    e(
                                                                        'button',
                                                                        {
                                                                            key: 'excluir',
                                                                            className: 'btn-excluir',
                                                                            onClick: () => excluirManifestacao(m.id)
                                                                        },
                                                                        'Excluir'
                                                                    )
                                                                ]
                                                            )
                                                        ]
                                                    )
                                                )
                                            )
                                        ]
                                    )
                            )
                        ]
                    )
                ]
            ),

            e(Footer, { key: 'footer' }),

            manifestacaoSelecionada && e(ModalGerenciar, {
                key: 'modal-gerenciar',
                manifestacao: manifestacaoSelecionada,
                onClose: fecharModal,
                onSaveResponse: salvarRespostaModal
            })
        ]
    );
}

export default Admin;