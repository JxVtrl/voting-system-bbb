import styled from 'styled-components';
import { Participant } from '../types';
import { ParticipantCircle } from './ParticipantCircle';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const ScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 1rem 0;
  display: flex;
  gap: 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ParticipantsContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
`;

export function ParticipantsScroll() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await api.getParticipants();
        // Converte o objeto de participantes em array
        const participantsArray = Object.values(response) as Participant[];
        setParticipants(participantsArray);
      } catch (error) {
        console.error('Erro ao carregar participantes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  if (loading) {
    return <div>Carregando participantes...</div>;
  }

  return (
    <>
      <ScrollContainer>
        <ParticipantsContainer>
          {participants.map((participant) => (
            <ParticipantCircle
              key={participant.id}
              participant={participant}
            />
          ))}
        </ParticipantsContainer>
      </ScrollContainer>
    </>
  );
} 