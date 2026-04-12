import { useNavigate } from "react-router-dom";
import { Auth } from "../../context/AuthContext"

export const SigninWithGoogle = () => {
    const { SignInWithGoogle } = Auth();
    const navigate = useNavigate();

    const handleSignIn = () => {
        try{
            SignInWithGoogle();
            navigate("/team");
        } catch(err) {
            console.error("Error with google sign in ", err);
        }
    }

    return (
        <>
            <button onClick={handleSignIn} className="hover: cursor-pointer">
                Sign in with Google!
            </button>
        </>
    )
}