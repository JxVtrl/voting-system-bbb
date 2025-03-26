import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { VotingHistory } from '@/types';
import { api } from '@/services/api';
import AdminLayout from '@/components/admin/Layout';
import styles from '@/styles/admin.module.scss';

export default function Votacoes() {
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVotingHistory = async () => {
      try {
        const response = await api.getVotingHistory();
        setVotingHistory(response || []);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setVotingHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVotingHistory();
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Histórico de Votações - BBB 25</title>
        <meta name="description" content="Histórico de votações do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.adminPageContainer}>
        <div className={styles.adminPageHeader}>
          <h1 className={styles.adminPageHeaderTitle}>Histórico de Votações</h1>
          <p className={styles.adminPageHeaderDescription}>Visualize o histórico completo de paredões</p>
        </div>

        <div className={styles.adminPageCard}>
          <div className={styles.adminPageCardHeader}>
            <h2>Paredões Anteriores</h2>
          </div>

          {isLoading ? (
            <div className={styles.adminPageLoading}>
              <div className={styles.adminPageLoadingSpinner} />
              <p>Carregando histórico...</p>
            </div>
          ) : votingHistory.length === 0 ? (
            <div className={styles.adminPageCardContent}>
              <p className="text-gray-500 text-center py-4">
                Nenhuma votação realizada ainda.
              </p>
            </div>
          ) : (
            <div className={styles.adminPageCardGrid}>
              {votingHistory.map((voting) => (
                <div key={voting.id} className={styles.adminPageVotingCard}>
                  <div className={styles.adminPageVotingCardHeader}>
                    <h3>Paredão #{voting.id}</h3>
                    <span className={styles.adminPageVotingCardDate}>
                      {new Date(voting.endTime).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className={styles.adminPageVotingCardParticipants}>
                    {voting.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className={`${styles.adminPageVotingCardParticipant} ${
                          voting.winner?.id === participant.id ? styles.adminPageVotingCardWinner : ''
                        }`}
                      >
                        <div className={styles.adminPageVotingCardParticipantImage}>
                          <Image
                            src={participant.imageUrl}
                            alt={participant.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className={styles.adminPageVotingCardParticipantInfo}>
                          <h4>{participant.name}</h4>
                          <p>
                            {voting.winner?.id === participant.id ? (
                              <span className={styles.adminPageStatusDanger}>Eliminado</span>
                            ) : (
                              <span className={styles.adminPageStatusSuccess}>Permaneceu</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.adminPageVotingCardFooter}>
                    <p>Total de Votos: {voting.totalVotes.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 