interface VoteCounterProps {
  totalVotes: number;
  votesPerSecond: number;
}

export default function VoteCounter({ totalVotes, votesPerSecond }: VoteCounterProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Estatísticas de Votação</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Total de Votos</h3>
          <p className="text-3xl font-bold text-blue-600">{totalVotes.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Votos por Segundo</h3>
          <p className="text-3xl font-bold text-green-600">{votesPerSecond.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Última atualização: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
} 