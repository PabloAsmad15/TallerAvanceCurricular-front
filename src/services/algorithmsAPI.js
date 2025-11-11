/**
 * API Service para algoritmos de recomendación avanzados
 * Prolog y Reglas de Asociación
 */
import api from './api';

const algorithmsAPI = {
  /**
   * Obtiene recomendaciones usando Prolog
   */
  getPrologRecommendations: async () => {
    try {
      const response = await api.post('/api/recommendations/prolog');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo recomendaciones Prolog:', error);
      throw error;
    }
  },

  /**
   * Obtiene recomendaciones usando Reglas de Asociación
   * @param {boolean} entrenar - Si debe re-entrenar el modelo
   */
  getAssociationRulesRecommendations: async (entrenar = false) => {
    try {
      const response = await api.post('/api/recommendations/association-rules', {
        entrenar
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo recomendaciones de Reglas de Asociación:', error);
      throw error;
    }
  },

  /**
   * Compara ambos algoritmos
   * @param {boolean} entrenar - Si debe entrenar reglas de asociación
   */
  compareAlgorithms: async (entrenar = false) => {
    try {
      const response = await api.get('/api/recommendations/comparar', {
        params: { entrenar }
      });
      return response.data;
    } catch (error) {
      console.error('Error comparando algoritmos:', error);
      throw error;
    }
  },

  /**
   * Obtiene el estado de los servicios de algoritmos
   */
  getServicesStatus: async () => {
    try {
      const response = await api.get('/api/recommendations/status');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estado de servicios:', error);
      throw error;
    }
  }
};

export default algorithmsAPI;
