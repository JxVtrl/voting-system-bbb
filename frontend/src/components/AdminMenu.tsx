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
  padding: 4px;
  width: 100%;
  min-width: 300px;
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const MenuTitle = styled.h3`
  color: #1a365d;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const MenuButton = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  background: ${props => {
    switch (props.$variant) {
      case 'danger':
        return '#dc3545';
      case 'secondary':
        return '#718096';
      default:
        return '#3182ce';
    }
  }};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
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
    toast.info('', {
      id: 'admin-menu',
      description: (
        <MenuContent>
          <MenuHeader>
            <MenuTitle>Menu Administrativo</MenuTitle>
          </MenuHeader>

          <MenuButton
            onClick={() => {
              if (isVotingEnabled) {
                handleEndVoting();
              } else {
                setShowParedaoModal(true);
              }
              toast.dismiss('admin-menu');
            }}
            $variant={isVotingEnabled ? 'danger' : undefined}
          >
            {isVotingEnabled ? 'Encerrar Votação' : 'Iniciar Nova Votação'}
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

          <MenuDivider />

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
      className: 'admin-menu-toast',
      style: {
        background: 'white',
        color: '#1a365d',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        width: 'auto',
        minWidth: '300px',
        transform: 'none !important',
        transition: 'none !important',
        height: 'auto !important',
        maxHeight: 'none !important',
      },
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