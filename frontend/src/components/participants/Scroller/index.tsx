import { Participant } from '@/types';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import styles from './styles.module.scss';
import { ParticipantCircle } from '../Circle';

export function ParticipantsScroll() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await api.getParticipants();
        // Converte o objeto de participantes em array
        const participantsArray = Object.values(response) as Participant[];
        setParticipants(participantsArray);
      } catch (error) {
        console.error('Erro ao carregar participantes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  if (loading) {
    return <div className={styles.participantsScrollLoading}>Carregando participantes...</div>;
  }

  return (
    <div className={styles.participantsScroll}>
      <div className={styles.participantsScrollContainer}>
        {participants.map((participant) => (
          <ParticipantCircle
            key={participant.id}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
} 