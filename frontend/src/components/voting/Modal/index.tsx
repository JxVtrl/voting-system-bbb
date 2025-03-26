import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { api } from '@/services/api';
import styles from './styles.module.scss';
import Image from 'next/image';

interface ParedaoModalProps {
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export function ParedaoModal({ onClose, onConfirm }: ParedaoModalProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await api.getParticipants();
        // Converte o objeto de participantes em um array e filtra apenas os ativos
        const participantsArray = Object.values(response)
          .map(p => p as Participant)
          .filter(participant => participant.isActive && participant.status !== 'eliminado');
        setParticipants(participantsArray);
      } catch (error) {
        console.error('Erro ao carregar participantes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  const handleParticipantClick = (participant: Participant) => {
    if (participant.status === 'líder') return;

    setSelectedIds(prev => {
      if (prev.includes(participant.id)) {
        return prev.filter(id => id !== participant.id);
      }
      return [...prev, participant.id];
    });
  };

  const handleConfirm = () => {
    if (selectedIds.length >= 2) {
      onConfirm(selectedIds);
    }
  };

  return (
    <div className={styles.paredaoModal} onClick={onClose}>
      <div className={styles.paredaoModalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.paredaoModalTitle}>
          {loading ? 'Carregando participantes...' : 'Selecione os Participantes para o Paredão'}
        </h2>
        
        {!loading && (
          <>
            <div className={styles.paredaoModalGrid}>
              {participants.map(participant => (
                <div
                  key={participant.id}
                  className={`${styles.paredaoModalCard} ${
                    selectedIds.includes(participant.id) ? styles.paredaoModalCardSelected : ''
                  } ${participant.status === 'líder' ? styles.paredaoModalCardLeader : ''}`}
                  onClick={() => handleParticipantClick(participant)}
                >
                  <Image
                    src={participant.imageUrl}
                    alt={participant.name}
                    width={200}
                    height={200}
                    className={styles.paredaoModalImage}
                  />
                  <div className={styles.paredaoModalName}>{participant.name}</div>
                  {participant.status === 'líder' && (
                    <div className={styles.paredaoModalLeaderBadge}>Líder</div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.paredaoModalButtonGroup}>
              <button
                className={styles.paredaoModalButton}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className={styles.paredaoModalButton}
                onClick={handleConfirm}
                disabled={selectedIds.length < 2}
              >
                Confirmar ({selectedIds.length} selecionados)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 