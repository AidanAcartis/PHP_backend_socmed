export const handleUpdateNotif = async () => {
    
        try {
            //console.log(`Suppression du post avec l'ID : ${post.id}`);
            const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/displayNotification/updateNotif.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            console.log(`Réponse du serveur : ${response.status}`);
            
            if (response.ok) {
                alert('Les notifications sont lues');
                // Mettez à jour l'interface utilisateur pour supprimer le post visuellement
            } else {
                const errorResponse = await response.json();
                console.error(`Error lors de la lecture des notifications : ${errorResponse.message}`);
                alert('Erreur de la lecture des notifications');
            }
        } catch (error) {
            console.error('Une erreur est survenue :', error);
            alert('Une erreur est survenue');
        }
    
    //window.location.reload();
};
