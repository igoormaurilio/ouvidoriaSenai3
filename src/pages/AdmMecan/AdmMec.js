import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer';
import SenaiLogo from '../../assets/imagens/logosenai.png';
import ModalGerenciar from '../../Components/ModalGerenciar';
import { formatarData } from '../../utils/dateUtils';
import { 
    canEditManifestacao, 
    canViewManifestacao, 
    filterManifestacoesByPermissions,
    getCoordenadorName 
} from '../../utils/permissions';
import './AdmMec.css';

const { createElement: e } = React;

// Funções utilitárias (Para normalizar strings sem acentos, facilitando a comparação)
const normalizeString = (str) => {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
};

// =================================================================
// VARIÁVEIS DE CONFIGURAÇÃO E SERVIÇO AUXILIAR (Persistência no LocalStorage)
// =================================================================
const AREA_ADMIN = 'mecanica'; // Chave de filtro por área
const ADMIN_EMAIL = 'pino@senai.br'; // Email do administrador de Mecânica

const CrudService = {
    getAll: () => {
        try {
            const data = localStorage.getItem('manifestacoes');
            if (data) {
                // Adiciona um 'id' se não existir para rastreamento
                return JSON.parse(data).map((m, index) => ({
                    id: m.id || index + 1,
                    ...m
                }));
            }
            // Retorna dados mockados de MECÂNICA se não houver nada no LocalStorage
            return [
                 {
                     id: 1, tipo: 'Reclamação', nome: 'Maria Santos', contato: '(11) 98765-4321',
                     dataCriacao: '15/01/2025', status: 'Pendente', titulo: 'Máquina do laboratório',
                     descricao: 'O torno mecânico da sala M-05 está com defeito há uma semana.', anexo: true,
                     setor: AREA_ADMIN 
                 },
                 {
                     id: 2, tipo: 'Sugestão', nome: 'Anônimo', contato: 'Anônimo',
                     dataCriacao: '15/01/2025', status: 'Resolvida', titulo: 'Mais ferramentas',
                     descricao: 'Sugiro adicionar mais jogos de chaves no laboratório.', anexo: false,
                     setor: AREA_ADMIN
                 },
            ]; 
        } catch (e) {
            console.error("Erro ao carregar manifestações do localStorage:", e);
            return [];
        }
    },
    persistAll: (manifestacoes) => {
        const dataToSave = manifestacoes.map(({ id, ...rest }) => rest);
        localStorage.setItem('manifestacoes', JSON.stringify(dataToSave));
    }
};

// =================================================================
// COMPONENTE HEADER
// =================================================================

