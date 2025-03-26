import Image from 'next/image';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface ParticipantCardProps {
    participant: Participant;
    onVote: () => void;
    isVotingEnabled: boolean;
}

export default function ParticipantCard({
    participant,
    onVote,
    isVotingEnabled,
}: ParticipantCardProps) {
    const { name, imageUrl, votes = 0, status } = participant;

    return (
        <div className={styles.participantCard}>
            <div className={styles.participantCardImageContainer}>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className={styles.participantCardImage}
                />
                {status && (
                    <div className={`${styles.participantCardStatus} ${styles.participantCardStatus}--${status === 'líder' ? styles.participantCardStatusLeader :
                            status === 'eliminado' ? styles.participantCardStatusEliminated :
                                styles.participantCardStatusDefault
                        }`}>
                        {status}
                    </div>
                )}
            </div>
            <div className={styles.participantCardContent}>
                <h2 className={styles.participantCardName}>{name}</h2>
                <div className={styles.participantCardFooter}>
                    <span className={styles.participantCardVotes}>Votos: {votes}</span>
                    <button
                        onClick={onVote}
                        disabled={!isVotingEnabled}
                        className={`${styles.participantCardVoteButton} ${isVotingEnabled ? styles.participantCardVoteButtonEnabled : styles.participantCardVoteButtonDisabled
                            }`}
                    >
                        Votar
                    </button>
                </div>
            </div>
        </div>
    );
} 