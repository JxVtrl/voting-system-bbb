import { toast } from 'sonner';
import { api } from '@/services/api';
import { Participant, VotingHistory } from '@/types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ParedaoModal } from '@/components/voting/Modal';
import styles from './styles.module.scss';

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
              <div key={vote.id} className="mb-4">
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
        <div className={styles.adminMenuContent}>
          <div className={styles.adminMenuHeader}>
            <h3 className={styles.adminMenuTitle}>Menu Administrativo</h3>
          </div>

          <button
            className={`${styles.adminMenuButton} ${
              isVotingEnabled ? styles.adminMenuButtonDanger : ''
            }`}
            onClick={() => {
              if (isVotingEnabled) {
                handleEndVoting();
              } else {
                setShowParedaoModal(true);
              }
              toast.dismiss('admin-menu');
            }}
          >
            {isVotingEnabled ? 'Encerrar Votação' : 'Iniciar Nova Votação'}
          </button>

          <button
            className={`${styles.adminMenuButton} ${styles.adminMenuButtonSecondary}`}
            onClick={() => {
              handleShowHistory();
              toast.dismiss('admin-menu');
            }}
          >
            Ver Histórico
          </button>

          <div className={styles.adminMenuDivider} />

          <button
            className={`${styles.adminMenuButton} ${styles.adminMenuButtonSecondary}`}
            onClick={() => {
              router.push('/admin/participantes');
              toast.dismiss('admin-menu');
            }}
          >
            Gerenciar Participantes
          </button>

          <button
            className={`${styles.adminMenuButton} ${styles.adminMenuButtonSecondary}`}
            onClick={() => {
              router.push('/admin/estatisticas');
              toast.dismiss('admin-menu');
            }}
          >
            Estatísticas
          </button>

          <button
            className={`${styles.adminMenuButton} ${styles.adminMenuButtonSecondary}`}
            onClick={() => {
              router.push('/admin/historico');
              toast.dismiss('admin-menu');
            }}
          >
            Histórico Detalhado
          </button>
        </div>
      ),
      duration: Infinity,
      className: styles.adminMenuToast,
    });
  };

  return (
    <>
      <button className={`${styles.adminMenuButton} ${styles.mainButton}`} onClick={showAdminMenu}>
        Menu Administrativo
      </button>

      {showParedaoModal && (
        <ParedaoModal
          onClose={() => setShowParedaoModal(false)}
          onConfirm={handleStartVoting}
        />
      )}
    </>
  );
} 