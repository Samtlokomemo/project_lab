import { localDatabase } from './index';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  campus: string;
  favoriteRouteId: string;
  points: number;
}

export interface UserReportHistory {
  line: string;
  stop: string;
  crowdLevel: number;
  time: string;
}

/**
 * ============================================================================
 * 👤 SERVIÇO DE AUTENTICAÇÃO E PERFIL (PARA EQUIPE DO BANCO DE DADOS)
 * ============================================================================
 * Aqui a equipe de banco de dados / autenticação pode plugar o SQLite,
 * Firebase, Supabase ou o adapter definitivo de persistência.
 */
export const authService = {
  /**
   * Obtém os dados do estudante autenticado.
   */
  async getCurrentUser(): Promise<UserProfile> {
    const cached = await localDatabase.getItem('@user_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }

    // Perfil mock inicial padrão:
    return {
      id: 'usr_gabriel_01',
      name: 'Gabriel Souza',
      email: 'gabriel.souza@ufal.br',
      university: 'UFAL',
      campus: 'Campus A.C. Simões',
      favoriteRouteId: 'paripueira',
      points: 84,
    };
  },

  /**
   * Atualiza a rota favorita do usuário no banco / cache local.
   */
  async updateFavoriteRoute(routeId: string): Promise<void> {
    const user = await this.getCurrentUser();
    user.favoriteRouteId = routeId;
    await localDatabase.setItem('@user_profile', JSON.stringify(user));
  },

  /**
   * Salva o histórico de relatos enviados pelo usuário.
   */
  async saveReportToHistory(report: UserReportHistory): Promise<void> {
    const raw = await localDatabase.getItem('@user_history');
    const history: UserReportHistory[] = raw ? JSON.parse(raw) : [];
    history.unshift(report);
    await localDatabase.setItem('@user_history', JSON.stringify(history));
  },

  /**
   * Lista o histórico de colaborações do usuário.
   */
  async getReportHistory(): Promise<UserReportHistory[]> {
    const raw = await localDatabase.getItem('@user_history');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }

    return [
      { line: 'Linha Paripueira', stop: 'AL-101 Norte', crowdLevel: 72, time: 'Hoje, 06:47' },
      { line: 'Linha Paripueira', stop: 'Ponto Mirante', crowdLevel: 55, time: 'Ontem, 07:02' },
      { line: 'Linha Barra de Sto. Antônio', stop: 'BR-104', crowdLevel: 88, time: 'Seg, 27 Set' },
    ];
  },
};
