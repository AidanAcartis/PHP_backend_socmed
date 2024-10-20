'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServerFetchComments } from '../../components/ServerFetchComments'; // Chemin vers la fonction de récupération des commentaires
import Layout from '../../components/forPages/PageLayout';
import Card from '../../components/forPages/Cards';
import Link from 'next/link';
import Avatar from '../../components/forPages/Avatar';
import { useCommentActions } from '../../api/comments/actions'; // Hook personnalisé pour gérer les actions des commentaires
import { ServerFetchUsername } from '../../components/ServerFetchUsername'; // Récupération du nom d'utilisateur

import ClickOutHandler from '../../components/forPages/ClickOutHandler'; // Gestion des clics à l'extérieur d'un élément
import { ServerFetchCommentById } from '../../components/FetchPost'; // Fonction de récupération des détails du post
import UserNameClient from '../../components/forIdentity/UserNameClient';
import DeleteCommentButton from '../../api/comments/deleteComment';
import Reaction from '../../api/comments/commentReactionAction';

const AllComments = () => {
    const router = useRouter();
    const [postId, setPostId] = useState(null); // Initialisation de l'ID du post
    const [post, setPost] = useState(null); // Stocker les données du post
    const [comments, setComments] = useState([]); // Stocker les commentaires
    const [loading, setLoading] = useState(true); // Gestion du chargement
    const [menuOpen, setMenuOpen] = useState(false); // Gestion du menu déroulant
    const [username, setUsername] = useState(null); // Stockage du nom d'utilisateur
    const { commText, setCommText, handleShare, loading: commentLoading } = useCommentActions(); // Hook pour les actions de commentaires
    
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

    // Gérer le clic pour ouvrir/fermer le menu
    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    // Fermer le menu si clic à l'extérieur
    const handleClickOutsideMenu = () => {
        setMenuOpen(false);
    };

    const handleDeleteComment = (deletedCommentId) => {
        setComments((prevComments) => prevComments.filter(comment => comment.id !== deletedCommentId));
    };


    // Récupérer l'ID du post depuis l'URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('postId');

        if (id) {
            setPostId(Number(id)); // Convertir l'ID en nombre
        } else {
            console.error("postId est undefined");
            setLoading(false);
            return;
        }
    }, []);

    // Récupérer les détails du post quand postId est disponible
    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                const fetchedPost = await ServerFetchCommentById(postId);
                setPost(fetchedPost);
                setLoading(false); // Arrêter le chargement
            };
            fetchPost();
        }
    }, [postId]);

    // Récupérer les commentaires liés au post
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await ServerFetchComments(); // Récupération des commentaires

                if (!data) {
                    console.error("Aucune donnée récupérée");
                    return;
                }

                // Filtrer les commentaires pour ne garder que ceux du postId courant
                const filteredComments = data.filter(comment => Number(comment.post_id) === postId);
                setComments(filteredComments);
            } catch (error) {
                console.error("Erreur lors de la récupération des commentaires :", error);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId]);

    if (loading || commentLoading) return <div>Chargement...</div>;

    return (
        <Layout>
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
                        {/* Afficher la date du post */}
                        {post ? (
                            <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                        ) : (
                            <p><small>Chargement de la date...</small></p>
                        )}
                    </div>

                    {/* Menu déroulant */}
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

                {/* Contenu du post */}
                <div>
                    {post && post.content ? (
                        <div>
                            <p>{post.content}</p>
                            <div className="rounded-md overflow-hidden">
                                <img src={post.photos} alt="Post Photos" />
                            </div>
                        </div>
                    ) : (
                        <span>No content available</span>
                    )}
                </div>

                <div className="mt-5 flex gap-8">
                    <button className="flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        {/*post.likes*/}
                    </button>
                    {/* Bouton des commentaires */}
                    {post && (
                        <Link href={`/home/comments?postId=${post.id}`} passHref>
                            <button className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.24c0-1.601-1.123-2.994-2.707-3.227a48.394 48.394 0 0 0-7.293-.513c-1.584.233-2.707 1.626-2.707 3.228v6.52Z" />
                                </svg>
                                {comments.length}
                            </button>
                        </Link>
                    )}

                </div>

                {/* Formulaire pour ajouter un commentaire */}
                <div className="flex mt-4 gap-3">
                    <div>
                        <Avatar />
                    </div>
                    <div className="border grow rounded-full relative">
                        <form onSubmit={(e) => handleShare(e, postId)} className="flex">
                            <input 
                                className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full"
                                placeholder="Leave a comment"
                                value={commText}
                                onChange={(e) => setCommText(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                {/* Liste des commentaires */}
                <div className="mt-2">
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className="mt-2 bg-gray-100 rounded-lg p-3 relative"
                        >
                            <div
                                className="absolute top-0 right-0 mt-3 w-48 bg-white rounded-sm shadow-md border border-gray-100 z-10"
                            >
                                <DeleteCommentButton commentId={comment.id} onDelete={handleDeleteComment} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold cursor-pointer hover:underline">
                                    {comment.username}
                                </span>
                                <small className="text-gray-500">
                                    {new Date(comment.created_at).toLocaleString()}
                                </small>
                            </div>
                            <p className="mt-1">{comment.content}</p>
                            <Reaction commentId={comment.id} />
                    </div>
                    
                    ))}
                </div>
            </Card>
        </Layout>
    );
};

export default AllComments;
