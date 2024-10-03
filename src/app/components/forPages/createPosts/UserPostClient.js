'use client';

import React, { useEffect, useState } from 'react';
import { ServerFetchPost } from '../../ServerFetchPost';
import Avatar from '../Avatar';
import Link from 'next/link';
import Card from '../Cards';
import ClickOutHandler from '../ClickOutHandler';
import UserNameClient from '../../forIdentity/UserNameClient';
import { ServerFetchUsername } from '../../ServerFetchUsername';
import PostTimeShare from './PostTimeShare';

const PostCard = ({ post }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState(null);

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
                                    Save post
                                </a>
                            </div>
                        )}
                    </div>
                </ClickOutHandler>
            </div>
            <div>
                {post.content}
                <div className="rounded-md overflow-hidden">
                    <img src={post.imageUrl} alt="photos" />
                </div>
            </div>

            <div className="mt-5 flex gap-8">
                <button className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    {post.likes}
                </button>
                <button className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                </button>
                <button className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                    {post.shares}
                </button>
            </div>

            <div className="flex mt-4 gap-3">
                <Avatar />
                <div className="border grow rounded-full relative">
                    <textarea className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full" placeholder="Laissez un commentaire" />
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
