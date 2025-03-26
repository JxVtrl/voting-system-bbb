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
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
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

        {/* Status do Paredão */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Status do Paredão</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">
                Status: <span className={votingStatus.isEnabled ? 'text-green-600' : 'text-red-600'}>
                  {votingStatus.isEnabled ? 'Ativo' : 'Inativo'}
                </span>
              </p>
              {votingStatus.isEnabled && (
                <p className="text-sm text-gray-600">
                  Total de votos: {votingStatus.totalVotes}
                </p>
              )}
            </div>
            <div className="space-x-4">
              {!votingStatus.isEnabled ? (
                <button
                  onClick={handleStartVoting}
                  disabled={selectedParticipants.length !== 3}
                  className={`px-4 py-2 rounded ${
                    selectedParticipants.length === 3
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  } text-white`}
                >
                  Iniciar Paredão
                </button>
              ) : (
                <button
                  onClick={handleEndVoting}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Encerrar Paredão
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Participantes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Participantes Disponíveis</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {participants
              .filter(p => p.isActive)
              .map((participant) => (
                <div
                  key={participant.id}
                  className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    selectedParticipants.includes(participant.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleParticipantSelection(participant.id)}
                >
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <Image
                      src={participant.imageUrl}
                      alt={participant.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    {participant.status && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {participant.status}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold">{participant.name}</h3>
                  {selectedParticipants.includes(participant.id) && (
                    <p className="text-sm text-blue-600">Selecionado</p>
                  )}
                </div>
              ))}
          </div>
          {selectedParticipants.length > 0 && (
            <p className="mt-4 text-center text-gray-600">
              {selectedParticipants.length}/3 participantes selecionados
            </p>
          )}
        </div>
      </main>
    </div>
  );
} 