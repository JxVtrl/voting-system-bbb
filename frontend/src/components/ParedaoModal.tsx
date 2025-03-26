import styled from 'styled-components';
import { useState } from 'react';
import { Participant } from '../types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  color: #1a365d;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
`;

const ParticipantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ParticipantCard = styled.div<{ $isSelected: boolean; $isLeader: boolean }>`
  background: ${props => props.$isSelected ? '#e6f0ff' : 'white'};
  border: 2px solid ${props => props.$isSelected ? '#3182ce' : '#e2e8f0'};
  border-radius: 8px;
  padding: 12px;
  cursor: ${props => props.$isLeader ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.$isLeader ? 0.7 : 1};

  &:hover {
    transform: ${props => props.$isLeader ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isLeader ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }
`;

const ParticipantImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ParticipantName = styled.div`
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 4px;
`;

const LeaderBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e53e3e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'secondary' }>`
  background: ${props => props.$variant ? '#718096' : '#3182ce'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

interface ParedaoModalProps {
  participants: Participant[];
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export function ParedaoModal({ participants, onClose, onConfirm }: ParedaoModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleParticipantClick = (participant: Participant) => {
    if (participant.status === 'líder') return;

    setSelectedIds(prev => {
      if (prev.includes(participant.id)) {
        return prev.filter(id => id !== participant.id);
      }
      return [...prev, participant.id];
    });
  };

  const handleConfirm = () => {
    if (selectedIds.length >= 2) {
      onConfirm(selectedIds);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Selecione os Participantes para o Paredão</Title>
        
        <ParticipantGrid>
          {participants.map(participant => (
            <ParticipantCard
              key={participant.id}
              $isSelected={selectedIds.includes(participant.id)}
              $isLeader={participant.status === 'líder'}
              onClick={() => handleParticipantClick(participant)}
            >
              <ParticipantImage src={participant.imageUrl} alt={participant.name} />
              <ParticipantName>{participant.name}</ParticipantName>
              {participant.status === 'líder' && (
                <LeaderBadge>Líder</LeaderBadge>
              )}
            </ParticipantCard>
          ))}
        </ParticipantGrid>

        <ButtonGroup>
          <Button $variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedIds.length < 2}
          >
            Confirmar ({selectedIds.length} selecionados)
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
} 