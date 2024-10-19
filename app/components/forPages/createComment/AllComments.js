'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServerFetchComments } from '../../ServerFetchComments'; // Vérifie le chemin

const AllComments = () => {
    const router = useRouter();
    const { query } = router;
    const postId = query?.postId; // Pas besoin d'utiliser l'opérateur de chaînage optionnel ici

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifie que postId est défini
        if (!postId) {
            console.error("postId est undefined");
            setLoading(false);
            return;
        }

        const fetchComments = async () => {
            try {
                // Appel à la fonction ServerFetchComments
                const data = await ServerFetchComments();

                if (!data) {
                    console.error("Aucune donnée récupérée");
                    return;
                }

                // Filtrer les commentaires pour ne garder que ceux du postId courant
                const filteredComments = data.filter(comment => comment.post_id === postId);
                setComments(filteredComments);
            } catch (error) {
                console.error("Erreur lors de la récupération des commentaires :", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchComments();
    }, [postId]);

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            {/* Affichage des commentaires */}
            {comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment.id}>
                        {comment.username}
                        {comment.content}</div>
                ))
            ) : (
                <div>Aucun commentaire trouvé.</div>
            )}
        </div>
    );
};

export default AllComments;
