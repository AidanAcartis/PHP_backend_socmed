// pages/index.js
'use client';
import { useState } from 'react';
import Header from '../../components/NewFolderComponent/header';
import MainMenu from '../../components/NewFolderComponent/mainMenu';
import Statistics from '../../components/NewFolderComponent/Section/statistics';

export default function FonctionnalityPage() {
  return (
    <div>
      <Header />
      <MainMenu />
      <div className="container mx-auto p-4">
        <Statistics />
      </div>
    </div>
  );
}
