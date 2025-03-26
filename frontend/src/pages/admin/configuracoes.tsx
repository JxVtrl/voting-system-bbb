import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/Layout';

export default function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState({
    tempoVotacao: 24, // horas
    maxVotosPorIP: 100,
    mostrarVotos: true,
    notificacoes: true
  });

  const handleSalvar = async () => {
    try {
      // TODO: Implementar salvamento das configurações
      console.log('Salvando configurações:', configuracoes);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Configurações - BBB 25</title>
        <meta name="description" content="Configurações do sistema de votação BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as configurações do sistema</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {/* Configurações de Votação */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Votação</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="tempoVotacao" className="block text-sm font-medium text-gray-700">
                  Tempo de Votação (horas)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="tempoVotacao"
                    value={configuracoes.tempoVotacao}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, tempoVotacao: Number(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="1"
                    max="72"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="maxVotosPorIP" className="block text-sm font-medium text-gray-700">
                  Máximo de Votos por IP
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="maxVotosPorIP"
                    value={configuracoes.maxVotosPorIP}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, maxVotosPorIP: Number(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Exibição */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Exibição</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mostrarVotos"
                  checked={configuracoes.mostrarVotos}
                  onChange={(e) => setConfiguracoes({ ...configuracoes, mostrarVotos: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="mostrarVotos" className="ml-2 block text-sm text-gray-900">
                  Mostrar contagem de votos em tempo real
                </label>
              </div>
            </div>
          </div>

          {/* Configurações de Notificações */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Notificações</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificacoes"
                  checked={configuracoes.notificacoes}
                  onChange={(e) => setConfiguracoes({ ...configuracoes, notificacoes: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notificacoes" className="ml-2 block text-sm text-gray-900">
                  Ativar notificações de eventos importantes
                </label>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={handleSalvar}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 