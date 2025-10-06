import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudService from '../../services/CrudService';
// Você precisará criar ou adaptar o arquivo Sugestao.css
import '../Sugestao/Sugestao.css'; 
import Footer from '../../Components/Footer';
import HeaderSimples from '../../Components/HeaderSimples';
import SetaVoltar from '../../Components/SetaVoltar';

// Componente renomeado para Sugestao
function Sugestao() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const [formData, setFormData] = useState({
    nome: '',
    contato: '',
    setor: 'Geral',
    local: '',
    dataHora: '',
    descricao: '',
    anexo: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [anexoBase64, setAnexoBase64] = useState(null);

  useEffect(() => {
    if (usuarioLogado) {
      setFormData(prevState => ({
        ...prevState,
        nome: usuarioLogado.nome || '', 
        contato: usuarioLogado.email || '', 
      }));
    }
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('O arquivo é muito grande. O tamanho máximo é 5MB.');
      e.target.value = '';
      setFormData(prev => ({ ...prev, anexo: null }));
      setPreviewUrl(null);
      setAnexoBase64(null);
      return;
    }
    setFormData(prevState => ({
      ...prevState,
      anexo: file
    }));

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setAnexoBase64(reader.result);
      reader.onerror = () => setAnexoBase64(null);
    } else {
      setPreviewUrl(null);
      setAnexoBase64(null);
    }
  };

  const validarCamposComuns = () => {
    // Texto de alerta adaptado para Sugestão
    if (!formData.descricao) {
      alert('Por favor, preencha a descrição detalhada da sugestão.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarCamposComuns()) return;
    if (!formData.contato) { 
      alert('Para envio identificado, o E-mail ou Telefone é obrigatório.');
      return;
    }

    const sugestao = {
      // Tipo definido como 'Sugestão'
      tipo: 'Sugestão', 
      nome: formData.nome || 'Não informado', 
      contato: formData.contato, 
      // Local e Data/Hora são opcionais para Sugestões
      local: formData.local || 'Não informado',
      dataHora: formData.dataHora || 'Não informada',
      descricao: formData.descricao,
      anexoNome: formData.anexo ? formData.anexo.name : null,
      anexoBase64: anexoBase64,
      setor: formData.setor, 
      status: 'Pendente', 
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };

    CrudService.create(sugestao); 
    navigate('/confirmacao');
  };

  const handleAnonimoSubmit = (e) => {
    e.preventDefault();

    if (!validarCamposComuns()) return;

    const sugestao = {
      // Tipo definido como 'Sugestão'
      tipo: 'Sugestão',
      nome: 'Anônimo',
      contato: 'Anônimo', 
      local: formData.local || 'Não informado',
      dataHora: formData.dataHora || 'Não informada',
      descricao: formData.descricao,
      anexoNome: formData.anexo ? formData.anexo.name : null,
      anexoBase64: anexoBase64,
      setor: formData.setor, 
      status: 'Pendente',
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };
    
    CrudService.create(sugestao); 
    navigate('/confirmacao');
  };

  return React.createElement(
    'div',
    { className: 'sugestao-container' }, // Class name alterado
    React.createElement(HeaderSimples, null),
    React.createElement(SetaVoltar, null),
    React.createElement(
      'div',
      { className: 'sugestao-content' }, // Class name alterado
      // Título alterado
      React.createElement('h2', { className: 'titulo-pagina' }, 'Faça uma Sugestão'),
      React.createElement(
        'div',
        { className: 'instrucoes-preenchimento' },
        // Campos obrigatórios atualizados
        React.createElement('p', null, React.createElement('strong', null, '* Campos Obrigatórios (apenas Descrição e Setor)')),
        React.createElement('p', null, '* Tamanho máximo para Anexar arquivo: 5 Megabytes.'),
        // Texto de instrução adaptado
        React.createElement('p', null, 'Utilize este formulário para propor melhorias, ideias ou soluções para a instituição.')
      ),
      React.createElement(
        'div',
        { className: 'form-box' },
        React.createElement(
          'form',
          { className: 'formulario-sugestao', onSubmit: handleSubmit }, // Class name alterado
          
          React.createElement('label', null, 'Nome (opcional)'),
          React.createElement('input', {
            type: 'text',
            name: 'nome',
            value: formData.nome,
            onChange: handleChange,
            placeholder: 'Nome completo (se logado, já estará preenchido)'
          }),
          
          React.createElement('label', null, 'E-mail ou Telefone *'),
          React.createElement('input', {
            type: 'text',
            name: 'contato',
            value: formData.contato,
            onChange: handleChange,
            placeholder: 'E-mail ou Telefone (obrigatório para envio identificado)',
            required: true 
          }),
          
          React.createElement('label', null, 'Setor de Destino *'),
          React.createElement('select', {
            name: 'setor',
            value: formData.setor,
            onChange: handleChange,
            required: true
          }, 
            [
              React.createElement('option', { key: 'geral', value: 'Geral' }, 'Outro / Geral'),
              React.createElement('option', { key: 'info', value: 'Informatica' }, 'Informática'),
              React.createElement('option', { key: 'mec', value: 'Mecanica' }, 'Mecânica')
            ]
          ),

          React.createElement('label', null, 'Local (opcional)'),
          React.createElement('input', {
            type: 'text',
            name: 'local',
            value: formData.local,
            onChange: handleChange,
            placeholder: 'Ex: Sala B-10, Pátio, Oficina de Mecânica...'
          }),
          
          React.createElement('label', null, 'Data e Hora (opcional)'),
          React.createElement('input', {
            type: 'datetime-local', 
            name: 'dataHora',
            value: formData.dataHora,
            onChange: handleChange,
            
          }),
          
          // Label adaptado
          React.createElement('label', null, 'Descrição detalhada da Sugestão *'),
          React.createElement(
            'div',
            { className: 'textarea-container' },
            React.createElement('textarea', {
              name: 'descricao',
              value: formData.descricao,
              onChange: handleChange,
              rows: 6,
              placeholder: 'Descreva detalhadamente a sua ideia ou sugestão de melhoria...',
              required: true
            }),
            React.createElement(
              'label',
              { htmlFor: 'file-upload-sugestao', className: 'custom-file-upload' }, // ID alterado
              React.createElement('img', {
                src: require('../../assets/imagens/icone-anexo.png'),
                alt: 'Anexar',
                className: 'icone-anexar'
              })
            ),
            React.createElement('input', {
              id: 'file-upload-sugestao', // ID alterado
              type: 'file',
              onChange: handleFileChange,
              style: { display: 'none' }
            }),

            formData.anexo &&
              React.createElement(
                'p',
                { className: 'arquivo-selecionado' },
                'Arquivo selecionado: ',
                formData.anexo.name
              ),

            previewUrl &&
              React.createElement('img', {
                src: previewUrl,
                alt: 'Preview do anexo',
                style: { marginTop: '10px', maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }
              })
          ),
          
          React.createElement('small', null, 'Atenção: Evite compartilhar imagens que possam comprometer sua segurança ou de outra pessoa.'),
          
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' } },
            React.createElement(
              'button',
              { type: 'submit', className: 'btn-confirmar' },
              'Confirmar'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'btn-confirmar',
                style: { backgroundColor: '#666' },
                onClick: handleAnonimoSubmit
              },
              'Enviar Anônimo'
            )
          )
        )
      )
    ),
    React.createElement(Footer, null)
  );
}

export default Sugestao;