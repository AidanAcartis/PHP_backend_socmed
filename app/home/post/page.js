'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCommentActions } from '../../api/comments/actions';
import { getUserProfile } from '../../components/forOtherUser/newComponents/otherUserName';
import FollowedUserNameClient from '../../components/forOtherUser/newComponents/otherUserNameClient';
import { ServerFetchCommentById } from '../../components/FetchPost';
import { ServerFetchComments } from '../../components/ServerFetchComments';
import Layout from '../../components/forPages/PageLayout';
import Card from '../../components/forPages/Cards';
import Reaction from '../../api/comments/commentReactionAction';
import ProfilePhotoCard from '../../components/forOtherUser/newComponents/ProfilePhotoCard';

const AllComments = () => {
    const router = useRouter();
    const [postId, setPostId] = useState(null);
    const [userId, setUserId] = useState(null); // Nouvelle variable pour userId
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const { commText, setCommText, handleShare, loading: commentLoading } = useCommentActions();
    
     // Utiliser useEffect pour effectuer des appels asynchrones après que userId ait été défini
   useEffect(() => {
    const fetchUsername = async () => {
        try {
            if (userId !== null) { // Vérifiez que userId est défini
                const username = await getUserProfile(userId);
                console.log("Nom d'utilisateur récupéré :", username);
                setUsername(username);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nom d'utilisateur :", error);
        }
    };

    fetchUsername();
}, [userId]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('postId');
        const uid = urlParams.get('userId'); // Récupération de userId

        if (id) {
            setPostId(Number(id));
        } else {
            console.error("postId est undefined");
            setLoading(false);
            return;
        }

        if (uid) {
            setUserId(Number(uid)); // Conversion en nombre
        } else {
            console.warn("userId est undefined");
        }
    }, []);

    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                const fetchedPost = await ServerFetchCommentById(postId);
                setPost(fetchedPost);
                setLoading(false);
            };
            fetchPost();
        }
    }, [postId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await ServerFetchComments();
                if (!data) {
                    console.error("Aucune donnée récupérée");
                    return;
                }
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

    const extractFileName = (url) => {
        return url.split('/').pop();
    };

    return (
        <Layout>
            <Card>
                <div className="flex gap-3">
                    <div>
                        <Link href='./home/profile'>
                            <span className="cursor-pointer">
                                <ProfilePhotoCard userId={userId} />
                            </span>
                        </Link>
                    </div>
                    <div className="grow">
                        <p>
                            {username ? (
                                <FollowedUserNameClient initialUsername={username} />
                            ) : 'Chargement...'}
                            partage un <a className="text-socialBlue">album</a>
                        </p>
                        {post ? (
                            <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                        ) : (
                            <p><small>Chargement de la date...</small></p>
                        )}
                    </div>
                </div>

                <div>
                    {post && post.content ? (
                        <div>
                            <p>{post.content}</p>
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
                    ) : (
                        <span>No content available</span>
                    )}
                </div>

                <div className="mt-5 flex gap-8">
                    {post && (
                        <Link href={`/home/post?postId=${post.id}&userId=${userId}`} passHref>
                            <div>
                                <button className="flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.24c0-1.601-1.123-2.994-2.707-3.227a48.394 48.394 0 0 0-7.293-.513c-1.584.233-2.707 1.626-2.707 3.228v6.52Z" />
                                    </svg>
                                    {comments.length}
                                </button>
                            </div>
                        </Link>
                    )}
                </div>

                <div className="mt-2">
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className="mt-2 bg-gray-100 rounded-lg p-3 relative"
                        >
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
