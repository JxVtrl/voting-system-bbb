import Image from 'next/image';
import { useState } from 'react';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface VotingPanelProps {
    participants: Participant[];
    onVote: (participantId: number) => Promise<void>;
    isVotingEnabled: boolean;
}

export function VotingPanel({ participants = [], onVote, isVotingEnabled }: VotingPanelProps) {
    const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVote = async () => {
        if (selectedParticipant && !isSubmitting) {
            try {
                setIsSubmitting(true);
                await onVote(selectedParticipant);
                setSelectedParticipant(null);
            } catch (error) {
                console.error('Erro ao votar:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!Array.isArray(participants)) {
        return (
            <div className={styles.votingPanel}>
                <h2 className={styles.votingPanelTitle}>Nenhuma votação em andamento</h2>
            </div>
        );
    }

    return (
        <div className={styles.votingPanel}>
            <h2 className={styles.votingPanelTitle}>Paredão BBB 25</h2>
            <div className={styles.votingPanelGrid}>
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className={`${styles.votingPanelCard} ${
                            selectedParticipant === participant.id ? styles.votingPanelCardSelected : ''
                        } ${!isVotingEnabled || isSubmitting ? styles.votingPanelCardDisabled : ''}`}
                        onClick={() => {
                            if (isVotingEnabled && !isSubmitting) {
                                setSelectedParticipant(participant.id);
                            }
                        }}
                        role="button"
                        tabIndex={isVotingEnabled && !isSubmitting ? 0 : -1}
                        aria-selected={selectedParticipant === participant.id}
                        aria-disabled={!isVotingEnabled || isSubmitting}
                    >
                        <div className={styles.votingPanelCardImage}>
                            <Image
                                src={participant.imageUrl}
                                alt={participant.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority
                                className={styles.votingPanelImage}
                            />
                        </div>
                        <h3 className={styles.votingPanelName}>{participant.name}</h3>
                        {participant.votes !== undefined && (
                            <div className={styles.votingPanelVotes}>
                                {participant.votes.toLocaleString()} voto{participant.votes !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className={`${styles.votingPanelButton} ${
                    !isVotingEnabled || !selectedParticipant || isSubmitting
                        ? styles.votingPanelButtonDisabled
                        : ''
                }`}
                onClick={handleVote}
                disabled={!isVotingEnabled || !selectedParticipant || isSubmitting}
                aria-busy={isSubmitting}
            >
                {isSubmitting ? (
                    <div className={styles.votingPanelButtonLoading}>
                        <svg className={styles.votingPanelSpinner} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
                        </svg>
                        <span>Votando...</span>
                    </div>
                ) : (
                    'Votar para Eliminar'
                )}
            </button>

            {!isVotingEnabled && (
                <div className={styles.votingPanelStatus} role="alert">
                    Votação encerrada. Aguarde o resultado!
                </div>
            )}
        </div>
    );
} 