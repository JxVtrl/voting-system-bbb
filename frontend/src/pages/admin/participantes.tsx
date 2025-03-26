import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Participant } from '@/types';
import { api } from '@/services/api';
import { toast } from 'sonner';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import Image from 'next/image';
import ParticipantModal from '../../components/ParticipantModal';
import Link from 'next/link';

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const ParticipantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ParticipantCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ParticipantImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const ParticipantInfo = styled.div`
  margin-top: 10px;
`;

const Button = styled.button<{ $variant?: 'danger' | 'primary' }>`
  background: ${props => props.$variant === 'danger' ? '#dc3545' : '#0070f3'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const AddButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: auto;
  padding: 12px 24px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

export default function GerenciarParticipantes() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [newParticipant, setNewParticipant] = useState({ name: '', imageUrl: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const data = await api.getParticipants();
      setParticipants(data);
    } catch (error) {
      toast.error('Erro ao carregar participantes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (participant: Participant) => {
    // Implementar lógica de edição
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleDelete = async (participantId: string) => {
    if (!confirm('Tem certeza que deseja excluir este participante?')) return;

    try {
      await api.deleteParticipant(participantId);
      toast.success('Participante excluído com sucesso');
      loadParticipants();
    } catch (error) {
      toast.error('Erro ao excluir participante');
    }
  };

  const handleAddNew = () => {
    // Implementar lógica de adição
    toast.info('Funcionalidade em desenvolvimento');
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
        loadParticipants();
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
        loadParticipants();
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
        loadParticipants();
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
        loadParticipants();
      }
    } catch (error) {
      console.error('Erro ao atualizar participante:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/participantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParticipant),
      });

      if (response.ok) {
        loadParticipants();
        setNewParticipant({ name: '', imageUrl: '' });
      }
    } catch (error) {
      console.error('Erro ao adicionar novo participante:', error);
      setError('Erro ao adicionar novo participante. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gerenciar Participantes - BBB 25</title>
        <meta name="description" content="Gerenciamento de participantes do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Participantes</h1>
          <Link href="/admin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Voltar
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Formulário de Novo Participante */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Adicionar Novo Participante</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                id="imageUrl"
                value={newParticipant.imageUrl}
                onChange={(e) => setNewParticipant({ ...newParticipant, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Adicionar Participante
            </button>
          </form>
        </div>

        {/* Lista de Participantes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Participantes Cadastrados</h2>
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        participant.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {participant.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleActiveChange(participant.id, !participant.isActive)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        participant.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {participant.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddButton onClick={handleAddNew}>
          + Adicionar Participante
        </AddButton>
      </main>

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