const AdminHeader = ({ navigate, SenaiLogo }) => {
    return e(
        'div',
        { className: 'admin-header-full' },
        [
            e(
                'div',
                { className: 'admin-header-left' },
                [
                    e('img', { src: SenaiLogo, alt: 'SENAI Logo' }),
                    e(
                        'div',
                        null,
                        [
                            e('h1', null, 'Painel Administrativo - Mecânica'),
                            e('span', null, 'Bem-vindo(a), Admin')
                        ]
                    )
                ]
            ),
            e(
                'div',
                { className: 'admin-header-right' },
                [
                    e('button', { className: 'btn-manifestacoes active' }, 'Manifestações'),
                    e('button', {
                        className: 'btn-usuarios',
                        onClick: () => navigate('/admin/usuarios-mec')
                    }, 'Usuários'),
                    e('button', {
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

// =================================================================
// COMPONENTE PRINCIPAL ADMMEC
// =================================================================

function AdmMec() {
    const navigate = useNavigate();
    
    const [manifestacaoSelecionada, setManifestacaoSelecionada] = useState(null);
    const [manifestacoes, setManifestacoes] = useState([]); 
    const [filtro, setFiltro] = useState('Todos');

    useEffect(() => {
        let usuarioLogado = null;

        try {
            const stored = localStorage.getItem('usuarioLogado');
            if (stored) {
                usuarioLogado = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Erro ao fazer parse do localStorage (usuarioLogado):', error);
        }

        // 1. Verificação de Login
        const userEmail = usuarioLogado?.email;
        const isCoordenador = ['chile@coordenador.senai', 'pino@coordenador.senai', 'vieira@coordenador.senai'].includes(userEmail);
        
        if (!usuarioLogado || (userEmail !== ADMIN_EMAIL && !isCoordenador)) {
            alert('Você precisa estar logado como administrador de mecânica para acessar esta página.');
            navigate('/');
            return;
        }
            
        // 2. Carrega e Filtra manifestações baseado nas permissões
        const todasManifestacoes = CrudService.getAll();

        let manifestacoesFiltradas;
        if (isCoordenador) {
            // Para coordenadores, usa o novo sistema de permissões
            manifestacoesFiltradas = filterManifestacoesByPermissions(todasManifestacoes, userEmail);
        } else {
            // Para admin específico, filtra apenas por área
            manifestacoesFiltradas = todasManifestacoes.filter(m => 
                normalizeString(m.setor || m.area || m.curso) === AREA_ADMIN
            );
        }

        setManifestacoes(manifestacoesFiltradas);

    }, [navigate]);

    // Lógica para salvar as alterações de volta no LocalStorage, preservando as outras áreas
    const persistirManifestacoes = (novasManifestacoesMec) => {
        const todasManifestacoes = CrudService.getAll();
        
        // Filtra todas as manifestações que NÃO são de mecânica
        const outrasManifestacoes = todasManifestacoes.filter(m => 
            normalizeString(m.setor || m.area || m.curso) !== AREA_ADMIN
        );
        
        // Concatena as manifestações de outras áreas com as manifestações de mecânica atualizadas
        const manifestacoesAtualizadas = [...outrasManifestacoes, ...novasManifestacoesMec];

        CrudService.persistAll(manifestacoesAtualizadas);
        setManifestacoes(novasManifestacoesMec); 
    };

    // 3. Filtro por Tipo (Denúncia, Sugestão, etc.)
    const manifestacoesFiltradas = filtro === 'Todos'
        ? manifestacoes
        : manifestacoes.filter(m => 
            normalizeString(m.tipo) === normalizeString(filtro)
        );

    const excluirManifestacao = (id) => {
        if (window.confirm('Tem certeza que deseja excluir essa manifestação?')) {
            const novasManifestacoesMec = manifestacoes.filter(m => m.id !== id);
            persistirManifestacoes(novasManifestacoesMec);
        }
    };

    const gerenciarManifestacao = (id) => {
        const manifestacao = manifestacoes.find(m => m.id === id);
        if (manifestacao) {
            setManifestacaoSelecionada(manifestacao);
        }
    };

    const fecharModal = () => {
        setManifestacaoSelecionada(null);
    };

    const salvarRespostaModal = (id, novoStatus, resposta) => {
        const dataResposta = new Date().toLocaleDateString('pt-BR');

        const novasManifestacoesMec = manifestacoes.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    status: novoStatus,
                    respostaAdmin: resposta,
                    dataResposta: dataResposta
                };
            }
            return m;
        });
        
        persistirManifestacoes(novasManifestacoesMec); 
        fecharModal(); 
    };

    // Cards de Resumo - Não Alterados
    const total = manifestacoes.length;
    const pendentes = manifestacoes.filter(m => m.status === 'Pendente').length;
    const resolvidas = manifestacoes.filter(m => m.status === 'Resolvida').length;

    const tiposFiltro = ['Todos', 'Denúncia', 'Sugestão', 'Elogio', 'Reclamação'];

    const botoesFiltro = tiposFiltro.map((tipo) =>
        e(
            'button',
            {
                key: tipo,
                className: normalizeString(filtro) === normalizeString(tipo) ? 'active' : '',
                onClick: () => setFiltro(tipo)
            },
            tipo
        )
    );

    const corpoTabela = manifestacoesFiltradas.length === 0
        ? e(
            'tr', 
            { key: 'empty' }, 
            e('td', { colSpan: 6, className: 'empty-table-message' }, 'Nenhuma manifestação de Mecânica encontrada para o filtro selecionado.')
        )
        : manifestacoesFiltradas.map((m) =>
            e(
                'tr',
                { key: m.id },
                [
                    e('td', null, m.tipo),
                    e('td', null, m.nome || 'Anônimo'),
                    e('td', null, m.contato || 'N/A'),
                    e('td', null, formatarData(m.dataCriacao)),
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
                                    className: 'btn-gerenciar',
                                    onClick: () => gerenciarManifestacao(m.id) 
                                },
                                'Gerenciar'
                            ),
                            e(
                                'button',
                                {
                                    className: 'btn-excluir',
                                    onClick: () => excluirManifestacao(m.id)
                                },
                                'Excluir'
                            )
                        ]
                    )
                ]
            )
        );

    return e(
        'div',
        { className: 'admin-container' },
        [
            e(AdminHeader, { key: 'header', navigate: navigate, SenaiLogo: SenaiLogo }),

            e('div', { key: 'linha-vermelha', className: 'linha-vermelha' }),

            e(
                'div',
                { key: 'main-content-wrapper', className: 'admin-main-content-wrapper' }, 
                [
                    e(
                        'div',
                        { key: 'cards', className: 'summary-cards' },
                        // ******* CORREÇÃO APLICADA AQUI *******
                        // Adicionado o spread operator '...'
                        ...[ 
                            { label: 'Total de Manifestações', value: total },
                            { label: 'Pendentes', value: pendentes },
                            { label: 'Resolvidas', value: resolvidas },
                        ].map((item, index) =>
                            e(
                                'div',
                                { key: index, className: 'card' },
                                [
                                    e('p', null, item.label),
                                    e('h3', null, item.value)
                                ]
                            )
                        )
                    ),
                    // ---------------------------------------------

                    e(
                        'div',
                        { key: 'table-and-title-wrapper', className: 'table-and-title-wrapper' },
                        [
                            e(
                                'div',
                                { key: 'titulo', className: 'manifestacoes-title' },
                                [
                                    e('h3', null, 'Manifestações Registradas (Mecânica)'), 
                                    e('small', null, 'Gerencie as manifestações da área de Mecânica')
                                ]
                            ),

                            e(
                                'div',
                                { key: 'filtros', className: 'filter-buttons' },
                                botoesFiltro
                            ),

                            e(
                                'div',
                                { key: 'tabela-container', className: 'admin-table-container' },
                                e(
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
                                            corpoTabela
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

export default AdmMec;