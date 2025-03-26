import styled from 'styled-components';
import { toast } from 'sonner';
import { api } from '../services/api';
import { Participant, VotingHistory } from '../types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ParedaoModal } from './ParedaoModal';

const AdminButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #1a365d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background: #2c5282;
    transform: translateY(-1px);
  }
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuButton = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  background: ${props => {
    switch (props.$variant) {
      case 'danger':
        return '#dc3545';
      case 'secondary':
        return '#666';
      default:
        return '#0070f3';
    }
  }};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  text-align: left;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

interface AdminMenuProps {
  participants: Participant[];
  isVotingEnabled: boolean;
}

export function AdminMenu({ participants, isVotingEnabled }: AdminMenuProps) {
  const router = useRouter();
  const [showParedaoModal, setShowParedaoModal] = useState(false);

  const handleStartVoting = async (selectedIds: string[]) => {
    try {
      await api.startVoting(selectedIds);
      const selectedParticipants = participants.filter(p => selectedIds.includes(p.id));
      toast.success('Votação iniciada com sucesso!', {
        description: `Participantes: ${selectedParticipants.map(p => p.name).join(', ')}`,
      });
    } catch {
      toast.error('Erro ao iniciar votação', {
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  const handleEndVoting = async () => {
    try {
      await api.endVoting();
      toast.success('Votação encerrada com sucesso!');
    } catch {
      toast.error('Erro ao encerrar votação', {
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  const handleShowHistory = async () => {
    try {
      const history = await api.getVotingHistory();
      toast.info('Histórico de Votações', {
        description: (
          <div>
            {(history as VotingHistory[]).map((vote: VotingHistory, index: number) => (
              <div key={vote.id}>
                <strong>Paredão {index + 1}:</strong>
                <br />
                Participantes: {vote.participants.map((p: Participant) => p.name).join(', ')}
                <br />
                {vote.winner && `Eliminado: ${vote.winner.name}`}
                <br />
                Total de votos: {vote.totalVotes}
              </div>
            ))}
          </div>
        ),
        duration: 10000,
      });
    } catch {
      toast.error('Erro ao carregar histórico', {
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  const showAdminMenu = () => {
    toast.info('Menu Administrativo', {
      id: 'admin-menu',
      description: (
        <MenuContent>
          <MenuButton
            onClick={() => {
              setShowParedaoModal(true);
              toast.dismiss('admin-menu');
            }}
            disabled={isVotingEnabled}
          >
            Iniciar Nova Votação
          </MenuButton>
          <MenuButton
            onClick={() => {
              handleEndVoting();
              toast.dismiss('admin-menu');
            }}
            disabled={!isVotingEnabled}
            $variant="secondary"
          >
            Encerrar Votação
          </MenuButton>
          <MenuButton
            onClick={() => {
              handleShowHistory();
              toast.dismiss('admin-menu');
            }}
            $variant="secondary"
          >
            Ver Histórico
          </MenuButton>
          <MenuButton
            onClick={() => {
              router.push('/admin/participantes');
              toast.dismiss('admin-menu');
            }}
          >
            Gerenciar Participantes
          </MenuButton>
          <MenuButton
            onClick={() => {
              router.push('/admin/estatisticas');
              toast.dismiss('admin-menu');
            }}
          >
            Estatísticas
          </MenuButton>
          <MenuButton
            onClick={() => {
              router.push('/admin/historico');
              toast.dismiss('admin-menu');
            }}
          >
            Histórico Detalhado
          </MenuButton>
        </MenuContent>
      ),
      duration: Infinity,
    });
  };

  return (
    <>
      <AdminButton onClick={showAdminMenu}>
        Menu Administrativo
      </AdminButton>

      {showParedaoModal && (
        <ParedaoModal
          participants={participants}
          onClose={() => setShowParedaoModal(false)}
          onConfirm={handleStartVoting}
        />
      )}
    </>
  );
} 