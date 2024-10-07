"use client";

import React, { useTransition } from 'react'
import { signOutAction } from '../../../actions/users';

function SignOutButton() {

    const [isPending, startTransition] = useTransition
    ()

    const handleClickSignOutButton = async () => {
        startTransition(async () => {
            await signOutAction(); //We are gonna create it in 'users.ts'
        });
    }

    return (
        <button
            onClick={handleClickSignOutButton}
            className="bg-socialBlue p-2 mt-4"
        >
            {isPending ? "Signing Out..." : "Sign Out"}
        </button>
    );
}

export default SignOutButton;