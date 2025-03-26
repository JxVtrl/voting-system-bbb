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
import styles from './styles.module.scss';

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
      <div className={styles.adminLayout}>
        <Sidebar>
          <SidebarHeader className={styles.adminLayoutHeader}>
            <h1 className={styles.adminLayoutTitle}>BBB 25</h1>
            <p className={styles.adminLayoutSubtitle}>Painel Administrativo</p>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className={styles.adminLayoutMenu}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === item.path}
                      tooltip={item.label}
                    >
                      <Link
                        href={item.path}
                        className={`${styles.adminLayoutMenuItem} ${currentPath === item.path ? styles.adminLayoutMenuItemActive : ''
                          }`}
                      >
                        <Icon className={styles.adminLayoutMenuIcon} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className={styles.adminLayoutMain}>
          <div className={styles.adminLayoutContent}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 