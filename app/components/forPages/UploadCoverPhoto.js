import { useState } from "react";

export default function UploadCoverPhoto({ userId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append("cover_photo", file);
      formData.append("user_id", userId);

      // Affichage du contenu du fichier et de formData pour débogage
      console.log("Fichier sélectionné :", file);
      console.log("FormData avant envoi :");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await fetch("http://localhost/Devoi_socila_media/src/backend/controllers/users/updateCoverPhoto.php", {
          method: 'POST',
          credentials: 'include', // Include credentials for session management
          // Ne pas spécifier les headers pour 'Content-Type', car 'FormData' le gère automatiquement
          body: formData // Utiliser formData au lieu de JSON.stringify
        });

        if (response.ok) {
          alert("Photo de couverture mise à jour avec succès !");
        } else {
          throw new Error("Erreur lors de la mise à jour de la photo de couverture.");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Échec du téléchargement de la photo.");
      }
    }
  };

  return (
    <div>
      <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
        Changer cover photo
      </label>
    </div>
  );
}
