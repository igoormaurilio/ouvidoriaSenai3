import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudService from '../../services/CrudService';
import '../Reclamacao/Reclamacao.css';
import Footer from '../../Components/Footer';
import HeaderSimples from '../../Components/HeaderSimples';
import SetaVoltar from '../../Components/SetaVoltar';

function Reclamacao() {
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
    // Texto de alerta corrigido
    if (!formData.descricao) {
      alert('Por favor, preencha a descrição detalhada da reclamação.');
      return false;
    }
    if (!formData.local) {
      alert('Por favor, preencha o local do incidente.');
      return false;
    }
    if (!formData.dataHora) {
      alert('Por favor, preencha a data e hora do incidente.');
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

    const reclamacao = {
      // USANDO STRING LITERAL 'Reclamação' para garantir o valor correto no localStorage
      tipo: 'Reclamação', 
      nome: formData.nome || 'Não informado', 
      contato: formData.contato, 
      local: formData.local,
      dataHora: formData.dataHora,
      descricao: formData.descricao,
      anexoNome: formData.anexo ? formData.anexo.name : null,
      anexoBase64: anexoBase64,
      setor: formData.setor, 
      status: 'Pendente', 
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };

    CrudService.create(reclamacao); 
    navigate('/confirmacao');
  };

  const handleAnonimoSubmit = (e) => {
    e.preventDefault();

    if (!validarCamposComuns()) return;

    const reclamacao = {
      // USANDO STRING LITERAL 'Reclamação' para garantir o valor correto no localStorage
      tipo: 'Reclamação', 
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
    
    CrudService.create(reclamacao); 
    navigate('/confirmacao');
  };

  return React.createElement(
    'div',
    { className: 'reclamacao-container' },
    React.createElement(HeaderSimples, null),
    React.createElement(SetaVoltar, null),
    React.createElement(
      'div',
      { className: 'reclamacao-content' },
      // CORREÇÃO VISUAL 1: Título da página
      React.createElement('h2', { className: 'titulo-pagina' }, 'Faça uma Reclamação'),
      React.createElement(
        'div',
        { className: 'instrucoes-preenchimento' },
        React.createElement('p', null, React.createElement('strong', null, '* Campos Obrigatórios')),
        React.createElement('p', null, '* Tamanho máximo para Anexar arquivo: 5 Megabytes.'),
        // CORREÇÃO VISUAL 2: Texto de instrução
        React.createElement('p', null, 'Explique em quais casos a reclamação pode ser feita e reforce a confidencialidade do processo.')
      ),
      React.createElement(
        'div',
        { className: 'form-box' },
        React.createElement(
          'form',
          { className: 'formulario-reclamacao', onSubmit: handleSubmit },
          
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

          React.createElement('label', null, 'Local do incidente *'),
          React.createElement('input', {
            type: 'text',
            name: 'local',
            value: formData.local,
            onChange: handleChange,
            placeholder: 'Ex: Sala B-10, Pátio, Oficina de Mecânica...',
            required: true
          }),
          
          React.createElement('label', null, 'Data e Hora do incidente *'),
          React.createElement('input', {
            type: 'datetime-local', 
            name: 'dataHora',
            value: formData.dataHora,
            onChange: handleChange,
            required: true
          }),
          
          // CORREÇÃO VISUAL 3: Label da descrição
          React.createElement('label', null, 'Descrição detalhada da Reclamação *'),
          React.createElement(
            'div',
            { className: 'textarea-container' },
            React.createElement('textarea', {
              name: 'descricao',
              value: formData.descricao,
              onChange: handleChange,
              rows: 6,
              placeholder: 'Descreva detalhadamente o ocorrido...',
              required: true
            }),
            React.createElement(
              'label',
              { htmlFor: 'file-upload-reclamacao', className: 'custom-file-upload' },
              React.createElement('img', {
                src: require('../../assets/imagens/icone-anexo.png'),
                alt: 'Anexar',
                className: 'icone-anexar'
              })
            ),
            React.createElement('input', {
              id: 'file-upload-reclamacao', 
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

export default Reclamacao;