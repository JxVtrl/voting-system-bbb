import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { api } from '@/services/api';
import styles from './styles.module.scss';
import Image from 'next/image';

interface ParedaoModalProps {
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => Promise<boolean>;
}

export function ParedaoModal({ onClose, onConfirm }: ParedaoModalProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (participant.status === 'líder' || isSubmitting) return;

    setSelectedIds(prev => {
      const id = participant.id;
      if (prev.includes(id)) {
        return prev.filter(prevId => prevId !== id);
      }
      return [...prev, id];
    });
  };

  const handleConfirm = async () => {
    if (selectedIds.length >= 2 && !isSubmitting) {
      try {
        setIsSubmitting(true);
        const success = await onConfirm(selectedIds);
        if (success) {
          setSelectedIds([]);
          onClose();
        }
      } catch (error) {
        console.error('Erro ao confirmar seleção:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedIds([]);
      onClose();
    }
  };

  return (
    <div className={styles.paredaoModal} onClick={handleClose}>
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
                  } ${participant.status === 'líder' ? styles.paredaoModalCardLeader : ''} ${
                    isSubmitting ? styles.paredaoModalCardDisabled : ''
                  }`}
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
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                className={styles.paredaoModalButton}
                onClick={handleConfirm}
                disabled={selectedIds.length < 2 || isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.paredaoModalButtonLoading}>
                    <svg className={styles.paredaoModalSpinner} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
                    </svg>
                    <span>Confirmando...</span>
                  </div>
                ) : (
                  `Confirmar (${selectedIds.length} selecionados)`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 