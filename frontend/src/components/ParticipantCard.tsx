import Image from 'next/image';

interface ParticipantCardProps {
  name: string;
  imageUrl: string;
  votes: number;
  onVote: () => void;
  isVotingEnabled: boolean;
  status?: string;
}

export default function ParticipantCard({
  name,
  imageUrl,
  votes,
  onVote,
  isVotingEnabled,
  status
}: ParticipantCardProps) {
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
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
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