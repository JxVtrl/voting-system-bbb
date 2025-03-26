import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface ParticipantSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    participants: Participant[];
    onStartVoting: (selectedIds: number[]) => void;
}

export default function ParticipantSelectionModal({
    isOpen,
    onClose,
    participants,
    onStartVoting,
}: ParticipantSelectionModalProps) {
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const MIN_PARTICIPANTS = 2;

    // Reset estado quando o modal for fechado
    useEffect(() => {
        if (!isOpen) {
            setSelectedParticipants([]);
        }
    }, [isOpen]);

    const toggleParticipantSelection = (participant: Participant) => {
        if (participant.status === 'líder') return;
        
        setSelectedParticipants(prev => {
            const id = participant.id;
            if (prev.includes(id)) {
                return prev.filter(prevId => prevId !== id);
            }
            return [...prev, id];
        });
    };

    const handleStartVoting = () => {
        if (selectedParticipants.length >= MIN_PARTICIPANTS) {
            onStartVoting(selectedParticipants);
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedParticipants([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.participantSelectionModal}>
            <div className={styles.participantSelectionModalContent}>
                <div className={styles.participantSelectionModalHeader}>
                    <h2 className={styles.participantSelectionModalTitle}>
                        Selecionar Participantes para o Paredão
                    </h2>
                    <button
                        onClick={handleClose}
                        className={styles.participantSelectionModalCloseButton}
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
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleStartVoting}
                            disabled={selectedParticipants.length < MIN_PARTICIPANTS}
                            className={`${styles.participantSelectionModalStartButton} ${
                                selectedParticipants.length >= MIN_PARTICIPANTS
                                    ? styles.participantSelectionModalStartButtonEnabled
                                    : styles.participantSelectionModalStartButtonDisabled
                            }`}
                        >
                            Iniciar Paredão
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 