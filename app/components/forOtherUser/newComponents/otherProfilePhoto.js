// getUserProfilePhoto.js
export async function getUserProfilePhoto(userId) {
    console.log("userId de la personne:", userId);
    
    try {
        // Envoie une requête GET pour récupérer l'avatar avec l'userId en paramètre
        const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/users/get_profile_photo.php?userId=${userId}`, {
            method: 'GET',
            credentials: 'include' // Gestion de sessions et cookies si nécessaire
        });

        // Vérifie si la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // Récupère les données en format JSON
        const data = await response.json();
        console.log("Données reçues :", data);

        // Vérifie si l'URL de l'avatar est présente dans les données
        if (data && data.photo_path) {
            console.log("Avatar trouvé :", data.photo_path);
            return data.photo_path; // Retourne l'URL de l'avatar
        } else {
            console.log("Aucun avatar trouvé pour l'utilisateur.");
            return null; // Retourne null si aucun avatar n'est trouvé
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la photo de profil :", error);
        return null; // Retourne null en cas d'erreur
    }
}
