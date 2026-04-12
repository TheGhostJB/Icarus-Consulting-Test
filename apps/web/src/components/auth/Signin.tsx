import React, { useState } from "react";
import { Auth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const SigninWithEmail = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { session, SignInUser } = Auth();
    const navigate = useNavigate();

    console.log("Session is -> ", session);

    const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { success, error } = await SignInUser(email, password);

        if (error) {
            setError(error);

            setTimeout(() => {
                setError("");
            }, 3000);

            return;
        }

        if (success) {
            setError("");
            navigate("/team");
        }
    };

    return (
        <div>
            <form onSubmit={handleSignIn}>
                <h2 className="font-bold pb-2">Sign in</h2>
                <p>
                    Don't have an account yet? <Link to="/signup">Sign up</Link>
                </p>
                <p> Have a google account? </p>
                <div className="flex flex-col py-4">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 mt-2"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
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
                    />
                </div>
                <button className="w-full mt-4">Sign In</button>
                {error && <p className="text-red-600 text-center pt-4">{error}</p>}
            </form>
        </div>
    );
};
