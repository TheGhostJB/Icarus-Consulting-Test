import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../../context/AuthContext";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { session, signUpNewUser } = Auth();

    useEffect(() => {
        console.log("Auth context session -> ", session);
    }, [session]);

    const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const result = await signUpNewUser(email, password);

            if (!result.success) {
                setError(result.error ?? "An unexpected error occurred during signup.");
                return;
            }

            setMessage(result.message);
        } catch (error) {
            console.error("Error signing up outside context ", error);
            setError("An unexpected error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    const sessionPreview = session
        ? JSON.stringify(
            {
                userId: session.user.id,
                email: session.user.email,
                expiresAt: session.expires_at,
            },
            null,
            2,
        )
        : null;

    return (
        <div>
            <form onSubmit={handleSignUp} className="max-w-md m-auto pt-24">
                <h2 className="font-bold pb-2">Sign up</h2>
                <p>
                    Already have an account? <Link to="/signin">Sign in!</Link>
                </p>
                <div className="flex flex-col py-4">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 mt-2"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        autoComplete="email"
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-col py-4">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 mt-2"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        disabled={loading}
                    />
                </div>
                <button className="w-full mt-4 hover:cursor-pointer">Sign Up</button>
                {error && <p className="text-red-600 text-center pt-4">{error}</p>}
            </form>
        </div>
    );
};
