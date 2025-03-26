import Image from 'next/image';
import { Participant } from '@/types';

interface ParticipantCardProps {
  participant: Participant;
  onVote: () => void;
  isVotingEnabled: boolean;
}

export default function ParticipantCard({
  participant,
  onVote,
  isVotingEnabled,
}: ParticipantCardProps) {
  const { name, imageUrl, votes = 0, status } = participant;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
        {status && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm font-semibold text-white ${
            status === 'líder' ? 'bg-yellow-500' :
            status === 'eliminado' ? 'bg-red-500' :
            'bg-blue-500'
          }`}>
            {status}
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{name}</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Votos: {votes}</span>
          <button
            onClick={onVote}
            disabled={!isVotingEnabled}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              isVotingEnabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Votar
          </button>
        </div>
      </div>
    </div>
  );
} 