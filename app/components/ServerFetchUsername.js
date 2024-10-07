
// Fonction pour récupérer une ligne spécifique d'un fichier texte
export async function ServerFetchUsername() {
    try {
        const response = await fetch('http://localhost:3002/Devoi_socila_media/src/backend/controllers/users/fichier.txt');
        if (!response.ok) {
            // Si la réponse n'est pas correcte, loggons un message d'erreur
            console.error('Erreur lors de la récupération du fichier:', response.statusText);
            return '';
        }
        const data = await response.text();
        const lines = data.split('\n');
        const username = lines[0].trim(); // Supposons qu'on veuille récupérer la première ligne
        console.log("Username récupéré:", username); // Ajoute un log pour voir ce qui est récupéré
        return username;
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier:', error);
        return ''; // Retourner une chaîne vide en cas d'erreur
    }
}
