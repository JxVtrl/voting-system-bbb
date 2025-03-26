import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { api } from '@/services/api';
import { toast } from 'sonner';
import Head from 'next/head';
import AdminLayout from '@/components/admin/Layout';
import Image from 'next/image';
import ParticipantModal from '@/components/participants/Modal';

export default function GerenciarParticipantes() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const response = await api.getParticipants();
      const participantsArray = Object.values(response).map((p: Participant) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        status: p.status as 'eliminado' | 'líder' | 'normal' | undefined,
        isActive: p.isActive ?? true,
        votes: p.votes ?? 0
      })) as Participant[];
      setParticipants(participantsArray);
    } catch (err) {
      console.error('Erro ao carregar participantes:', err);
      toast.error('Erro ao carregar participantes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (participantId: string) => {
    if (!confirm('Tem certeza que deseja excluir este participante?')) return;

    try {
      const response = await fetch(`http://localhost:8080/participantes/${participantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Participante excluído com sucesso');
        loadParticipants();
      } else {
        throw new Error('Erro ao excluir participante');
      }
    } catch (err) {
      console.error('Erro ao excluir participante:', err);
      toast.error('Erro ao excluir participante');
    }
  };

  const handleAddNew = () => {
    const newParticipant: Participant = {
      id: '',
      name: '',
      imageUrl: '',
      status: 'normal',
      isActive: true,
      votes: 0
    };
    setEditingParticipant(newParticipant);
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
        toast.success(`Participante ${isActive ? 'ativado' : 'desativado'} com sucesso`);
        loadParticipants();
      } else {
        throw new Error('Erro ao atualizar status do participante');
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      toast.error('Erro ao atualizar status do participante');
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
        toast.success('Participante adicionado com sucesso');
        loadParticipants();
        setEditingParticipant(null);
      } else {
        throw new Error('Erro ao adicionar participante');
      }
    } catch (err) {
      console.error('Erro ao salvar participante:', err);
      toast.error('Erro ao adicionar participante');
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
        toast.success('Participante atualizado com sucesso');
        loadParticipants();
        setEditingParticipant(null);
      } else {
        throw new Error('Erro ao atualizar participante');
      }
    } catch (err) {
      console.error('Erro ao atualizar participante:', err);
      toast.error('Erro ao atualizar participante');
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gerenciar Participantes - BBB 25</title>
        <meta name="description" content="Gerenciamento de participantes do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie os participantes do BBB 25</p>
          </div>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adicionar Participante
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
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
                      <h3 className="text-lg font-medium text-gray-900">{participant.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          participant.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {participant.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          participant.status === 'líder'
                            ? 'bg-yellow-100 text-yellow-800'
                            : participant.status === 'eliminado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {participant.status === 'líder' ? 'Líder' : 
                           participant.status === 'eliminado' ? 'Eliminado' : 'Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleActiveChange(participant.id, !participant.isActive)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md ${
                        participant.isActive
                          ? 'text-red-700 bg-red-100 hover:bg-red-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {participant.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => setEditingParticipant(participant)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
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