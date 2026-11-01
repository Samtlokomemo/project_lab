import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';

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

function getAuthenticatedUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      'Você precisa estar autenticado para acessar seus dados.'
    );
  }

  return user;
}

function getUserDocument(userId: string) {
  return doc(db, 'users', userId);
}

export const authService = {
  /**
   * Obtém ou cria o perfil do estudante autenticado no Firestore.
   */
  async getCurrentUser(): Promise<UserProfile> {
    const user = getAuthenticatedUser();
    const userRef = getUserDocument(user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data();

      return {
        id: user.uid,
        name: data.name ?? user.displayName ?? '',
        email: data.email ?? user.email ?? '',
        university: data.university ?? 'UFAL',
        campus: data.campus ?? 'Campus A.C. Simões',
        favoriteRouteId: data.favoriteRouteId ?? '',
        points: data.points ?? 0,
      };
    }

    const profile: UserProfile = {
      id: user.uid,
      name: user.displayName ?? '',
      email: user.email ?? '',
      university: 'UFAL',
      campus: 'Campus A.C. Simões',
      favoriteRouteId: '',
      points: 0,
    };

    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return profile;
  },

  /**
   * Atualiza a rota favorita do estudante no Firestore.
   */
  async updateFavoriteRoute(routeId: string): Promise<void> {
    const user = getAuthenticatedUser();
    const userRef = getUserDocument(user.uid);

    // Garante que o perfil exista antes da atualização.
    await this.getCurrentUser();

    await updateDoc(userRef, {
      favoriteRouteId: routeId,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Salva um relato no histórico particular do estudante e incrementa pontos de colaboração.
   */
  async saveReportToHistory(
    report: UserReportHistory
  ): Promise<void> {
    const user = getAuthenticatedUser();
    const userRef = getUserDocument(user.uid);

    await this.getCurrentUser();

    const historyRef = collection(
      db,
      'users',
      user.uid,
      'history'
    );

    await addDoc(historyRef, {
      ...report,
      createdAt: serverTimestamp(),
    });

    try {
      const snap = await getDoc(userRef);
      const currentPoints = snap.exists() ? (snap.data().points ?? 0) : 0;
      await updateDoc(userRef, {
        points: currentPoints + 10,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Não foi possível atualizar pontos:', e);
    }
  },

  /**
   * Lista o histórico de relatos do estudante autenticado.
   */
  async getReportHistory(): Promise<UserReportHistory[]> {
    const user = getAuthenticatedUser();

    const historyRef = collection(
      db,
      'users',
      user.uid,
      'history'
    );

    const historyQuery = query(
      historyRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(historyQuery);

    return snapshot.docs.map((item) => {
      const data = item.data();

      let time = data.time ?? '';

      if (data.createdAt?.toDate) {
        time = data.createdAt.toDate().toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
      }

      return {
        line: data.line ?? '',
        stop: data.stop ?? '',
        crowdLevel: data.crowdLevel ?? 0,
        time,
      };
    });
  },
};
