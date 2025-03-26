import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className={styles.adminLayout}>
      <nav className={styles.adminNav}>
        <div className={styles.adminNavHeader}>
          <h1>BBB 25</h1>
          <p>Painel Administrativo</p>
        </div>

        <div className={styles.adminNavLinks}>
          <Link
            href="/admin"
            className={`${styles.adminNavLink} ${isActive('/admin') ? styles.adminNavLinkActive : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/participantes"
            className={`${styles.adminNavLink} ${isActive('/admin/participantes') ? styles.adminNavLinkActive : ''}`}
          >
            Participantes
          </Link>
          <Link
            href="/admin/votacoes"
            className={`${styles.adminNavLink} ${isActive('/admin/votacoes') ? styles.adminNavLinkActive : ''}`}
          >
            Votações
          </Link>
        </div>
      </nav>

      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
} 