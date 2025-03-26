import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import Image from 'next/image';

interface VotingHistory {
  id: string;
  startTime: string;
  endTime: string;
  totalVotes: number;
  participants: {
    id: string;
    name: string;
    imageUrl: string;
    votes: number;
  }[];
  winner?: {
    id: string;
    name: string;
    votes: number;
  };
}

export default function VotingHistoryPage() {
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVotingHistory();
  }, []);

  const fetchVotingHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/historico');
      if (response.ok) {
        const data = await response.json();
        setVotingHistory(data);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Histórico de Paredões - BBB 25</title>
        <meta name="description" content="Histórico de paredões do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Paredões</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : votingHistory.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            Nenhum paredão encontrado no histórico.
          </div>
        ) : (
          <div className="space-y-8">
            {votingHistory.map(voting => (
              <div
                key={voting.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Paredão #{voting.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(voting.startTime).toLocaleString()} - {new Date(voting.endTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total de Votos</p>
                    <p className="text-2xl font-bold text-blue-600">{voting.totalVotes.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {voting.participants.map(participant => (
                    <div
                      key={participant.id}
                      className="bg-gray-50 rounded-lg p-4 text-center"
                    >
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <Image
                          src={participant.imageUrl}
                          alt={participant.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{participant.name}</h4>
                      <p className="text-lg font-bold text-blue-600">
                        {participant.votes.toLocaleString()} votos
                      </p>
                    </div>
                  ))}
                </div>

                {voting.winner && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Vencedor</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 mr-3">
                          <Image
                            src={voting.participants.find(p => p.id === voting.winner?.id)?.imageUrl || ''}
                            alt={voting.winner.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <span className="text-green-700 font-medium">{voting.winner.name}</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {voting.winner.votes.toLocaleString()} votos
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 