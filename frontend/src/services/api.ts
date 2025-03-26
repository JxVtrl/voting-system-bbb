import { Participant, VotingStatus, VotingHistory } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  async getParticipants(): Promise<Record<string, Participant>> {
    const response = await fetch(`${API_URL}/participantes`);
    if (!response.ok) throw new Error('Erro ao buscar participantes');
    return response.json();
  },

  async getVotingStatus(): Promise<VotingStatus> {
    const response = await fetch(`${API_URL}/status`);
    if (!response.ok) throw new Error('Erro ao buscar status da votação');
    return response.json();
  },

  async vote(participantId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/votar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participante: participantId }),
    });
    if (!response.ok) throw new Error('Erro ao registrar voto');
    return response.json();
  },

  async startVoting(participantIds: string[]): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/iniciar-votacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participantes: participantIds }),
    });
    if (!response.ok) throw new Error('Erro ao iniciar votação');
    return response.json();
  },

  async endVoting(): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/encerrar-votacao`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Erro ao encerrar votação');
    return response.json();
  },

  async getVotingHistory(): Promise<VotingHistory[]> {
    const response = await fetch(`${API_URL}/historico`);
    if (!response.ok) throw new Error('Erro ao buscar histórico');
    return response.json();
  },
}; 