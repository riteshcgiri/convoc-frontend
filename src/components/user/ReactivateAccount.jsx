import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CircleCheckBig, LoaderCircle, ShieldX } from "lucide-react";
import Logo from "../../components/Logo/Logo";

const ReactivateAccount = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        const reactivate = async () => {
            try {
                await api.get(`${import.meta.env.VITE_API_BASE_URL}/auth/reactivate/${token}`);
                setStatus("success");
                setTimeout(() => navigate("/signin?reactivated=true"), 3000);
            } catch (err) {
                setStatus("error");
            }
        };
        reactivate();
    }, [token]);

    return (
        <div className="w-full h-screen flex items-center justify-center bg-white font-sansation">
            <div className="flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl border border-zinc-100 w-96 text-center">
                <Logo type={4} className="h-10" />

                {status === "loading" && (
                    <>
                        <LoaderCircle className="animate-spin text-primary w-10 h-10" />
                        <p className="text-zinc-400 text-sm">Reactivating your account...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">
                                <CircleCheckBig className="w-10 h-10 text-green-500" strokeWidth={1.4} />
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-primary">Account Reactivated!</h2>
                        <p className="text-zinc-400 text-sm">Redirecting you to sign in...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">
                                <ShieldX className="w-10 h-10 text-red-500 " strokeWidth={1.4} />
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-red-500">Link Expired</h2>
                        <p className="text-zinc-400 text-sm">This reactivation link is invalid or has expired.</p>
                        <button
                            onClick={() => navigate("/signin")}
                            className="w-full py-3 bg-primary text-white rounded-xl text-sm">
                            Go to Sign In
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReactivateAccount;