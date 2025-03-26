import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface ParticipantModalProps {
    participant: Participant | null;
    onClose: () => void;
    onSave: (participant: Omit<Participant, 'id'>) => Promise<void>;
    onUpdate?: (participant: Participant) => Promise<void>;
}

export default function ParticipantModal({
    participant,
    onClose,
    onSave,
    onUpdate,
}: ParticipantModalProps) {
    const [formData, setFormData] = useState<Omit<Participant, 'id'>>({
        name: '',
        imageUrl: '',
        status: 'normal',
        isActive: true,
        votes: 0
    });

    useEffect(() => {
        if (participant) {
            setFormData({
                name: participant.name,
                imageUrl: participant.imageUrl,
                status: participant.status || 'normal',
                isActive: participant.isActive ?? true,
                votes: participant.votes ?? 0
            });
        }
    }, [participant]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (participant && onUpdate) {
                await onUpdate({ ...participant, ...formData });
            } else {
                await onSave(formData);
            }
            onClose();
        } catch (error) {
            console.error('Erro ao salvar participante:', error);
        }
    };

    return (
        <div className={styles.participantModal}>
            <div className={styles.participantModalContent}>
                <div className={styles.participantModalHeader}>
                    <h2 className={styles.participantModalTitle}>
                        {participant ? 'Editar Participante' : 'Adicionar Participante'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={styles.participantModalCloseButton}
                    >
                        <svg
                            className={styles.participantModalCloseButtonIcon}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.participantModalForm}>
                    <div className={styles.participantModalFormGroup}>
                        <label className={styles.participantModalLabel}>
                            Nome
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.participantModalInput}
                            required
                        />
                    </div>

                    <div className={styles.participantModalFormGroup}>
                        <label className={styles.participantModalLabel}>
                            URL da Imagem
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className={styles.participantModalInput}
                            required
                        />
                    </div>

                    <div className={styles.participantModalFormGroup}>
                        <label className={styles.participantModalLabel}>
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'eliminado' | 'líder' | 'normal' })}
                            className={styles.participantModalInput}
                        >
                            <option value="normal">Normal</option>
                            <option value="líder">Líder</option>
                            <option value="eliminado">Eliminado</option>
                        </select>
                    </div>

                    <div className={styles.participantModalCheckboxGroup}>
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className={styles.participantModalCheckbox}
                        />
                        <label className={styles.participantModalCheckboxLabel}>
                            Participante Ativo
                        </label>
                    </div>

                    <div className="participant-modal__actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.participantModalCancelButton}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.participantModalSubmitButton}
                        >
                            {participant ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 