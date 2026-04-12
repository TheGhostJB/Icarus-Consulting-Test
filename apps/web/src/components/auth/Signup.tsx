"use client"

import React, { useEffect, useState } from "react";
import { Auth } from "../../context/AuthContext";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { GoX } from "react-icons/go";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPass, setConfPass] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { session, signUpNewUser } = Auth();

    useEffect(() => {
        console.log("Auth context session -> ", session);
    }, [session]);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const result = await signUpNewUser(email, password);

            if (!result.success) {
                setError(result.error ?? `An unexpected error occurred during signup ${error}`);
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

    console.log("Email -> ", email, "\npassword -> ", password);
    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-10 ">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <div className="mb-6 flex flex-row gap-10">
                    <div>
                        <h1 className="text-[28px] font-bold leading-tight text-[#0B2A4A]">Create account</h1>{/* CHECAR SOLORES DE LA PALETA */}
                        <p className="mt-2 text-[16px] leading-6 text-[#5B6475]">Join the community and start earning rewards</p>
                    </div>
                    <button type="button" className="hover:cursor-pointer" onClick={() => {}}>
                        <GoX color="bg-slate-500"/>
                    </button>
                </div>
                <Form className="flex w-full max-w-md flex-col gap-4" onSubmit={handleSignUp}>
                    <TextField
                        isRequired
                        name="name"
                        type="name"
                        onChange={setName}
                        >
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" />
                        <FieldError />
                    </TextField>
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
                    <TextField
                        isRequired
                        minLength={8}
                        name="confirm password"
                        type="password"
                        onChange={setConfPass}
                        validate={(value) => {
                            if (confPass != password) {
                                return "Please confirm your password correctly";
                            }
                            return null;
                        }}
                        >
                        <Label>Confirm Password</Label>
                        <Input placeholder="Confirm your password" />
                        <FieldError />
                    </TextField>
                    <p className="text-sm text-slate-600 text-center mt-1.5">
                        I agree to the <span className="font-semibold text-slate-900">Terms & Conditions</span> and{" "}
                        <span className="font-semibold text-slate-900">Privacy Policy</span>
                    </p>
                    <div className="max-w">
                        <Button type="submit" className="mt-4 h-14 w-full rounded-2xl bg-slate-800">
                        Sign Up
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
