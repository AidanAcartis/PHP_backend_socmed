// pages/index.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/NewFolderComponent/header';
import QuickAccess from '../components/NewFolderComponent/Section/quickAccess';
import SectionMental from '../components/NewFolderComponent/Section/mentalSec';
import ResourceCenter from '../components/NewFolderComponent/Section/ressourceCenter';
import SupportSection from '../components/NewFolderComponent/Section/supportSection';
import Layout from '../components/forPages/PageLayout';

export default function HomePage() {
  return (
    <div>
      <Header />
      <Layout>
      <div className="container grid grid-cols-2 gap-4 mx-auto p-4">
          <Link href="/home/fonctionnality">
            <QuickAccess />
          </Link>
          <Link href="/home/statistics">
            <SectionMental />
          </Link>
          <Link href="/home/ressources">
            <ResourceCenter />
          </Link>
          <Link href="/home/support">
            <SupportSection />
          </Link>
    </div>
      </Layout>
    </div>
  );
}
