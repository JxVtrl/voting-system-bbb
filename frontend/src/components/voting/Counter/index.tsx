import styles from './styles.module.scss';

interface VoteCounterProps {
    totalVotes: number;
    votesPerSecond: number;
}

export default function VoteCounter({ totalVotes, votesPerSecond }: VoteCounterProps) {
    return (
        <div className={styles.voteCounter}>
            <h2 className={styles.voteCounterTitle}>Estatísticas de Votação</h2>
            <div className={styles.voteCounterGrid}>
                <div className={styles.voteCounterStatTotal}>
                    <h3 className={styles.voteCounterStatTitleTotal}>Total de Votos</h3>
                    <p className={styles.voteCounterStatValueTotal}>{totalVotes.toLocaleString()}</p>
                </div>
                <div className={styles.voteCounterStatRate}>
                    <h3 className={styles.voteCounterStatTitleRate}>Votos por Segundo</h3>
                    <p className={styles.voteCounterStatValueRate}>{votesPerSecond.toLocaleString()}</p>
                </div>
            </div>
            <div className={styles.voteCounterUpdateTime}>
                <p>Última atualização: {new Date().toLocaleTimeString()}</p>
            </div>
        </div>
    );
} 