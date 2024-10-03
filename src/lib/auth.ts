import { CookiesMethods, CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";

const getSupabaseAuth = ({
    isComponent = true,
}: {
    isComponent: boolean;
}) => {
    const cookieStore = nextCookies();

    const cookies: CookiesMethods = {
        get(name: string) {
            return cookieStore.get(name)?.value;
        },
        // Méthodes pour le serveur
        set(name: string, value: string, options?: CookieOptions) {
            if (!isComponent) {
                cookieStore.set({ name, value, ...options });
            } else {
                console.warn("set() called from client; operation skipped.");
            }
        },
        remove(name: string, options?: CookieOptions) {
            if (!isComponent) {
                cookieStore.set({ name, value: "", ...options });
            } else {
                console.warn("remove() called from client; operation skipped.");
            }
        },
    };

    const client = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies,
        }
    );
    return client.auth;
};

export const getUser = async () => {
    const auth = getSupabaseAuth({ isComponent: true });
    const user = (await auth.getUser()).data.user;
    return user;
};

export const protectAction = async () => {
    const auth = getSupabaseAuth({ isComponent: true });
    const user = (await auth.getUser()).data.user;

    if (!user) throw new Error("Not authorized");
};

export const getServerActionAuth = () => {
    return getSupabaseAuth({ isComponent: false });
};

export default getSupabaseAuth;
