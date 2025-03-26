import { useState, useEffect, useRef } from 'react';
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
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'votes'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo' | 'lider' | 'eliminado'>('todos');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const ITEMS_PER_PAGE = 8;

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

  useEffect(() => {
    const filtered = participants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' ? true :
        statusFilter === 'ativo' ? p.isActive :
          statusFilter === 'inativo' ? !p.isActive :
            statusFilter === p.status;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ?
          a.name.localeCompare(b.name) :
          b.name.localeCompare(a.name);
      }
      if (sortBy === 'votes') {
        return sortOrder === 'asc' ?
          (a.votes || 0) - (b.votes || 0) :
          (b.votes || 0) - (a.votes || 0);
      }
      return 0;
    });

    setFilteredParticipants(sorted);
  }, [participants, searchTerm, sortBy, sortOrder, statusFilter]);

  const totalPages = Math.ceil(filteredParticipants.length / ITEMS_PER_PAGE);
  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: 'name' | 'status' | 'votes') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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

  const handleMenuClick = (participantId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (openMenuId === participantId) {
      setOpenMenuId(null);
    } else {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setMenuPosition({
        top: buttonRect.bottom + scrollY,
        left: Math.max(0, buttonRect.right + scrollX - 160) // 160px é a largura do menu
      });
      setOpenMenuId(participantId);
    }
  };

  // Função para fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest(`.${styles.adminPageParticipantCardActions}`)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

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
            <div className={styles.adminPageHeaderActions}>
              <div className={styles.adminPageFilters}>
                <input
                  type="text"
                  placeholder="Buscar participante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.adminPageSearchInput}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'todos' | 'ativo' | 'inativo' | 'lider' | 'eliminado')}
                  className={styles.adminPageSelect}
                >
                  <option value="todos">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                  <option value="lider">Líder</option>
                  <option value="eliminado">Eliminados</option>
                </select>


              </div>

              <button
                onClick={handleAdd}
                className={`${styles.adminPageButton} ${styles.adminPageButtonPrimary}`}
              >
                Adicionar Participante
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.adminPageLoading}>
              <div className={styles.adminPageLoadingSpinner} />
              <p>Carregando participantes...</p>
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center'>

                <div className={styles.adminPageSortButtons}>
                  <button onClick={() => handleSort('name')}>
                    Nome {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button onClick={() => handleSort('votes')}>
                    Votos {sortBy === 'votes' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
                <div className={styles.adminPagePagination}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.adminPageButton}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.adminPageButton}
                  >
                    Próxima
                  </button>
                </div>
              </div>

              <div className={styles.adminPageCardGrid}>
                {paginatedParticipants.map((participant) => (
                  <div key={participant.id} className={styles.adminPageParticipantCard}>
                    <div className={styles.adminPageParticipantCardImage}>
                      <Image
                        src={participant.imageUrl}
                        alt={participant.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className={styles.adminPageParticipantCardInfo}>
                      <h3>{participant.name}</h3>
                      <div className={styles.statusContainer}>
                        <span className={`${styles.adminPageStatus} ${participant.isActive ? styles.adminPageStatusSuccess : styles.adminPageStatusDanger
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
                        ref={(el) => {
                          if (el) {
                            actionButtonRefs.current[participant.id] = el;
                          }
                        }}
                        onClick={(e) => handleMenuClick(participant.id, e)}
                        className={styles.adminPageActionButton}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                      {openMenuId === participant.id && (
                        <div
                          className={styles.adminPageActionMenu}
                          style={{
                            position: 'fixed',
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`,
                            zIndex: 99999
                          }}
                        >
                          <button onClick={() => {
                            handleEdit(participant);
                            setOpenMenuId(null);
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              handleToggleActive(participant);
                              setOpenMenuId(null);
                            }}
                            className={participant.isActive ? 'warning' : ''}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {participant.isActive ? (
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                              ) : (
                                <path d="M5.64 17.36a9 9 0 1 0 12.72 0" />
                              )}
                              <line x1="12" y1="2" x2="12" y2="12" />
                            </svg>
                            {participant.isActive ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(participant.id);
                              setOpenMenuId(null);
                            }}
                            className="danger"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
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