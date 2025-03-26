import styled from 'styled-components';
import Image from 'next/image';
import { Participant } from '../types';

interface ParticipantCircleProps {
  participant: Participant;
}

const Wrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
`;

const CircleContainer = styled.div<{ $isActive?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
`;

const ParticipantImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusIndicator = styled.div<{ status?: string }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => {
    switch(props.status) {
      case 'eliminado':
        return '#ff4444';
      case 'líder':
        return '#00C851';
      default:
        return '#33b5e5';
    }
  }};
  color: white;
  padding: 0 2px;
  border-radius: 4px;
  font-size: 6px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TooltipContainer = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  left: 50%;
  top: -30px;
  transform: translateX(-50%);
`;

const TooltipContent = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  position: relative;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  ${Wrapper}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px 4px 0 4px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

export function ParticipantCircle({ participant }: ParticipantCircleProps) {
  const { imageUrl, name, status, isActive = true } = participant;
  
  return (
    <Wrapper>
      <TooltipContainer>
        <TooltipContent>{name}</TooltipContent>
      </TooltipContainer>
      <CircleContainer $isActive={isActive}>
        <ImageContainer>
          <ParticipantImage
            src={imageUrl}
            alt={name}
            width={40}
            height={40}
            priority
          />
        </ImageContainer>
        {status === 'líder' && <StatusIndicator status={status}>{status}</StatusIndicator>}
      </CircleContainer>
    </Wrapper>
  );
} 