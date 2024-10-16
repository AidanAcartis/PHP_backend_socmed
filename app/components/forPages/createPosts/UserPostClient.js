'use client';

import React, { useEffect, useState } from 'react';
import { ServerFetchPost } from '../../ServerFetchPost';
import Avatar from '../Avatar';
import Link from 'next/link';
import Card from '../Cards';
import ClickOutHandler from '../ClickOutHandler';
import UserNameClient from '../../forIdentity/UserNameClient';
import { ServerFetchUsername } from '../../ServerFetchUsername';
import { handleDeletePost } from '../../../api/posts/deletePost';
import { useCommentActions } from '../../../api/comments/actions';
import { handleReactionClick } from '../../../api/reactions/reactionAction';

const PostCard = ({ post }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const { commText, setCommText, handleShare, loading } = useCommentActions(); // Récupération des actions et des états
    const [selectedReaction, setSelectedReaction] = useState(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>); // Réaction par défaut
    const [hovered, setHovered] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false); // État pour afficher les emojis
    const postId = post.id; // Assurez-vous que 'post' a une propriété 'id'
    const userId = post.userId; // Assurez-vous que 'post' a une propriété 'userId'

    // Récupérer le nom d'utilisateur
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const username = await ServerFetchUsername();
                setUsername(username);
            } catch (error) {
                console.error("Erreur lors de la récupération du nom d'utilisateur :", error);
            }
        };
        fetchUsername();
    }, []);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutsideMenu = () => {
        setMenuOpen(false);
    };
    
    const handleReaction = (reactionType) => {
        handleReactionClick(reactionType, postId, setSelectedReaction, setShowEmojis, setHovered);
    };
    

    return (
        <Card>
            <div className="flex gap-3">
                <div>
                    <Link href='./home/profile'>
                        <span className="cursor-pointer">
                            <Avatar />
                        </span>
                    </Link>
                </div>
                <div className="grow">
                    <p>
                        {username ? (
                            <UserNameClient initialUsername={username} />
                        ) : 'Chargement...'} 
                        partage un <a className="text-socialBlue">album</a>
                    </p>
                    <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                </div>

                <ClickOutHandler onClickOut={handleClickOutsideMenu}>
                    <div className="relative">
                        <button onClick={handleMenuClick} className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </button>
                        {menuOpen && (
                            <div className="absolute -right-6 py-3 w-48 bg-white rounded-sm shadow-md shadow-gray-300 border border-gray-100">
                                <a href="/saved" className="flex px-2 py-2 gap-2 text-gray-800 hover:bg-socialBlue hover:text-white rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                    Save post
                                </a>
                                <a 
                                    href="#" 
                                    className="flex px-2 py-2 gap-2 text-gray-800  hover:bg-socialBlue hover:text-white rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                                    onClick={() => handleDeletePost(post)} // Passez l'objet post
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Delete
                                </a>
                                <a href="#" className="flex px-2 py-2 gap-2 text-gray-800 hover:bg-socialBlue hover:text-white rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                                    </svg>
                                Turn notifications
                                </a>
                            <a href="#" className="flex px-2 py-2 gap-2 text-gray-800 hover:bg-socialBlue hover:text-white rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                Hide post
                            </a>
                            <a href="#" className="flex px-2 py-2 gap-2 text-gray-800 hover:bg-socialBlue hover:text-white rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                Report
                            </a>
                            </div>
                        )}
                    </div>
                </ClickOutHandler>
            </div>
            <div>
                {post.content}
                <div className="rounded-md overflow-hidden">
                    <img src={post.photos} alt="photos" />
                </div>
            </div>

            <div className="mt-5 flex gap-8">
                {/*Boutton des reactions*/}
                <div className="relative">
                    <span 
                        onMouseEnter={() => setHovered(true)} 
                        onClick={() => setShowEmojis(!showEmojis)} // Toggle emoji display
                    >
                        {selectedReaction || 'Réagir'} {/* Affiche l'icône sélectionnée ou "Réagir" */}
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
    <Avatar />
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

const PostList = ({ posts }) => {
    return (
        <div>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

const UserPostClient = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await ServerFetchPost();
                // Trier les posts du plus grand ID au plus petit
                const sortedPosts = data.sort((a, b) => b.id - a.id);
                setPosts(sortedPosts);
            } catch (error) {
                console.error("Erreur lors de la récupération des posts :", error);
            }
        };
        fetchPosts();
    }, []);

    return <PostList posts={posts} />;
};

export default UserPostClient;
