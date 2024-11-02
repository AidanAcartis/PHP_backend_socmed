/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from 'react';

export default function UserFiles() {
  const [userId, setUserId] = useState(''); // État pour l'ID utilisateur
  const [photos, setPhotos] = useState([]); // Pour stocker les photos
  const [videos, setVideos] = useState([]); // Pour stocker les vidéos
  const [pdfs, setPdfs] = useState([]); // Pour stocker les PDF

  // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
  const fetchUserId = async () => {
    try {
      console.log("Début de la récupération de l'ID utilisateur...");
      const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
      console.log("Statut de la réponse de l'ID utilisateur :", response.status);
      if (!response.ok) {
        throw new Error("Erreur de la réponse lors de la récupération de l'ID utilisateur");
      }
      const userIdFromFile = await response.text();
      console.log("ID utilisateur récupéré :", userIdFromFile.trim());
      setUserId(userIdFromFile.trim());
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
    }
  };

  // Fonction pour récupérer les fichiers de l'utilisateur connecté depuis 'userFile.json'
  const fetchUserFiles = async () => {
    try {
      const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/posts/createPost/userFile.json');
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des fichiers de l'utilisateur");
      }
      const data = await response.json();
      
      // Filtrer les fichiers selon le userId et séparer par type
      const userFiles = data.filter(file => file.user_id === userId);
      setPhotos(userFiles.filter(file => file.doc_type === 'photo'));
      setVideos(userFiles.filter(file => file.doc_type === 'video'));
      setPdfs(userFiles.filter(file => file.doc_type === 'pdf'));
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers de l'utilisateur :", error);
    }
  };

  // Utiliser useEffect pour appeler fetchUserId et fetchUserFiles au chargement du composant
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserFiles();
    }
  }, [userId]);

   // Fonction pour extraire le nom du fichier depuis l'URL
   const extractFileName = (url) => {
    return url.split('/').pop();
  };

  return (
    <div className="p-4 space-y-6">
      <section>
        <h2 className="text-xl font-bold">Photos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="overflow-hidden rounded-md h-48 flex items-center shadow-md">
              <img src={photo.doc_url} alt={`photo-${index}`} className="rounded-md shadow-lg w-full h-auto" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Vidéos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <div key={index} className="overflow-hidden rounded-md h-48 flex items-center shadow-md">
              <video src={video.doc_url} controls className="rounded-md shadow-lg w-full h-auto"></video>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">PDFs</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {pdfs.map((pdf, index) => (
            <div key={index} className="overflow-hidden rounded-md h-48 flex items-center shadow-md">
              <a href={pdf.doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {extractFileName(pdf.doc_url)}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
