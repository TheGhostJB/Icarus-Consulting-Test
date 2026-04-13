import React, { useState } from "react";
import { Auth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { SigninWithGoogle } from "./SigninGoogle";

interface SignInProps {
    onSuccess: () => void;
    onSwitchToSignUp: () => void;
}

export const SigninWithEmailForm = ({onSuccess,onSwitchToSignUp}: SignInProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { session, SignInUser } = Auth();
    const navigate = useNavigate();

    console.log("Session is -> ", session);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const result = await SignInUser(email, password);
    
            if (!result.success) {
                setError(result.error ?? `An unexpected error occurred during signup ${error}`);
                return;
            }

            console.log(result.message);
        } catch(error) {
            console.error("Error signing up outside context ", error);
        } finally {
            onSuccess();
        }

    };
    //TODO: Implement Modal general component and forms for more structure, 
    // Sign in looks better, check docs and fix it
    return (
        <>
            <div className="p-4">
                <div className="mb-6 flex flex-row">
                    <div>
                        <h1 className="text-[28px] font-bold leading-tight text-[#0B2A4A]">Welcome Back</h1>{/* CHECAR SOLORES DE LA PALETA */}
                        <p className="mt-2 text-[16px] leading-6 text-[#5B6475]">Log in to your Titans Crew account</p>
                    </div>
                </div>
                <Form className="flex w-full max-w-md flex-col gap-4" onSubmit={handleSignIn}>
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        onChange={setEmail}
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                        >
                        <Label>Email</Label>
                        <Input placeholder="john@example.com" />
                        <FieldError />
                    </TextField>
                    <TextField
                        isRequired
                        minLength={8}
                        name="password"
                        type="password"
                        onChange={setPassword}
                        validate={(value) => {
                            if (value.length < 8) {
                                return "Password must be at least 8 characters";
                            }
                            if (!/[A-Z]/.test(value)) {
                                return "Password must contain at least one uppercase letter";
                            }
                            if (!/[0-9]/.test(value)) {
                                return "Password must contain at least one number";
                            }
                            return null;
                        }}
                        >
                        <Label>Password</Label>
                        <Input placeholder="Enter your password" />
                        <FieldError />
                    </TextField>
                    {error && (
                    <p className="text-sm text-red-600 text-center">
                        {error}
                    </p>
                    )}
                    <div className="max-w">
                        <Button type="submit" className="mt-4 h-14 w-full rounded-2xl bg-slate-800">
                        Sign In
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        <span className="h-px flex-1 bg-slate-300" />
                        <p className="m-0 whitespace-nowrap text-sm tracking-[0.08em] text-slate-500">
                            OR CONTINUE WITH
                        </p>
                        <span className="h-px flex-1 bg-slate-300" />
                    </div>
                    <div className="flex flex-col items-center gap-4">   
                        <SigninWithGoogle />
                        <p className="mt-2 text-[16px] leading-6 text-[#5B6475]">Don´t have an account? {" "} 
                            <button onClick={onSwitchToSignUp} className="hover: cursor-pointer">
                                <span className="font-semibold text-slate-900"> Sign Up</span>
                            </button>
                        </p>
                    </div>
                </Form>
            </div>
        </>
    );
};
