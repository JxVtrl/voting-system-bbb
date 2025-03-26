import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/Layout';
import styles from '@/styles/admin.module.scss';

export default function Configuracoes() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminLayout>
      <Head>
        <title>Configurações - BBB 25</title>
        <meta name="description" content="Configurações do sistema de votação BBB 25" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.adminPageContainer}>
        <div className={styles.adminPageHeader}>
          <h1 className={styles.adminPageHeaderTitle}>Configurações</h1>
          <p className={styles.adminPageHeaderDescription}>Gerencie as configurações do sistema</p>
        </div>

        <div className={styles.adminPageCard}>
          <div className={styles.adminPageCardHeader}>
            <h2>Configurações Gerais</h2>
          </div>

          {isLoading ? (
            <div className={styles.adminPageLoading}>
              <div className={styles.adminPageLoadingSpinner} />
              <p className={styles.adminPageLoadingText}>Carregando configurações...</p>
            </div>
          ) : (
            <div className={styles.adminPageCardContent}>
              <p className={styles.adminPageEmptyMessage}>
                Em desenvolvimento...
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 