import { api } from './api';
import { Route, ROUTES } from '@/data/routes';

export interface CreateReportDTO {
  routeId: string;
  stopName: string;
  crowdLevel: number; // 0 a 100
  comment?: string;
  coords?: [number, number];
}

/**
 * ============================================================================
 * 🚌 SERVIÇO DE ÔNIBUS & ROTAS (PARA EQUIPE DO BACKEND INTEGRAR)
 * ============================================================================
 * Aqui a equipe de back-end pode conectar os endpoints reais da API.
 * As assinaturas de função já refletem o que as telas do app utilizam.
 */
export const busService = {
  /**
   * Busca todas as rotas e status dos ônibus em tempo real.
   * Endpoint sugerido: GET /routes
   */
  async getRoutes(): Promise<Route[]> {
    try {
      // DESCOMENTAR QUANDO O BACKEND ESTIVER DISPONÍVEL:
      // const response = await api.get<Route[]>('/routes');
      // return response.data;

      // Fallback atual usando os dados locais:
      return ROUTES;
    } catch (error) {
      console.warn('[busService.getRoutes] Falha na requisição, usando dados locais.', error);
      return ROUTES;
    }
  },

  /**
   * Envia um relato colaborativo de lotação e localização de um ônibus.
   * Endpoint sugerido: POST /reports
   */
  async sendReport(data: CreateReportDTO): Promise<{ success: boolean; reportId: string }> {
    try {
      // DESCOMENTAR QUANDO O BACKEND ESTIVER DISPONÍVEL:
      // const response = await api.post<{ success: boolean; reportId: string }>('/reports', data);
      // return response.data;

      console.log('[busService.sendReport] Mock enviado com sucesso:', data);
      return { success: true, reportId: `rep-${Date.now()}` };
    } catch (error) {
      console.error('[busService.sendReport] Erro ao enviar relato:', error);
      throw error;
    }
  },

  /**
   * Busca a posição em tempo real dos ônibus monitorados.
   * Endpoint sugerido: GET /buses/live
   */
  async getLiveBuses(): Promise<any[]> {
    try {
      // DESCOMENTAR QUANDO O BACKEND ESTIVER DISPONÍVEL:
      // const response = await api.get('/buses/live');
      // return response.data;

      return ROUTES.map(r => r.activeBus).filter(Boolean);
    } catch (error) {
      return [];
    }
  },
};
