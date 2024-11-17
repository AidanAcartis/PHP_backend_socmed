// pages/index.js
'use client';
import { useState } from 'react';
import Header from '../../components/NewFolderComponent/header';
import MainMenu from '../../components/NewFolderComponent/mainMenu';
import FonctNavigationCard from '../../components/NewFolderComponent/Navigation/fonctNav';


export default function FonctionnalityPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 items-center">
        <FonctNavigationCard />
      </div>
    </div>
  );
}
