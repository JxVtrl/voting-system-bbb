import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface ParticipantSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    participants: Participant[];
    onStartVoting: (selectedIds: number[]) => Promise<boolean>;
}

export default function ParticipantSelectionModal({
    isOpen,
    onClose,
    participants,
    onStartVoting,
}: ParticipantSelectionModalProps) {
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const MIN_PARTICIPANTS = 2;

    // Reset estado quando o modal for fechado
    useEffect(() => {
        if (!isOpen) {
            setSelectedParticipants([]);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const toggleParticipantSelection = (participant: Participant) => {
        if (participant.status === 'líder' || isSubmitting) return;
        
        setSelectedParticipants(prev => {
            const id = participant.id;
            if (prev.includes(id)) {
                return prev.filter(prevId => prevId !== id);
            }
            return [...prev, id];
        });
    };

    const handleStartVoting = async () => {
        if (selectedParticipants.length >= MIN_PARTICIPANTS && !isSubmitting) {
            try {
                setIsSubmitting(true);
                await onStartVoting(selectedParticipants);
            } catch (error) {
                console.error('Erro ao iniciar votação:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedParticipants([]);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.participantSelectionModal} onClick={handleClose}>
            <div className={styles.participantSelectionModalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.participantSelectionModalHeader}>
                    <h2 className={styles.participantSelectionModalTitle}>
                        Selecionar Participantes para o Paredão
                    </h2>
                    <button
                        onClick={handleClose}
                        className={styles.participantSelectionModalCloseButton}
                        disabled={isSubmitting}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className={styles.participantSelectionModalDescription}>
                    Selecione no mínimo {MIN_PARTICIPANTS} participantes para o paredão. O líder não pode ser selecionado.
                </p>

                <div className={styles.participantSelectionModalGrid}>
                    {participants
                        .filter(p => p.isActive)
                        .map((participant) => (
                            <div
                                key={participant.id}
                                className={`${styles.participantSelectionModalParticipantCard} ${
                                    selectedParticipants.includes(participant.id)
                                        ? styles.participantSelectionModalParticipantCardSelected
                                        : ''
                                } ${
                                    participant.status === 'líder'
                                        ? styles.participantSelectionModalParticipantCardLeader
                                        : ''
                                } ${
                                    isSubmitting
                                        ? styles.participantSelectionModalParticipantCardDisabled
                                        : ''
                                }`}
                                onClick={() => toggleParticipantSelection(participant)}
                            >
                                <div className={styles.participantSelectionModalParticipantImage}>
                                    <Image
                                        src={participant.imageUrl}
                                        alt={participant.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {selectedParticipants.includes(participant.id) && (
                                        <div className={styles.participantSelectionModalSelectedBadge}>
                                            Selecionado
                                        </div>
                                    )}
                                    {participant.status === 'líder' && (
                                        <div className={styles.participantSelectionModalLeaderBadge}>
                                            Líder
                                        </div>
                                    )}
                                </div>
                                <h3 className={styles.participantSelectionModalParticipantName}>
                                    {participant.name}
                                </h3>
                            </div>
                        ))}
                </div>

                <div className={styles.participantSelectionModalFooter}>
                    <p className={styles.participantSelectionModalSelectionCount}>
                        {selectedParticipants.length} participante{selectedParticipants.length !== 1 ? 's' : ''} selecionado{selectedParticipants.length !== 1 ? 's' : ''}
                        {selectedParticipants.length < MIN_PARTICIPANTS && (
                            <span className={styles.participantSelectionModalMinWarning}>
                                (Mínimo: {MIN_PARTICIPANTS})
                            </span>
                        )}
                    </p>
                    <div className={styles.participantSelectionModalActions}>
                        <button
                            onClick={handleClose}
                            className={styles.participantSelectionModalCancelButton}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleStartVoting}
                            disabled={selectedParticipants.length < MIN_PARTICIPANTS || isSubmitting}
                            className={`${styles.participantSelectionModalStartButton} ${
                                selectedParticipants.length >= MIN_PARTICIPANTS
                                    ? styles.participantSelectionModalStartButtonEnabled
                                    : styles.participantSelectionModalStartButtonDisabled
                            }`}
                        >
                            {isSubmitting ? (
                                <div className={styles.participantSelectionModalButtonLoading}>
                                    <svg className={styles.participantSelectionModalSpinner} viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
                                    </svg>
                                    <span>Iniciando...</span>
                                </div>
                            ) : (
                                'Iniciar Paredão'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 