import styled from 'styled-components';
import { Participant } from '../types';
import { ParticipantCircle } from './ParticipantCircle';

interface ParticipantsScrollProps {
  participants: Participant[];
}

const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 30px 0 5px;
  margin: 0;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  max-width: 100%;
  margin: 0 auto;
  flex-wrap: nowrap;
`;

const ParticipantWrapper = styled.div<{ isEliminated?: boolean }>`
  position: relative;
  width: 40px;
  height: 40px;
  transition: transform 0.2s ease;
  filter: ${props => props.isEliminated ? 'grayscale(100%)' : 'none'};
  opacity: ${props => props.isEliminated ? '0.8' : '1'};

  &:hover {
    z-index: 1;
    transform: ${props => props.isEliminated ? 'none' : 'scale(1.1)'};
  }

  /* Efeito de hover com sombra */
  &:hover > * {
    box-shadow: ${props => props.isEliminated ? 'none' : '0 8px 16px rgba(0,0,0,0.1)'};
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 600;
  
  /* Efeito de gradiente no texto */
  background: linear-gradient(45deg, #FF0000, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ParticipantsScroll = ({ participants }: ParticipantsScrollProps) => {
  return (
    <>
      <Title>Participantes BBB 25</Title>
      <Container>
        <FlexContainer>
          {participants.map((participant) => (
            <ParticipantWrapper 
              key={participant.id}
              isEliminated={participant.status === 'eliminado'}
            >
              <ParticipantCircle participant={participant} />
            </ParticipantWrapper>
          ))}
        </FlexContainer>
      </Container>
    </>
  );
};

export { ParticipantsScroll }; 