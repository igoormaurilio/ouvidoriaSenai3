/**
 * Utilitários para formatação de datas
 */

/**
 * Formata uma data ISO para formato legível em português brasileiro
 * @param {string} dataIso - Data no formato ISO (ex: "2025-09-15T20:33:53.088Z")
 * @returns {string} - Data formatada (ex: "15/09/2025 às 17:33")
 */
export const formatarData = (dataIso) => {
    if (!dataIso) return "Data não informada";
    
    try {
        const data = new Date(dataIso);
        
        // Verifica se a data é válida
        if (isNaN(data.getTime())) {
            return "Data inválida";
        }
        
        // Formato: DD/MM/AAAA às HH:MM
        const dataFormatada = data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit", 
            year: "numeric"
        });
        
        const horaFormatada = data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
        
        return `${dataFormatada} às ${horaFormatada}`;
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "Data inválida";
    }
};

/**
 * Formata uma data ISO para formato de data apenas (sem hora)
 * @param {string} dataIso - Data no formato ISO
 * @returns {string} - Data formatada (ex: "15/09/2025")
 */
export const formatarDataSimples = (dataIso) => {
    if (!dataIso) return "Data não informada";
    
    try {
        const data = new Date(dataIso);
        
        if (isNaN(data.getTime())) {
            return "Data inválida";
        }
        
        return data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit", 
            year: "numeric"
        });
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "Data inválida";
    }
};

/**
 * Formata uma data ISO para formato de data e hora completa
 * @param {string} dataIso - Data no formato ISO
 * @returns {string} - Data formatada (ex: "15/09/2025 às 17:33:45")
 */
export const formatarDataHoraCompleta = (dataIso) => {
    if (!dataIso) return "Data não informada";
    
    try {
        const data = new Date(dataIso);
        
        if (isNaN(data.getTime())) {
            return "Data inválida";
        }
        
        const dataFormatada = data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit", 
            year: "numeric"
        });
        
        const horaFormatada = data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        return `${dataFormatada} às ${horaFormatada}`;
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "Data inválida";
    }
};
