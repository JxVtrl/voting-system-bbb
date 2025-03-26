import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Participant, VotingStatus } from '../types';
import { api } from '../services/api';
import Head from 'next/head';
import { VotingPanel } from '@/components/VotingPanel';
import { ParticipantsScroll } from '@/components/ParticipantsScroll';

const PageContainer = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;

  /* Esconde a scrollbar mas mantém a funcionalidade */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.header`
  text-align: center;
  padding: 10px 0;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Logo = styled.h1`
  font-size: 42px;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  
  /* Efeito de texto com sombra */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  
  /* Gradiente no texto */
  background: linear-gradient(45deg, #FF0000, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 24px;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 24px;
  color: #ff4444;
`;

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    isEnabled: false,
    participants: [],
    totalVotes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [participantsData, statusData] = await Promise.all([
          api.getParticipants(),
          api.getVotingStatus()
        ]);
        setParticipants(participantsData);
        setVotingStatus(statusData);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleVote = async (participantId: string) => {
    try {
      await api.vote(participantId);
      const newStatus = await api.getVotingStatus();
      setVotingStatus(newStatus);
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar voto');
    }
  };

  if (loading) {
    return <LoadingContainer>Carregando...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <>
      <Head>
        <title>BBB 25 - Sistema de Votação</title>
        <meta name="description" content="Sistema de votação para o BBB 25" />
      </Head>

      <PageContainer>
        <Header>
          <Logo>BBB 25</Logo>
        </Header>

        <ContentContainer>
          <ParticipantsScroll participants={participants} />

          <VotingPanel
            participants={votingStatus.participants}
            onVote={handleVote}
            isVotingEnabled={votingStatus.isEnabled}
          />
        </ContentContainer>
      </PageContainer>
    </>
  );
}
