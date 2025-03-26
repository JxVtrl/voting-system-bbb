import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import ParticipantSelectionModal from '../../components/ParticipantSelectionModal';
import { Participant, VotingStatus } from '@/types';
import { api } from '@/services/api';
import AdminLayout from '../../components/AdminLayout';

interface ParticipantResponse {
  id: string;
  name: string;
  imageUrl: string;
  status?: 'eliminado' | 'líder' | 'normal';
  isActive?: boolean;
  votes?: number;
}

export default function Admin() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    isEnabled: false,
    totalVotes: 0,
    participants: []
  });
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

  const fetchParticipants = async () => {
    try {
      const response = await api.getParticipants();
      const participantsArray = Object.values(response).map((p: ParticipantResponse) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        status: p.status,
        isActive: p.isActive ?? true,
        votes: p.votes ?? 0
      })) as Participant[];
      setParticipants(participantsArray);
    } catch (err) {
      console.error('Erro ao buscar participantes:', err);
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const status = await api.getVotingStatus();
      setVotingStatus(status);
    } catch (err) {
      console.error('Erro ao buscar status:', err);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchVotingStatus();
    const interval = setInterval(fetchVotingStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartVoting = async (selectedIds: string[]) => {
    try {
      await api.startVoting(selectedIds);
      fetchVotingStatus();
    } catch (err) {
      console.error('Erro ao iniciar votação:', err);
    }
  };

  const handleEndVoting = async () => {
    try {
      await api.endVoting();
      fetchVotingStatus();
    } catch (err) {
      console.error('Erro ao encerrar votação:', err);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard - BBB 25</title>
        <meta name="description" content="Painel administrativo do sistema de votação BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as votações do BBB 25</p>
        </div>

        {/* Status da Votação */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Status da Votação</h2>
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${votingStatus.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {votingStatus.isEnabled ? 'Votação Ativa' : 'Votação Inativa'}
                </span>
              </div>
              {votingStatus.isEnabled && votingStatus.startTime && votingStatus.endTime && (
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-600">
                    Início: {new Date(votingStatus.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fim: {new Date(votingStatus.endTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsSelectionModalOpen(true)}
                disabled={votingStatus.isEnabled}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Iniciar Paredão
              </button>
              <button
                onClick={handleEndVoting}
                disabled={!votingStatus.isEnabled}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Encerrar Votação
              </button>
            </div>
          </div>
        </div>

        {/* Participantes do Paredão */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {votingStatus.isEnabled ? 'Participantes do Paredão Atual' : 'Nenhum Paredão em Andamento'}
          </h2>
          {votingStatus.isEnabled ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {votingStatus.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={participant.imageUrl}
                        alt={participant.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{participant.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Votos: {participant.votes?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Clique em "Iniciar Paredão" para selecionar os participantes
            </p>
          )}
        </div>
      </div>

      <ParticipantSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        participants={participants}
        onStartVoting={handleStartVoting}
      />
    </AdminLayout>
  );
} 