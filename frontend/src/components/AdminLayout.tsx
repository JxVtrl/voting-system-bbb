import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Vote, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/participantes', label: 'Participantes', icon: Users },
    { path: '/admin/votacoes', label: 'Votações', icon: Vote },
    { path: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <Sidebar>
          <SidebarHeader className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">BBB 25</h1>
            <p className="text-sm text-gray-500 mt-1">Painel Administrativo</p>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === item.path}
                      tooltip={item.label}
                    >
                      <Link href={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 