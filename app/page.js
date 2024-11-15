// pages/index.js
'use client';
import { useState } from 'react';
import Header from './components/NewFolderComponent/header';
import Banner from './components/NewFolderComponent/banner';
import MainMenu from './components/NewFolderComponent/mainMenu';
import QuickAccess from './components/NewFolderComponent/Section/quickAccess';
import Statistics from './components/NewFolderComponent/Section/statistics';
import ResourceCenter from './components/NewFolderComponent/Section/ressourceCenter';
import SupportSection from './components/NewFolderComponent/Section/supportSection';
import Link from 'next/link';


export default function HomePage() {
  return (
    <div>
      <Header />
      <Banner />
      <MainMenu />
      <div className="container grid grid-cols-2 gap-4 mx-auto p-4">
        <Link href="/home/fonctionnality">
          <QuickAccess />
        </Link>
        <Link href="/home/statistics">
          <Statistics />
        </Link>
        <Link href="/home/ressources">
          <ResourceCenter />
        </Link>
        <Link href="/home/support">
          <SupportSection />
        </Link>
      </div>

    </div>
  );
}
