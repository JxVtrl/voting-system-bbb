import styled from 'styled-components';
import { useState } from 'react';
import { Participant } from '../types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  color: #1a365d;
  margin-bottom: 8px;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #4a5568;
  text-align: center;
  font-size: 1rem;
`;

const ParticipantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
`;

const ParticipantCard = styled.div<{ $selected?: boolean; $isLeader?: boolean }>`
  border: 2px solid ${props => props.$selected ? '#3182ce' : '#e2e8f0'};
  border-radius: 8px;
  padding: 8px;
  cursor: ${props => props.$isLeader ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#ebf8ff' : 'white'};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.$isLeader ? 0.6 : 1};

  &:hover {
    transform: ${props => props.$isLeader ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isLeader ? 'none' : '0 4px 8px rgba(0,0,0,0.1)'};
  }
`;

const LeaderBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e53e3e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 1;
`;

const ParticipantImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: transform 0.2s ease;

  ${ParticipantCard}:hover & {
    transform: scale(1.05);
  }
`;

const ParticipantName = styled.div`
  text-align: center;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
`;

const Footer = styled.div`
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  margin-top: 16px;
`;

const SelectionInfo = styled.div`
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button<{ $variant?: 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${props => props.$variant ? '#718096' : '#3182ce'};
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$variant ? '#4a5568' : '#2c5282'};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
`;

interface ParedaoModalProps {
  participants: Participant[];
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export function ParedaoModal({ participants, onClose, onConfirm }: ParedaoModalProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  const activeParticipants = participants.filter(p => p.isActive);

  const handleParticipantClick = (participantId: string, isLeader: boolean) => {
    if (isLeader) return;
    
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      }
      return [...prev, participantId];
    });
  };

  const handleConfirm = () => {
    if (selectedParticipants.length >= 2) {
      onConfirm(selectedParticipants);
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Selecione os Participantes</Title>
          <Subtitle>Escolha os participantes para o paredão</Subtitle>
        </Header>

        <ParticipantGrid>
          {activeParticipants.map(participant => {
            const isLeader = participant.status === 'líder';
            return (
              <ParticipantCard
                key={participant.id}
                $selected={selectedParticipants.includes(participant.id)}
                $isLeader={isLeader}
                onClick={() => handleParticipantClick(participant.id, isLeader)}
              >
                {isLeader && <LeaderBadge>Líder</LeaderBadge>}
                <ParticipantImage src={participant.imageUrl} alt={participant.name} />
                <ParticipantName>{participant.name}</ParticipantName>
              </ParticipantCard>
            );
          })}
        </ParticipantGrid>

        <Footer>
          <SelectionInfo>
            {selectedParticipants.length} participantes selecionados
          </SelectionInfo>
          <ButtonGroup>
            <Button $variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedParticipants.length < 2}
            >
              Confirmar Seleção
            </Button>
          </ButtonGroup>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
} 