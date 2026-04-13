import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";

//Auth default value type
interface AuthContextType {
    session: Session | null;
    signUpNewUser: (email: string, password: string) => Promise<any>;
    SignInUser: (email: string, password: string) => Promise<any>;
    SignInWithGoogle: () => Promise<any>;
    SignOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProps extends React.PropsWithChildren{
    children: ReactNode;
}

export const AuthContextProvider = ( {children} : AuthContextProps ) => {
    const [session, setSession ] = useState<Session | null>(null);

    const authUnavailableResponse = {
        success: false,
        error: "La autenticación no está configurada en este frontend.",
    };

    //Sign up
    const signUpNewUser = async (email : string, password : string) => {
        if (!supabase) {
            return authUnavailableResponse;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Error signing up: ", error);
            return {
                success: false, 
                error }
        }

        return {
            success: true,
            user: data
        };
    }

    //Sign in
    const SignInUser = async (email: string, password: string) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error){
                console.error("Sign in error ", error);
                return {
                    success: false,
                    error: error.message
                }
            };
            console.log("Successful sign in ", data.session);
            return {
                success: true,
                data
            }

        } catch(error) {
            console.error("An error ocurred while siging in ", error);
        }
    }

    const SignInWithGoogle = async () => {
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: 'http://localhost:5173'
            } 
        });

        if (error){
            console.error("Error with google sign in provider ", error);
            return {
                success: false, 
                error: error.message
            };
        };

        return {
            success: true,
            data
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: {session}}) => {
            setSession(session);
        });

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    // SIgn out
    const SignOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            console.error("There was an error while signing out ", error);
        } else {
            console.log("Signed out user")
        }
    }

    return (
        <AuthContext.Provider
            value={{session, signUpNewUser, SignInUser, SignInWithGoogle, SignOut}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const Auth = () => {
    const context =  useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }

    return context;
}
