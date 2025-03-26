import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import Image from 'next/image';
import ParticipantModal from '../../components/ParticipantModal';

interface Participant {
  id: string;
  name: string;
  imageUrl: string;
  status?: string;
  isActive: boolean;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('http://localhost:8080/participantes');
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (participantId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8080/participantes/${participantId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleActiveChange = async (participantId: string, isActive: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/participantes/${participantId}/ativo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Erro ao atualizar status de ativo:', error);
    }
  };

  const handleSaveParticipant = async (participant: Omit<Participant, 'id'>) => {
    try {
      const response = await fetch('http://localhost:8080/participantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participant),
      });

      if (response.ok) {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Erro ao salvar participante:', error);
    }
  };

  const handleUpdateParticipant = async (participant: Participant) => {
    try {
      const response = await fetch(`http://localhost:8080/participantes/${participant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participant),
      });

      if (response.ok) {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Erro ao atualizar participante:', error);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/participantes/${participantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Erro ao excluir participante:', error);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gerenciar Participantes - BBB 25</title>
        <meta name="description" content="Gerenciamento de participantes do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Participantes</h2>
          <button
            onClick={() => setEditingParticipant({
              id: '',
              name: '',
              imageUrl: '',
              isActive: true,
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Adicionar Participante
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map(participant => (
              <div
                key={participant.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 mb-4">
                  <Image
                    src={participant.imageUrl}
                    alt={participant.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                  {participant.status && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {participant.status}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{participant.name}</h3>
                    <p className="text-sm text-gray-600">ID: {participant.id}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <select
                      value={participant.status || ''}
                      onChange={(e) => handleStatusChange(participant.id, e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="">Sem status</option>
                      <option value="líder">Líder</option>
                      <option value="indicado">Indicado</option>
                      <option value="eliminado">Eliminado</option>
                    </select>

                    <button
                      onClick={() => handleActiveChange(participant.id, !participant.isActive)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        participant.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {participant.isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingParticipant(participant)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este participante?')) {
                          handleDeleteParticipant(participant.id);
                        }
                      }}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingParticipant !== null && (
        <ParticipantModal
          participant={editingParticipant}
          onClose={() => setEditingParticipant(null)}
          onSave={handleSaveParticipant}
          onUpdate={handleUpdateParticipant}
        />
      )}
    </AdminLayout>
  );
} 