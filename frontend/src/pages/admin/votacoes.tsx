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

interface VotingHistory {
  id: string;
  startTime: string;
  endTime: string;
  totalVotes: number;
  participants: Participant[];
  winner?: Participant;
}

export default function VotingHistoryPage() {
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotingHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/historico');
      if (!response.ok) throw new Error('Erro ao buscar histórico');
      const data = await response.json();
      setVotingHistory(data || []);
    } catch (err) {
      setError('Erro ao carregar histórico de paredões');
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotingHistory();
  }, []);

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
        <title>Histórico de Paredões - BBB 25</title>
        <meta name="description" content="Histórico de paredões do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Paredões</h1>
          <Link href="/admin" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Voltar
          </Link>
        </div>

        {votingHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-800 font-medium">Nenhum paredão encontrado no histórico</p>
          </div>
        ) : (
          <div className="space-y-6">
            {votingHistory.map((voting) => (
              <div key={voting.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Paredão #{voting.id}</h2>
                    <p className="text-sm text-gray-700 font-medium">
                      Início: {new Date(voting.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      Fim: {new Date(voting.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      Total de votos: {voting.totalVotes.toLocaleString()}
                    </p>
                  </div>
                  {voting.winner && (
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <Image
                          src={voting.winner.imageUrl}
                          alt={voting.winner.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <p className="font-bold text-green-700">Vencedor</p>
                      <p className="text-sm font-semibold text-gray-900">{voting.winner.name}</p>
                      <p className="text-sm font-medium text-gray-700">{voting.winner.votes?.toLocaleString()} votos</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {voting.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`text-center ${
                        voting.winner?.id === participant.id 
                          ? 'text-green-700' 
                          : 'text-red-700'
                      }`}
                    >
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <Image
                          src={participant.imageUrl}
                          alt={participant.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-gray-900">{participant.name}</p>
                      <p className="text-sm font-medium text-gray-700">{participant.votes?.toLocaleString()} votos</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 