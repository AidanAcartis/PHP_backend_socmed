// otherUserName.js
export async function getUserProfile(userId) {
    console.log("userId de la personne:", userId);
    try {
        // Envoie une requête GET avec l'userId en paramètre
        const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/users/get_username.php?userId=${userId}`, {
            method: 'GET',
            credentials: 'include' // Permet de gérer les sessions et cookies si nécessaire
        });
  
        // Vérifie si la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
  
        // Récupère les données utilisateur en format JSON
        const userData = await response.json();

        // Vérifie si des données sont renvoyées et extrait uniquement le nom d'utilisateur
        if (userData && userData.username) {
            console.log("Nom d'utilisateur:", userData.username);
            return userData.username;
        } else {
            console.log("Aucun profil utilisateur trouvé.");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        return null;
    }
}

