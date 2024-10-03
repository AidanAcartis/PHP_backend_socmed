/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from 'react';

export default function Photos() {
  const [photos, setPhotos] = useState([]);

  // Charger les photos depuis le fichier JSON
  useEffect(() => {
    fetch('/anime_images.json')
      .then(response => response.json())
      .then(data => setPhotos(data))
      .catch(error => console.error('Erreur lors du chargement des photos:', error));
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4">
      {photos.map((photo, index) => (
        <div key={index} className="overflow-hidden rounded-md h-48 flex items-center shadow-md">
          <img src={photo} alt={`photo-${index}`} className="rounded-md shadow-lg w-full h-auto" />
        </div>
      ))}
    </div>
  );
}
