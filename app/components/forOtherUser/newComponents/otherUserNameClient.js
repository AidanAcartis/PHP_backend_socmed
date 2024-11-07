// src/app/components/forIdentity/UserNameClient.js
'use client';

export default function FollowedUserNameClient({ initialUsername }) {
    return (
            <span className="mr-1 font-semibold cursor-pointer hover:underline">
                {initialUsername || 'Chargement...'}
            </span>
    );
}
