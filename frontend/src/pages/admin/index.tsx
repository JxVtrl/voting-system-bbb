import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import ParticipantSelectionModal from '@/components/participants/SelectionModal';
import { Participant, VotingStatus } from '@/types';
import { api } from '@/services/api';
import AdminLayout from '@/components/admin/Layout';
import styles from '@/styles/admin.module.scss';

interface ParticipantResponse {
  id: string;
  name: string;
  imageUrl: string;
  status?: 'eliminado' | 'líder' | 'normal';
  isActive?: boolean;
  votes?: number;
}

export default function Admin() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    isEnabled: false,
    totalVotes: 0,
    participants: []
  });
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

  const fetchParticipants = async () => {
    try {
      const response = await api.getParticipants();
      const participantsArray = Object.values(response).map((p: ParticipantResponse) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        status: p.status,
        isActive: p.isActive ?? true,
        votes: p.votes ?? 0
      })) as Participant[];
      setParticipants(participantsArray);
    } catch (err) {
      console.error('Erro ao buscar participantes:', err);
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const status = await api.getVotingStatus();
      setVotingStatus(status);
    } catch (err) {
      console.error('Erro ao buscar status:', err);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchVotingStatus();
    const interval = setInterval(fetchVotingStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartVoting = async (selectedIds: string[]) => {
    try {
      await api.startVoting(selectedIds);
      fetchVotingStatus();
    } catch (err) {
      console.error('Erro ao iniciar votação:', err);
    }
  };

  const handleEndVoting = async () => {
    try {
      await api.endVoting();
      fetchVotingStatus();
    } catch (err) {
      console.error('Erro ao encerrar votação:', err);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard - BBB 25</title>
        <meta name="description" content="Painel administrativo do sistema de votação BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.adminPageContainer}>
        <div className={styles.adminPageHeader}>
          <h1 className={styles.adminPageHeaderTitle}>Dashboard</h1>
          <p className={styles.adminPageHeaderDescription}>Gerencie as votações do BBB 25</p>
        </div>

        {/* Status da Votação */}
        <div className={styles.adminPageCard}>
          <div className={styles.adminPageCardHeader}>
            <span className={`${styles.adminPageStatus} ${votingStatus.isEnabled ? styles.adminPageStatusSuccess : styles.adminPageStatusDanger
              }`}>
              {votingStatus.isEnabled ? 'Votação Ativa' : 'Votação Inativa'}
            </span>
            {votingStatus.isEnabled && votingStatus.startTime && votingStatus.endTime && (
              <div className={styles.adminPageVotingTime}>
                <p className={styles.adminPageVotingTimeText}>
                  Início: {new Date(votingStatus.startTime).toLocaleString()}
                </p>
                <p className={styles.adminPageVotingTimeText}>
                  Fim: {new Date(votingStatus.endTime).toLocaleString()}
                </p>
              </div>
            )}
            <div className={styles.adminPageButtonGroup}>
              <button
                onClick={votingStatus.isEnabled ? handleEndVoting : () => setIsSelectionModalOpen(true)}
                className={`${styles.adminPageButton} ${votingStatus.isEnabled ? styles.adminPageButtonDanger : styles.adminPageButtonPrimary
                  }`}
              >
                {votingStatus.isEnabled ? 'Encerrar Votação' : 'Iniciar Paredão'}
              </button>
            </div>
          </div>
        </div>

        {/* Participantes do Paredão */}
        <div className={styles.adminPageCard}>
          <div className={styles.adminPageCardHeader}>
            <h2>
              {votingStatus.isEnabled ? 'Participantes do Paredão Atual' : 'Nenhum Paredão em Andamento'}
            </h2>
          </div>

          {votingStatus.isEnabled ? (
            <div className={styles.adminPageCardGrid}>
              {votingStatus.participants.map((participant) => (
                <div
                  key={participant.id}
                  className={styles.adminPageParticipantCard}
                >
                  <div className={styles.adminPageParticipantCardImage}>
                    <Image
                      src={participant.imageUrl}
                      alt={participant.name}
                      fill
                      className={styles.adminPageParticipantCardImageContent}
                    />
                  </div>
                  <div className={styles.adminPageParticipantCardInfo}>
                    <h3>{participant.name}</h3>
                    <p className={styles.adminPageParticipantVotes}>
                      Votos: {participant.votes?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.adminPageEmptyMessage}>
              Clique em &quot;Iniciar Paredão&quot; para selecionar os participantes
            </p>
          )}
        </div>
      </div>

      <ParticipantSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        participants={participants}
        onStartVoting={handleStartVoting}
      />
    </AdminLayout>
  );
} 