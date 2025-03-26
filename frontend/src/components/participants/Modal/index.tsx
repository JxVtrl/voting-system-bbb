import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import styles from './styles.module.scss';

interface ParticipantModalProps {
    isOpen: boolean;
    participant: Participant | null;
    onClose: () => void;
    onSave: (participant: Participant) => Promise<void>;
}

export default function ParticipantModal({
    isOpen,
    participant,
    onClose,
    onSave,
}: ParticipantModalProps) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        imageUrl: '',
        status: 'normal' as 'normal' | 'líder' | 'eliminado',
        isActive: true,
        votes: 0
    });

    useEffect(() => {
        if (participant) {
            setFormData({
                id: participant.id,
                name: participant.name,
                imageUrl: participant.imageUrl,
                status: participant.status || 'normal',
                isActive: participant.isActive ?? true,
                votes: participant.votes ?? 0
            });
        } else {
            setFormData({
                id: '',
                name: '',
                imageUrl: '',
                status: 'normal',
                isActive: true,
                votes: 0
            });
        }
    }, [participant]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {participant ? 'Editar Participante' : 'Novo Participante'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="imageUrl">URL da Imagem</label>
                        <input
                            type="url"
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'normal' | 'líder' | 'eliminado' })}
                        >
                            <option value="normal">Normal</option>
                            <option value="líder">Líder</option>
                            <option value="eliminado">Eliminado</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            Ativo
                        </label>
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 