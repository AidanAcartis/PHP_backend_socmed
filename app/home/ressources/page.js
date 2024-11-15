// pages/index.js
'use client';
import { useState } from 'react';
import Header from '../../components/NewFolderComponent/header';
import MainMenu from '../../components/NewFolderComponent/mainMenu';
import ResourceCenter from '../../components/NewFolderComponent/Section/ressourceCenter';

export default function FonctionnalityPage() {
  return (
    <div>
      <Header />
      <MainMenu />
      <div className="container mx-auto p-4">
        <ResourceCenter />
      </div>
    </div>
  );
}
