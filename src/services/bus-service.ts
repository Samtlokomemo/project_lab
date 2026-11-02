
import { BusReport, Route, ROUTES } from '@/data/routes';
import { api } from './api';

export interface CreateReportDTO {
  routeId: string;
  stopName: string;
  crowdLevel: number; // 0 a 100
  comment?: string;
  coords?: [number, number];
}

/**
 * Serviço de ônibus e rotas integrado à API.
 */
export const busService = {
  /**
   * Busca todas as rotas.
   * Endpoint: GET /routes
   */
  async getRoutes(): Promise<Route[]> {
    try {
      const response = await api.get<Route[]>('/routes');
      return response.data;
    } catch (error) {
      console.warn(
        '[busService.getRoutes] Falha na API; usando dados locais.',
        error
      );
      return ROUTES;
    }
  },

  /**
   * Envia um relato de lotação.
   * Endpoint: POST /reports
   */
  async sendReport(
    data: CreateReportDTO
  ): Promise<{ success: boolean; reportId: string }> {
    try {
      const response = await api.post<{
        success: boolean;
        reportId: string;
      }>('/reports', data);

      return response.data;
    } catch (error) {
      console.error(
        '[busService.sendReport] Erro ao enviar relato:',
        error
      );
      throw error;
    }
  },

  /**
   * Busca os ônibus monitorados.
   * Endpoint: GET /buses/live
   */
  async getLiveBuses(): Promise<BusReport[]> {
    try {
      const response = await api.get<BusReport[]>('/buses/live');
      return response.data;
    } catch (error) {
      console.warn(
        '[busService.getLiveBuses] Falha ao buscar ônibus:',
        error
      );
      return [];
    }
  },
};
