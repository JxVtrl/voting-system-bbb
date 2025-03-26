import { useState } from 'react';
import Image from 'next/image';

interface Participant {
  id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
}

interface ParticipantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onStartVoting: (selectedIds: string[]) => void;
}

export default function ParticipantSelectionModal({
  isOpen,
  onClose,
  participants,
  onStartVoting,
}: ParticipantSelectionModalProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const toggleParticipantSelection = (participantId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      }
      if (prev.length < 3) {
        return [...prev, participantId];
      }
      return prev;
    });
  };

  const handleStartVoting = () => {
    if (selectedParticipants.length === 3) {
      onStartVoting(selectedParticipants);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Selecionar Participantes para o Paredão</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Selecione exatamente 3 participantes para o paredão. Apenas participantes ativos estão disponíveis.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {participants
            .filter(p => p.isActive)
            .map((participant) => (
              <div
                key={participant.id}
                className={`relative bg-gray-50 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedParticipants.includes(participant.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => toggleParticipantSelection(participant.id)}
              >
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <Image
                    src={participant.imageUrl}
                    alt={participant.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  {selectedParticipants.includes(participant.id) && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Selecionado
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-center">{participant.name}</h3>
              </div>
            ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedParticipants.length}/3 participantes selecionados
          </p>
          <div className="space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleStartVoting}
              disabled={selectedParticipants.length !== 3}
              className={`px-4 py-2 rounded font-medium ${
                selectedParticipants.length === 3
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Iniciar Paredão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 