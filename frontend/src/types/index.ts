export interface Participant {
  id: string;
  name: string;
  imageUrl: string;
  status?: 'eliminado' | 'líder' | 'normal';
  isActive?: boolean;
  votes?: number;
}

export interface VotingStatus {
  isEnabled: boolean;
  startTime?: string;
  endTime?: string;
  totalVotes: number;
  participants: Participant[];
}

export interface VotingHistory {
  id: string;
  startTime: string;
  endTime: string;
  totalVotes: number;
  participants: Participant[];
  winner?: Participant;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 