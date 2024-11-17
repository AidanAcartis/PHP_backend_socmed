'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../forPages/Cards';
import { useCommentActions } from '../../../api/comments/actions';
import UserReactions from '../../forPages/React/UserReaction';
import ProfilePhoto from '../../forPages/ProfilePhoto';
import { handleReactionClick } from '../../../api/reactions/reactionAction';

const OtherPostCard = ({ post }) => {
    const { commText, setCommText, handleShare, loading } = useCommentActions(); // Récupération des actions et des états
    const [hovered, setHovered] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false); // État pour afficher les emojis
    const postId = post.id; // Assurez-vous que 'post' a une propriété 'id'
    const userId = post.userId; // Assurez-vous que 'post' a une propriété 'userId'
    const [selectedReaction, setSelectedReaction] = useState(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>); // Réaction par défaut 
    
    const handleReaction = (reactionType) => {
        handleReactionClick(reactionType, postId, setSelectedReaction, setShowEmojis, setHovered);
        window.location.reload();
    };

    // Fonction pour extraire le nom du fichier depuis l'URL
   const extractFileName = (url) => {
    return url.split('/').pop();
  };

    return (
        <Card>
            <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
            <div>
                {post.content}
                <div className="rounded-md overflow-hidden">
                    {post.doc_type === 'photo' && (
                        <img src={post.doc_url} alt="photo" />
                    )}
                    {post.doc_type === 'video' && (
                        <video controls>
                            <source src={post.doc_url} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture des vidéos.
                        </video>
                    )}
                    {post.doc_type === 'pdf' && (
                        <a href={post.doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            {extractFileName(post.doc_url)}
                        </a>
                    )}
                </div>
            </div>

            <div className="mt-5 flex gap-8">
                {/*Boutton des reactions*/}
                <div className="relative">
                    <span 
                        onMouseEnter={() => setHovered(true)} 
                        onClick={() => setShowEmojis(!showEmojis)} // Toggle emoji display
                    >
                        <UserReactions posts={[post]} />
                         {/* Affiche l'icône sélectionnée ou "Réagir" */}
                    </span>
                    {/* Affichage des emojis au survol */}
                    {hovered && showEmojis && (
                        <div className="absolute bottom-full mb-1 flex gap-2 bg-white rounded-md shadow-lg p-2">
                            <button onClick={() => handleReaction('like', post.id, setSelectedReaction)}>👍</button>
                            <button onClick={() => handleReaction('love', post.id, setSelectedReaction)}>❤️</button>
                            <button onClick={() => handleReaction('haha', post.id, setSelectedReaction)}>😂</button>
                            <button onClick={() => handleReaction('sad', post.id, setSelectedReaction)}>😢</button>
                            <button onClick={() => handleReaction('angry', post.id, setSelectedReaction)}>😡</button>
                        </div>
                    )}
                </div>
                {/*Boutton des commentaires*/}
                <Link href={`/home/comments?postId=${post.id}`} passHref>
                    <button className="flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        {post.comment_count} {/* Remplacer avec le nombre réel de commentaires */}
                    </button>
                </Link>
                <button className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                    {post.shares}
                </button>
            </div>
            {/*Comments  */}
            <div className="flex mt-4 gap-3">
                <ProfilePhoto />
                <div className="border grow rounded-full relative">
                    <textarea 
                        className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full" 
                        placeholder="Laissez un commentaire"
                        value={commText}
                        onChange={(e) => setCommText(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        onClick={() => handleShare(postId, userId)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2"
                    >
                        ➤ {/* Utilisez une flèche ici, ou vous pouvez ajouter une icône */}
                    </button>
                </div>
            </div>

</Card>
    );
};

export default OtherPostCard;

