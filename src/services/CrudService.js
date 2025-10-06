const TIPOS_MANIFESTACAO = {
  // Corrigido para consistência
  RECLAMACAO: 'Reclamação',
  DENUNCIA: 'Denúncia',
  ELOGIO: 'Elogio', 
  SUGESTAO: 'Sugestão' 
};

const STORAGE_KEY = 'manifestacoes';

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const getAll = () => {
  const manifestacoes = localStorage.getItem(STORAGE_KEY);
  return manifestacoes ? JSON.parse(manifestacoes) : [];
};

// **********************************************
// CORREÇÃO CRÍTICA: Filtra pelo campo 'contato' do item
// **********************************************
const getByEmail = (email) => {
  const manifestacoes = getAll();
  return manifestacoes.filter(item => item.contato === email);
};

const getByTipo = (tipo) => {
  const manifestacoes = getAll();
  return manifestacoes.filter(item => item.tipo === tipo);
};

const getById = (id) => {
  const manifestacoes = getAll();
  return manifestacoes.find(item => item.id === id);
};

const create = (manifestacao) => {
  const manifestacoes = getAll();
  
  const novaManifestacao = {
    ...manifestacao,
    id: gerarId(),
    dataCriacao: new Date().toISOString(),
    status: 'pendente',
    visibilidade: 'admin'
  };
  
  manifestacoes.push(novaManifestacao);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manifestacoes));
  
  return novaManifestacao;
};

const update = (id, dadosAtualizados) => {
  const manifestacoes = getAll();
  const index = manifestacoes.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const manifestacaoAtualizada = {
    ...manifestacoes[index],
    ...dadosAtualizados,
    dataAtualizacao: new Date().toISOString()
  };
  
  manifestacoes[index] = manifestacaoAtualizada;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manifestacoes));
  
  return manifestacaoAtualizada;
};

const remove = (id) => {
  const manifestacoes = getAll();
  const novaLista = manifestacoes.filter(item => item.id !== id);
  
  if (novaLista.length === manifestacoes.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
  return true;
};

const getVisibleForUser = (userType) => {
  const manifestacoes = getAll();
  
  if (userType === 'Administrador') {
    return manifestacoes;
  }
  
  return manifestacoes.filter(item => 
    item.visibilidade === 'todos' || 
    item.visibilidade === userType.toLowerCase()
  );
};

const changeVisibility = (id, visibilidade) => {
  const manifestacoes = getAll();
  const index = manifestacoes.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  manifestacoes[index].visibilidade = visibilidade;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manifestacoes));
  
  return true;
};

const CrudService = {
  TIPOS_MANIFESTACAO,
  getAll,
  getByTipo,
  getById,
  getByEmail,
  getVisibleForUser,
  changeVisibility,
  create,
  update,
  remove
};

export default CrudService;