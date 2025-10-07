/**
 * Sistema de Permissões para Coordenadores
 */

// Mapeamento de áreas
export const AREAS = {
    GERAL: 'Geral',
    INFORMATICA: 'Informática', 
    MECANICA: 'Mecânica',
    FACULDADE: 'Faculdade',
    MANUFATURACAO: 'Manufaturação Digital'
};

// Configuração de permissões por coordenador
export const COORDENADOR_PERMISSIONS = {
    'chile@coordenador.senai': {
        nome: 'Chile',
        editar: [AREAS.GERAL, AREAS.INFORMATICA, AREAS.MANUFATURACAO],
        visualizar: [AREAS.GERAL, AREAS.INFORMATICA, AREAS.MANUFATURACAO, AREAS.FACULDADE, AREAS.MECANICA]
    },
    'pino@coordenador.senai': {
        nome: 'Pino',
        editar: [AREAS.GERAL, AREAS.MECANICA, AREAS.MANUFATURACAO],
        visualizar: [AREAS.GERAL, AREAS.MECANICA, AREAS.MANUFATURACAO, AREAS.INFORMATICA, AREAS.FACULDADE]
    },
    'vieira@coordenador.senai': {
        nome: 'Vieira',
        editar: [AREAS.FACULDADE, AREAS.GERAL],
        visualizar: [AREAS.FACULDADE, AREAS.GERAL, AREAS.MANUFATURACAO, AREAS.INFORMATICA, AREAS.MECANICA]
    }
};

// Função para normalizar strings (remover acentos)
export const normalizeString = (str) => {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
};

// Função para verificar se um coordenador pode editar uma manifestação
export const canEditManifestacao = (manifestacao, userEmail) => {
    const permissions = COORDENADOR_PERMISSIONS[userEmail];
    if (!permissions) return false;
    
    const manifestacaoArea = normalizeString(manifestacao.setor || '');
    const canEdit = permissions.editar.some(area => 
        normalizeString(area) === manifestacaoArea
    );
    
    return canEdit;
};

// Função para verificar se um coordenador pode visualizar uma manifestação
export const canViewManifestacao = (manifestacao, userEmail) => {
    const permissions = COORDENADOR_PERMISSIONS[userEmail];
    if (!permissions) return true; // Se não tem permissões definidas, pode ver tudo
    
    const manifestacaoArea = normalizeString(manifestacao.setor || '');
    const canView = permissions.visualizar.some(area => 
        normalizeString(area) === manifestacaoArea
    );
    
    return canView;
};

// Função para obter as áreas que um coordenador pode editar
export const getEditableAreas = (userEmail) => {
    const permissions = COORDENADOR_PERMISSIONS[userEmail];
    return permissions ? permissions.editar : [];
};

// Função para obter as áreas que um coordenador pode visualizar
export const getViewableAreas = (userEmail) => {
    const permissions = COORDENADOR_PERMISSIONS[userEmail];
    return permissions ? permissions.visualizar : [];
};

// Função para obter o nome do coordenador
export const getCoordenadorName = (userEmail) => {
    const permissions = COORDENADOR_PERMISSIONS[userEmail];
    return permissions ? permissions.nome : 'Coordenador';
};

// Função para filtrar manifestações baseado nas permissões de visualização
export const filterManifestacoesByPermissions = (manifestacoes, userEmail) => {
    return manifestacoes.filter(manifestacao => 
        canViewManifestacao(manifestacao, userEmail)
    );
};
