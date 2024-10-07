// src/app/components/forIdentity/UserNameClient.js
'use client';

import Link from 'next/link';

export default function UserNameClient({ initialUsername }) {
    return (
        <Link href='./home/profile'>
            <span className="mr-1 font-semibold cursor-pointer hover:underline">
                {initialUsername || 'Chargement...'}
            </span>
        </Link>
    );
}
