import { useNavigate } from "react-router-dom";

function PaySuccess() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <h1> Succesfull payment </h1>
                <button onClick={() => navigate("/store")}> Go to store </button>
            </div>
        </>
    )
}

export default PaySuccess;
