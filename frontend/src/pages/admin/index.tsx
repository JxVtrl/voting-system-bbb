import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

interface Participant {
  id: string;
  name: string;
  imageUrl: string;
  status?: string;
  isActive: boolean;
  votes?: number;
}

interface VotingStatus {
  isEnabled: boolean;
  startTime?: string;
  endTime?: string;
  totalVotes: number;
  participants: Participant[];
}

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    isEnabled: false,
    totalVotes: 0,
    participants: []
  });
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('http://localhost:8080/participantes');
      if (!response.ok) throw new Error('Erro ao buscar participantes');
      const data = await response.json();
      setParticipants(data);
    } catch (err) {
      setError('Erro ao carregar participantes');
      console.error('Erro ao buscar participantes:', err);
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/status');
      if (!response.ok) throw new Error('Erro ao buscar status');
      const data = await response.json();
      setVotingStatus(data);
    } catch (err) {
      setError('Erro ao carregar status da votação');
      console.error('Erro ao buscar status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchVotingStatus();
    const interval = setInterval(fetchVotingStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartVoting = async () => {
    if (selectedParticipants.length !== 3) {
      setError('Selecione exatamente 3 participantes para o paredão');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/iniciar-votacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantes: selectedParticipants }),
      });

      if (!response.ok) throw new Error('Erro ao iniciar votação');
      
      setSelectedParticipants([]);
      fetchVotingStatus();
    } catch (err) {
      setError('Erro ao iniciar votação');
      console.error('Erro ao iniciar votação:', err);
    }
  };

  const handleEndVoting = async () => {
    try {
      const response = await fetch('http://localhost:8080/encerrar-votacao', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Erro ao encerrar votação');
      
      fetchVotingStatus();
    } catch (err) {
      setError('Erro ao encerrar votação');
      console.error('Erro ao encerrar votação:', err);
    }
  };

  const toggleParticipantSelection = (participantId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      }
      if (prev.length >= 3) {
        setError('Máximo de 3 participantes permitido');
        return prev;
      }
      return [...prev, participantId];
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Painel Administrativo - BBB 25</title>
        <meta name="description" content="Painel administrativo do sistema de votação BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <div className="space-x-4">
            <Link href="/admin/votacoes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Histórico
            </Link>
            <Link href="/admin/participantes" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Participantes
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Status da Votação */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Status da Votação</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${votingStatus.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-900 font-medium">
              {votingStatus.isEnabled ? 'Votação Ativa' : 'Votação Inativa'}
            </span>
          </div>
          {votingStatus.isEnabled && (
            <div className="text-gray-700">
              <p className="font-medium">Início: {new Date(votingStatus.startTime!).toLocaleString()}</p>
              <p className="font-medium">Fim: {new Date(votingStatus.endTime!).toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Controles de Votação */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Controles de Votação</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleStartVoting}
              disabled={votingStatus.isEnabled}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar Votação
            </button>
            <button
              onClick={handleEndVoting}
              disabled={!votingStatus.isEnabled}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Encerrar Votação
            </button>
          </div>
        </div>

        {/* Lista de Participantes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Participantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant) => (
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
                    <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                    <p className="text-sm font-medium text-gray-700">
                      Votos: {participant.votes?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 