import Image from 'next/image';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface ParticipantCircleProps {
    participant: Participant;
}

export function ParticipantCircle({ participant }: ParticipantCircleProps) {
    const { imageUrl, name, status, isActive = true } = participant;

    return (
        <div className={styles.participantCircle}>
            <div className={styles.participantCircleTooltip}>
                <div className={styles.participantCircleTooltipContent}>{name}</div>
            </div>
            <div className={`${styles.participantCircleContainer} ${!isActive ? styles.participantCircleContainerInactive : ''}`}>
                <div className={styles.participantCircleImageContainer}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        width={40}
                        height={40}
                        priority
                        className={styles.participantCircleImage}
                    />
                </div>
                {status === 'líder' && (
                    <div className={`${styles.participantCircleStatus} ${styles.participantCircleStatus}--${status}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
} 