import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de Navegação */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                BBB 25 - Admin
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin')
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/votacoes"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/votacoes')
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Votações
              </Link>
              <Link
                href="/admin/participantes"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/participantes')
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Participantes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 