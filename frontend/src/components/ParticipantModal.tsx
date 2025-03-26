import { useState, useEffect } from 'react';

interface Participant {
  id: string;
  name: string;
  imageUrl: string;
  status?: string;
  isActive: boolean;
}

interface ParticipantModalProps {
  participant: Participant | null;
  onClose: () => void;
  onSave: (participant: Omit<Participant, 'id'>) => Promise<void>;
  onUpdate?: (participant: Participant) => Promise<void>;
}

export default function ParticipantModal({
  participant,
  onClose,
  onSave,
  onUpdate,
}: ParticipantModalProps) {
  const [formData, setFormData] = useState<Omit<Participant, 'id'>>({
    name: '',
    imageUrl: '',
    status: '',
    isActive: true,
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name,
        imageUrl: participant.imageUrl,
        status: participant.status || '',
        isActive: participant.isActive,
      });
    }
  }, [participant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (participant && onUpdate) {
        await onUpdate({ ...participant, ...formData });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar participante:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {participant ? 'Editar Participante' : 'Adicionar Participante'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Sem status</option>
              <option value="líder">Líder</option>
              <option value="indicado">Indicado</option>
              <option value="eliminado">Eliminado</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label className="ml-2 text-sm text-gray-700">
              Participante Ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {participant ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 