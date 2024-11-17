/* eslint-disable @next/next/no-img-element */

"use client";

export default function OtherUserFiles({ photos, videos, pdfs }) {

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
