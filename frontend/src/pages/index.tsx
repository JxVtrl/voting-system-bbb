import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

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

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    isEnabled: false,
    totalVotes: 0,
    participants: []
  });
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

  const handleVote = async (participantId: string) => {
    try {
      const response = await fetch('http://localhost:8080/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participante: participantId }),
      });
      
      if (!response.ok) throw new Error('Erro ao registrar voto');
      
      fetchVotingStatus();
    } catch (err) {
      console.error('Erro ao votar:', err);
      setError('Erro ao registrar voto');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>BBB 25 - Sistema de Votação</title>
        <meta name="description" content="Sistema de votação para o BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">BBB 25 - Participantes</h1>
        
        {/* Lista de Participantes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`relative bg-white rounded-lg shadow-md p-4 text-center ${
                !participant.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="relative w-24 h-24 mx-auto mb-2">
                <Image
                  src={participant.imageUrl}
                  alt={participant.name}
                  fill
                  className="rounded-full object-cover"
                />
                {participant.status && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {participant.status}
                  </div>
                )}
              </div>
              <h2 className="font-semibold text-gray-900">{participant.name}</h2>
              {participant.votes !== undefined && (
                <p className="text-sm font-medium text-gray-700">Votos: {participant.votes.toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>

        {/* Paredão Atual */}
        {votingStatus.isEnabled && votingStatus.participants.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Paredão Atual</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {votingStatus.participants.map((participant) => (
                <div key={participant.id} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-2">
                    <Image
                      src={participant.imageUrl}
                      alt={participant.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                  <p className="text-sm font-medium text-gray-700 mb-2">Votos: {participant.votes?.toLocaleString() || '0'}</p>
                  <button
                    onClick={() => handleVote(participant.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
                  >
                    Votar
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-lg font-semibold text-gray-900">
                Total de votos: {votingStatus.totalVotes.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
