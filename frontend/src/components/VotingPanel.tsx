import styled from 'styled-components';
import Image from 'next/image';
import { useState } from 'react';
import { Participant } from '../types';

interface VotingPanelProps {
  participants: Participant[];
  onVote: (participantId: string) => void;
  isVotingEnabled: boolean;
}

const PanelContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
`;

const ParticipantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ParticipantCard = styled.div<{ $selected?: boolean }>`
  background: ${props => props.$selected ? '#f8f8f8' : 'white'};
  border: 2px solid ${props => props.$selected ? '#ff0000' : '#ddd'};
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ParticipantImage = styled(Image)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px;
  object-fit: cover;
`;

const ParticipantName = styled.h3`
  margin: 10px 0;
  color: #333;
  font-size: 20px;
`;

const VoteButton = styled.button`
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const VotingStatus = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;

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
      <PanelContainer>
        <Title>Nenhuma votação em andamento</Title>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <Title>Paredão BBB 25</Title>
      <ParticipantsGrid>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            $selected={selectedParticipant === participant.id}
            onClick={() => isVotingEnabled && setSelectedParticipant(participant.id)}
          >
            <ParticipantImage
              src={participant.imageUrl}
              alt={participant.name}
              width={150}
              height={150}
              priority
            />
            <ParticipantName>{participant.name}</ParticipantName>
            {participant.votes !== undefined && (
              <div>{participant.votes} votos</div>
            )}
          </ParticipantCard>
        ))}
      </ParticipantsGrid>

      <VoteButton
        onClick={handleVote}
        disabled={!isVotingEnabled || !selectedParticipant}
      >
        Votar para Eliminar
      </VoteButton>

      {!isVotingEnabled && (
        <VotingStatus>
          Votação encerrada. Aguarde o resultado!
        </VotingStatus>
      )}
    </PanelContainer>
  );
} 