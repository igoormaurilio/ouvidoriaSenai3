import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudService from '../../services/CrudService';
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
import './AdmFac.css';

// --- Mapeamento de Administradores ---
const ADMIN_MAPPING = {
    'diretor@senai.br': 'Geral', // Pode editar tudo
    'chile@coordenador.senai': 'Geral', // Usa novo sistema de permissões
    'pino@coordenador.senai': 'Geral', // Usa novo sistema de permissões
    'vieira@coordenador.senai': 'Faculdade' // Usa novo sistema de permissões
};

const normalizeString = (str) => {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
};

const NORMALIZED_MAPPING = Object.fromEntries(
    Object.entries(ADMIN_MAPPING).map(([email, area]) => [email, normalizeString(area)])
);

// Função central para verificar a permissão de edição (usando novo sistema)
const canEditManifestacaoLocal = (manifestacao, userEmail) => {
    // Se for diretor, pode editar tudo
    if (userEmail === 'diretor@senai.br') {
        return true;
    }
    
    // Para coordenadores, usa o novo sistema de permissões
    return canEditManifestacao(manifestacao, userEmail);
};


const AdminHeader = ({ navigate, SenaiLogo, adminAreaName }) => {
    return React.createElement(
        'div',
        { className: 'admin-header-full' },
        [
            React.createElement(
                'div',
                { className: 'admin-header-left' },
                [
                    React.createElement('img', { src: SenaiLogo, alt: 'SENAI Logo' }),
                    React.createElement(
                        'div',
                        null,
                        [
                            // Título dinâmico
                            React.createElement('h1', null, `Painel Administrativo - ${adminAreaName}`),
                            React.createElement('span', null, `Bem-vindo(a), Admin de ${adminAreaName}`)
                        ]
                    )
                ]
            ),
            React.createElement(
                'div',
                { className: 'admin-header-right' },
                [
                    React.createElement('button', { className: 'btn-manifestacoes active' }, 'Manifestações'),
                    React.createElement('button', {
                        className: 'btn-usuarios',
                        onClick: () => navigate('/admin/usuarios-fac')
                    }, 'Usuários'),
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


function AdmFac() {
    const navigate = useNavigate();
    
    const [manifestacaoSelecionada, setManifestacaoSelecionada] = useState(null);
    const [manifestacoes, setManifestacoes] = useState([]); 
    const [filtro, setFiltro] = useState('Todos');
    
    // Novos estados para o admin logado
    const [currentAdminArea, setCurrentAdminArea] = useState(null); 
    const [currentAdminAreaName, setCurrentAdminAreaName] = useState('Carregando...');


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

        const userEmail = usuarioLogado?.email;
        const userNormalizedArea = NORMALIZED_MAPPING[userEmail];
        
        // Verifica se o usuário é um dos administradores mapeados ou coordenadores
        const isCoordenador = ['chile@coordenador.senai', 'pino@coordenador.senai', 'vieira@coordenador.senai'].includes(userEmail);
        
        if (!userNormalizedArea && !isCoordenador) {
            alert('Você precisa estar logado como administrador para acessar esta página.');
            navigate('/');
            return;
        }
        
        // Define o estado do admin logado
        const adminArea = userNormalizedArea || (isCoordenador ? 'coordenador' : null);
        setCurrentAdminArea(adminArea);
        
        // Define o nome de exibição do admin
        const areaName = ADMIN_MAPPING[userEmail] || getCoordenadorName(userEmail);
        setCurrentAdminAreaName(areaName);
            
        const todasManifestacoes = CrudService.getAll();
        
        // Filtra manifestações baseado nas permissões do usuário
        const manifestacoesFiltradas = filterManifestacoesByPermissions(todasManifestacoes, userEmail);
        
        // Garante que a lista é composta por objetos únicos para evitar o erro de referência
        setManifestacoes(manifestacoesFiltradas.map(m => ({ ...m })));

    }, [navigate]);
    
    if (!currentAdminArea) {
        return React.createElement('div', null, 'Carregando painel...');
    }

    const persistirManifestacoes = (manifestacaoEditada) => {
        setManifestacoes(prevManifestacoes => {
            const listaAtualizada = prevManifestacoes.map(m => 
                m.id === manifestacaoEditada.id ? manifestacaoEditada : m
            );

            localStorage.setItem('manifestacoes', JSON.stringify(listaAtualizada));

            return listaAtualizada;
        });
    };

    const excluirManifestacao = (id) => {
        const manifestacao = manifestacoes.find(m => m.id === id);
        const userEmail = JSON.parse(localStorage.getItem('usuarioLogado'))?.email;

        if (!manifestacao || !canEditManifestacaoLocal(manifestacao, userEmail)) {
             alert(`Você não tem permissão para excluir esta manifestação.`);
             return;
        }

        if (window.confirm('Tem certeza que deseja excluir essa manifestação?')) {
            const listaSemExcluida = manifestacoes.filter(m => m.id !== id);
            localStorage.setItem('manifestacoes', JSON.stringify(listaSemExcluida));
            
            setManifestacoes(listaSemExcluida);
        }
    };

    const gerenciarManifestacao = (id) => {
        const manifestacao = manifestacoes.find(m => m.id === id);
        const userEmail = JSON.parse(localStorage.getItem('usuarioLogado'))?.email;
        
        if (manifestacao) {
            // Verifica se pode editar ou apenas visualizar
            const canEdit = canEditManifestacaoLocal(manifestacao, userEmail);
            const canView = canViewManifestacao(manifestacao, userEmail);
            
            if (!canView) {
                alert('Você não tem permissão para visualizar esta manifestação.');
                return;
            }
            
            // Clona o objeto para garantir dados únicos no modal
            setManifestacaoSelecionada({ ...manifestacao, canEdit });
        }
    };

    const fecharModal = () => {
        setManifestacaoSelecionada(null);
    };

    const salvarRespostaModal = (id, novoStatus, resposta) => {
        const manifestacaoOriginal = manifestacoes.find(m => m.id === id);
        
        const userEmail = JSON.parse(localStorage.getItem('usuarioLogado'))?.email;
        if (!canEditManifestacaoLocal(manifestacaoOriginal, userEmail)) {
            alert(`Erro: Você não tem permissão para editar esta manifestação.`);
            return;
        }

        const manifestacaoEditada = {
            ...manifestacaoOriginal,
            status: novoStatus,
            respostaAdmin: resposta,
            dataResposta: new Date().toLocaleDateString('pt-BR')
        };
        
        persistirManifestacoes(manifestacaoEditada); 
        fecharModal(); 
    };
    
    // Retorna TODAS as manifestações no 'Todos' e filtra por Tipo nas outras opções
    const manifestacoesFiltradas = filtro === 'Todos'
        ? manifestacoes
        : manifestacoes.filter(m => 
            normalizeString(m.tipo) === normalizeString(filtro)
        );

    // Métricas para a área do admin logado (ou todas se for Geral)
    const isAdminGeral = currentAdminArea === 'faculdade';
    
    const manifestacoesParaMetricas = isAdminGeral
        ? manifestacoes
        : manifestacoes.filter(m => normalizeString(m.setor) === currentAdminArea);
        
    const totalGeral = manifestacoes.length;
    const pendentes = manifestacoesParaMetricas.filter(m => m.status === 'Pendente').length;
    const resolvidas = manifestacoesParaMetricas.filter(m => m.status === 'Resolvida').length;
    
    const metricasLabel = isAdminGeral ? 'Geral' : currentAdminAreaName;

    const tiposFiltro = ['Todos', 'Denúncia', 'Sugestão', 'Elogio', 'Reclamação'];

    const botoesFiltro = tiposFiltro.map((tipo) =>
        React.createElement(
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
        ? React.createElement(
            'tr', 
            null, 
            React.createElement('td', { colSpan: 6, className: 'empty-table-message' }, 'Nenhuma manifestação encontrada para o filtro selecionado.')
        )
        : manifestacoesFiltradas.map((m) => {
            const userEmail = JSON.parse(localStorage.getItem('usuarioLogado'))?.email;
            const podeEditar = canEditManifestacaoLocal(m, userEmail);
            const podeVisualizar = canViewManifestacao(m, userEmail);
            const botaoGerenciarClasse = podeEditar ? 'btn-gerenciar' : 'btn-visualizar-only';
            const botaoGerenciarTexto = podeEditar ? 'Gerenciar' : 'Visualizar';
            const setorExibido = m.setor || 'N/A'; 

            return React.createElement(
                'tr',
                { 
                    key: m.id, 
                    className: podeEditar ? '' : 'manifestacao-outra-area' 
                }, 
                [
                    React.createElement('td', null, m.tipo),
                    React.createElement('td', null, setorExibido),
                    React.createElement('td', null, m.contato),
                            React.createElement('td', null, formatarData(m.dataCriacao)),
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'span',
                            { className: `status-label ${m.status ? m.status.toLowerCase() : 'pendente'}` },
                            m.status || 'Pendente'
                        )
                    ),
                    React.createElement(
                        'td',
                        { className: 'acoes-coluna' },
                        [
                            // CORREÇÃO: Adicionando a prop 'key' aos botões
                            React.createElement(
                                'button',
                                {
                                    className: botaoGerenciarClasse,
                                    onClick: () => gerenciarManifestacao(m.id),
                                    key: `gerenciar-${m.id}` // <-- Chave única para o botão Gerenciar/Visualizar
                                },
                                botaoGerenciarTexto
                            ),
                            // Botão Excluir só aparece se tiver permissão de edição
                            podeEditar && React.createElement(
                                'button',
                                {
                                    className: 'btn-excluir',
                                    onClick: () => excluirManifestacao(m.id),
                                    key: `excluir-${m.id}` // <-- Chave única para o botão Excluir
                                },
                                'Excluir'
                            )
                        ]
                    )
                ]
            );
        });

    return React.createElement(
        'div',
        { className: 'admin-container' },
        [
            React.createElement(AdminHeader, { key: 'header', navigate: navigate, SenaiLogo: SenaiLogo, adminAreaName: currentAdminAreaName }),

            React.createElement('div', { key: 'linha-vermelha', className: 'linha-vermelha' }),

            React.createElement(
                'div',
                { key: 'main-content-wrapper', className: 'admin-main-content-wrapper' }, 
                [
                    React.createElement(
                        'div',
                        { key: 'cards', className: 'summary-cards' },
                        [
                            { label: 'Total de Manifestações (Geral)', value: totalGeral },
                            { label: `Pendentes (${metricasLabel})`, value: pendentes },
                            { label: `Resolvidas (${metricasLabel})`, value: resolvidas },
                        ].map((item, index) =>
                            React.createElement(
                                'div',
                                { key: index, className: 'card' },
                                [
                                    React.createElement('p', null, item.label),
                                    React.createElement('h3', null, item.value)
                                ]
                            )
                        )
                    ),

                    React.createElement(
                        'div',
                        { key: 'table-and-title-wrapper', className: 'table-and-title-wrapper' },
                        [
                            React.createElement(
                                'div',
                                { key: 'titulo', className: 'manifestacoes-title' },
                                [
                                    React.createElement('h3', null, 'Manifestações Registradas'),
                                    React.createElement('small', null, `Visualização de todas as manifestações`)
                                ]
                            ),

                            React.createElement(
                                'div',
                                { key: 'filtros', className: 'filter-buttons' },
                                botoesFiltro
                            ),

                            React.createElement(
                                'div',
                                { key: 'tabela-container', className: 'admin-table-container' },
                                React.createElement(
                                    'table',
                                    { className: 'manifestacoes-table' }, 
                                    [
                                        React.createElement(
                                            'thead',
                                            { key: 'thead' },
                                            React.createElement(
                                                'tr',
                                                null,
                                                ['Tipo', 'Setor', 'Contato', 'Data Criação', 'Status', 'Ações'].map((th, i) => 
                                                    // CORREÇÃO: Usando 'i' como key para os 'th's é aceitável aqui, já que a ordem é estática.
                                                    React.createElement('th', { key: i }, th)
                                                )
                                            )
                                        ),
                                        React.createElement(
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

            React.createElement(Footer, { key: 'footer' }),

            manifestacaoSelecionada && React.createElement(ModalGerenciar, {
                key: 'modal-gerenciar',
                manifestacao: manifestacaoSelecionada,
                onClose: fecharModal,
                onSaveResponse: salvarRespostaModal,
                adminSetor: currentAdminArea, 
                // Define readOnly baseado na permissão de edição
                readOnly: !canEditManifestacao(manifestacaoSelecionada, currentAdminArea)
            })
        ]
    );
}

export default AdmFac;