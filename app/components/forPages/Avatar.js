"use client"; // Add this line at the top of the file

import React, { useState, useEffect } from 'react';

export default function Avatar({ size }) {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    let width = 'w-12 h-12';  // Default size

    // Adjust the avatar size
    if (size === 'lg') {
        width = 'w-12 md:w-24';
    } else if (size === 'sm') {
        width = 'w-8';
    }

    // Function to fetch user ID
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

    // Function to fetch user avatar URL
    const fetchAvatar = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/profile_photo.json');
            const data = await response.json();
            
            const userAvatar = data.find(photo => photo.user_id === userId);
            if (userAvatar) {
                setAvatarUrl(userAvatar.photo_path);
            } else {
                console.log("No avatar found for user.");
            }
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchAvatar();
        }
    }, [userId]);

    // Function to handle file selection and upload
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const formData = new FormData();
            formData.append("profile_photo", file);
            formData.append("user_id", userId);

            try {
                const response = await fetch("http://localhost/Devoi_socila_media/src/backend/controllers/users/updateProfilePhoto.php", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (response.ok) {
                    alert("Avatar updated successfully!");
                    fetchAvatar(); // Reload avatar after update
                } else {
                    throw new Error("Error updating avatar.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to upload avatar.");
            }
        }
    };

    return (
        <div className={`${width} relative`}>
            <div className="rounded-full overflow-hidden">
                <img 
                    src={avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                    alt="avatar" 
                />
            </div>
            <div className="absolute bottom-[-5px] right-[-5px]"> {/* Adjust values here */}
                <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md cursor-pointer">
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                </label>
            </div>
        </div>
    );
}
