import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { VotingHistory } from '@/types';
import { api } from '@/services/api';
import AdminLayout from '../../components/AdminLayout';

export default function VotingHistoryPage() {
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotingHistory = async () => {
    try {
      const history = await api.getVotingHistory();
      setVotingHistory(history || []);
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

  return (
    <AdminLayout>
      <Head>
        <title>Histórico de Paredões - BBB 25</title>
        <meta name="description" content="Histórico de paredões do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Paredões</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize o histórico completo de paredões do BBB 25</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : votingHistory.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <p className="text-gray-500">Nenhum paredão encontrado no histórico</p>
          </div>
        ) : (
          <div className="space-y-6">
            {votingHistory.map((voting) => (
              <div key={voting.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Paredão #{voting.id}</h2>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          Início: {new Date(voting.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Fim: {new Date(voting.endTime).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Total de votos: {voting.totalVotes.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {voting.winner && (
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <Image
                            src={voting.winner.imageUrl}
                            alt={voting.winner.name}
                            fill
                            className="rounded-full object-cover"
                          />
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Vencedor
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">{voting.winner.name}</p>
                        <p className="text-sm text-gray-600">{voting.winner.votes?.toLocaleString()} votos</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {voting.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className={`text-center p-4 rounded-lg ${
                          voting.winner?.id === participant.id 
                            ? 'bg-green-50' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <Image
                            src={participant.imageUrl}
                            alt={participant.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{participant.votes?.toLocaleString()} votos</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 