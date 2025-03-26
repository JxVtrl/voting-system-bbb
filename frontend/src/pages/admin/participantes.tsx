import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { api } from '@/services/api';
import { toast } from 'react-toastify';
import Head from 'next/head';
import AdminLayout from '@/components/admin/Layout';
import Image from 'next/image';
import ParticipantModal from '@/components/participants/Modal';
import styles from '@/styles/admin.module.scss';

export default function GerenciarParticipantes() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadParticipants = async () => {
    try {
      const response = await api.getParticipants();
      const participantsArray = Object.values(response).map((p: Participant) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        status: p.status,
        isActive: p.isActive ?? true,
        votes: p.votes ?? 0
      }));
      setParticipants(participantsArray);
    } catch (err) {
      toast.error('Erro ao carregar participantes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este participante?')) return;

    try {
      await api.deleteParticipant(id);
      toast.success('Participante excluído com sucesso');
      loadParticipants();
    } catch (err) {
      toast.error('Erro ao excluir participante');
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditingParticipant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (participant: Participant) => {
    try {
      await api.updateParticipant(participant.id, {
        ...participant,
        isActive: !participant.isActive
      });
      toast.success('Status atualizado com sucesso');
      loadParticipants();
    } catch (err) {
      toast.error('Erro ao atualizar status');
      console.error(err);
    }
  };

  const handleSave = async (participant: Participant) => {
    try {
      if (editingParticipant) {
        await api.updateParticipant(participant.id, participant);
        toast.success('Participante atualizado com sucesso');
      } else {
        await api.createParticipant(participant);
        toast.success('Participante criado com sucesso');
      }
      setIsModalOpen(false);
      loadParticipants();
    } catch (err) {
      toast.error('Erro ao salvar participante');
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gerenciar Participantes - BBB 25</title>
        <meta name="description" content="Gerenciamento de participantes do BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.adminPageContainer}>
        <div className={styles.adminPageHeader}>
          <h1 className={styles.adminPageHeaderTitle}>Gerenciar Participantes</h1>
          <p className={styles.adminPageHeaderDescription}>Adicione, edite ou remova participantes do BBB 25</p>
        </div>

        <div className={styles.adminPageCard}>
          <div className={styles.adminPageCardHeader}>
            <h2>Lista de Participantes</h2>
            <button
              onClick={handleAdd}
              className={`${styles.adminPageButton} ${styles.adminPageButtonPrimary}`}
            >
              Adicionar Participante
            </button>
          </div>

          {isLoading ? (
            <div className={styles.adminPageLoading}>
              <div className={styles.adminPageLoadingSpinner} />
              <p>Carregando participantes...</p>
            </div>
          ) : (
            <div className={styles.adminPageCardGrid}>
              {participants.map((participant) => (
                <div key={participant.id} className={styles.adminPageParticipantCard}>
                  <div className={styles.adminPageParticipantCardImage}>
                    <Image
                      src={participant.imageUrl}
                      alt={participant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className={styles.adminPageParticipantCardInfo}>
                    <h3>{participant.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`${styles.adminPageStatus} ${
                        participant.isActive ? styles.adminPageStatusSuccess : styles.adminPageStatusDanger
                      }`}>
                        {participant.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      {participant.status === 'líder' && (
                        <span className={`${styles.adminPageStatus} ${styles.adminPageStatusWarning}`}>
                          Líder
                        </span>
                      )}
                      {participant.status === 'eliminado' && (
                        <span className={`${styles.adminPageStatus} ${styles.adminPageStatusDanger}`}>
                          Eliminado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.adminPageParticipantCardActions}>
                    <button
                      onClick={() => handleEdit(participant)}
                      className={`${styles.adminPageButton} ${styles.adminPageButtonSecondary}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(participant)}
                      className={`${styles.adminPageButton} ${
                        participant.isActive ? styles.adminPageButtonWarning : styles.adminPageButtonSuccess
                      }`}
                    >
                      {participant.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className={`${styles.adminPageButton} ${styles.adminPageButtonDanger}`}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ParticipantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        participant={editingParticipant}
      />
    </AdminLayout>
  );
}