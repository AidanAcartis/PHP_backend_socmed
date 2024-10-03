'use client';

import React, { useEffect, useState } from 'react';
import { ServerFetchPost } from '../../ServerFetchPost';

const UserPostClient = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await ServerFetchPost();
            if (data) {
                setPosts(data);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id}>
                        <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserPostClient;
