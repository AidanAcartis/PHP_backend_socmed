declare module "@supabase/ssr" {
    export interface CookiesMethods {
        get(name: string): string | undefined;
        set(name: string, value: string, options?: CookieOptions): void;
        remove(name: string, options?: CookieOptions): void;
    }


    export interface CookieOptions {
        path?: string;
        expires?: Date;
        maxAge?: number;
        domain?: string;
        secure?: boolean;
        httpOnly?: boolean;
        sameSite?: 'lax' | 'none' | 'strict';
    }

    export function createServerClient(
        url: string,
        key: string,
        options?: any
    ): any;
}
