import React from "react";
import { Auth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";

export const SignOutButton = () => {
    const { SignOut } = Auth();
    const navigate = useNavigate();

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try{
            await SignOut();
            navigate("/")
        } catch(err) {
            console.error(err);
        }
    }
    
    return(
        <>
            <button onClick={handleSignOut} className="hover: cursor-pointer">
                Sign Out
            </button>
        </>
    )
}