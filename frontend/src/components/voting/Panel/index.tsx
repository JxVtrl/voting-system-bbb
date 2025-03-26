import Image from 'next/image';
import { useState } from 'react';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface VotingPanelProps {
    participants: Participant[];
    onVote: (participantId: string) => void;
    isVotingEnabled: boolean;
}

export function VotingPanel({ participants = [], onVote, isVotingEnabled }: VotingPanelProps) {
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

    const handleVote = () => {
        if (selectedParticipant) {
            onVote(selectedParticipant);
            setSelectedParticipant(null);
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
                        className={`${styles.votingPanelCard} ${selectedParticipant === participant.id ? styles.votingPanelCardSelected : ''
                            }`}
                        onClick={() => isVotingEnabled && setSelectedParticipant(participant.id)}
                    >
                        <Image
                            src={participant.imageUrl}
                            alt={participant.name}
                            width={150}
                            height={150}
                            priority
                            className={styles.votingPanelImage}
                        />
                        <h3 className={styles.votingPanelName}>{participant.name}</h3>
                        {participant.votes !== undefined && (
                            <div className={styles.votingPanelVotes}>{participant.votes} votos</div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className={styles.votingPanelVoteButton}
                onClick={handleVote}
                disabled={!isVotingEnabled || !selectedParticipant}
            >
                Votar para Eliminar
            </button>

            {!isVotingEnabled && (
                <div className={styles.votingPanelStatus}>
                    Votação encerrada. Aguarde o resultado!
                </div>
            )}
        </div>
    );
} 