"use server";

import { getServerActionAuth, protectAction } from "../lib/auth";

export const signOutAction = async () => {
    try {

        await protectAction()
        const auth = getServerActionAuth(); // Assurez-vous que c'est 'auth' et pas 'Auth'

        const { error } = await auth.signOut();
        if (error) throw error
       
        return { errorMessage: null };
    } catch (error) {
        let errorMessage = "An error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { errorMessage };
    }
};
