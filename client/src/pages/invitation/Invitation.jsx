import {
    Check,
    X,
    Users,
    ShieldCheck,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { acceptInvitation, declineInvitation, fetchInvitation } from "../../services/invitationService";
import { useEffect, useState } from "react";
import useWorkspaceStore from "../../stores/workspaceStore";
import useAuthStore from "../../stores/authStore";
import Loader from "../../components/common/Loader";
import DeclineInvitationModal from "./DeclineInvitationModal";

function InvitationPage() {
    const { token } = useParams();
    const { setCurrentWorkspace } = useWorkspaceStore();
    const { checkAuth } = useAuthStore();
    const navigate = useNavigate();

    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [invitation, setInvitation] = useState(null);

    const [data, setData] = useState({
        name: "",
        password: "",
        token,
    });

    useEffect(() => {
        const handleFetchInvitation = async (token) => {
            try {
                const response = await fetchInvitation(token);
                setInvitation(response?.invitation);

            } catch (error) {
                console.error(error.response?.data?.message || "Failed to get invitation");
            }
        }

        handleFetchInvitation(token);

    }, [navigate, token]);
                

    const handleAcceptInvite = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);
        try {
            await acceptInvitation(data);

            checkAuth();
            setCurrentWorkspace(invitation?.workspaceId);
            navigate("/");

        } catch (error) {
            setError(error.response?.data?.message || "Error accepting invitation. Try again.");

        } finally {
            setLoading(false);
        }
    }

    const handleDeclineInvite = async () => {
        setError("");
        setLoading(true);
        try {
            await declineInvitation(token);

            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "Error declining invitation. Try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

     return (
        <div className="min-h-dvh bg-subtle flex items-center justify-center px-4 py-5">
        <div className="w-full max-w-[1000px] bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[42%_58%]">

            {/* Left */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-900 p-10 text-white">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-card/10" />
                <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-card/5" />

                <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-card/15 flex items-center justify-center">
                    <span className="text-xl font-bold">✦</span>
                    </div>
                    <span className="text-xl font-bold">Engino</span>
                </div>

                <div className="mt-20">
                    <p className="text-xs font-semibold tracking-[0.2em] text-violet-200 uppercase">
                    You're invited
                    </p>

                    <h1 className="mt-4 text-4xl font-bold leading-tight">
                    Join your team
                    <br />
                    on Engino.
                    </h1>

                    <p className="mt-5 text-sm leading-6 text-violet-100 max-w-sm">
                    You've been invited to collaborate, manage projects and
                    turn ideas into structured engineering work.
                    </p>
                </div>

                <div className="mt-auto pt-16 space-y-5">
                    <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-card/10 flex items-center justify-center">
                        <Users size={19} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Team collaboration</p>
                        <p className="text-xs text-violet-200">
                        Work together in one workspace
                        </p>
                    </div>
                    </div>

                    <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-card/10 flex items-center justify-center">
                        <ShieldCheck size={19} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Secure workspace</p>
                        <p className="text-xs text-violet-200">
                        Your account is protected
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Right */}
            <div className="p-8 sm:p-12">
                <div className="max-w-[460px] mx-auto">
                <div className="mb-8">
                    <div className="h-12 w-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5">
                    <Users size={23} />
                    </div>

                    <h2 className="text-2xl font-bold text-text-primary">
                    Accept invitation
                    </h2>

                    <p className="mt-2 text-sm text-text-secondary">
                    Complete your account to join the workspace.
                    </p>
                </div>

                {/* Workspace */}
                <div className="mb-7 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-500">
                    Invited to
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-text-primary">
                        {invitation?.workspaceId?.name}
                    </p>

                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                        {invitation?.role}
                    </span>
                    </div>

                    <p className="mt-1 text-xs text-text-secondary">
                        {invitation?.email}
                    </p>
                </div>

                <form className="space-y-5">
                    {/* Name */}
                    <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Full name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Zeeshan Zahoor"
                        className="w-full h-12 rounded-xl border border-border px-4 text-sm text-text-primary outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                    />
                    </div>

                    {/* Email */}
                    <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        value={invitation?.email || "invitation@example.com"}
                        readOnly
                        className="w-full h-12 rounded-xl border border-border bg-subtle px-4 text-sm text-text-secondary outline-none cursor-not-allowed"
                    />

                    <p className="mt-1.5 text-xs text-text-muted">
                        This email is linked to your invitation.
                    </p>
                    </div>

                    {/* Password */}
                    <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Create password
                    </label>

                    <div className="relative">
                        <input
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Create a password"
                        className="w-full h-12 rounded-xl border border-border px-4 text-sm text-text-primary outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                        />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs text-text-muted">
                        <span>○ At least 8 characters</span>
                        <span>○ One uppercase letter</span>
                        <span>○ One lowercase letter</span>
                        <span>○ One number</span>
                    </div>
                    </div>

                    {error && (
                        <p className="text-danger text-xs text-center mt-2 mb-0">{error}</p>
                    )}

                    {invitation?.status === "Accepted"
                        ? (
                            <div className="text-primary text-sm
                            font-semibold text-center w-full h-10 flex items-center justify-center gap-3 bg-surface rounded-xl">
                                <Check size={18}/>
                                <span>This invitation has already been accepted.</span>
                            </div>
                        )
                        : invitation?.status === "Declined"
                            ? (
                                <div className="text-primary text-sm
                            font-semibold text-center w-full h-10 flex items-center justify-center gap-3 bg-surface rounded-xl">
                                <X size={18}/>
                                <span>This invitation has already been declined.</span>
                            </div>
                            )
                            : new Date(invitation?.expiresAt) < new Date() 
                                ? (
                                    <div className="text-primary text-sm
                            font-semibold text-center w-full h-10 flex items-center justify-center gap-3 bg-surface rounded-xl">
                                <X size={18}/>
                                <span>This invitation is expired.</span>
                            </div>
                                )
                                : (
                                <div className="pt-2 grid grid-cols-[2fr_2fr] gap-3">
                                    <button
                                        onClick={() => setIsDeclineModalOpen(true)}
                                        type="button"
                                        className="h-12 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-subtle transition flex items-center justify-center gap-2"
                                    >
                                        <X size={17} />
                                        Decline
                                    </button>

                                    <button
                                        type="submit"
                                        onClick={handleAcceptInvite}
                                        className="h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 disabled:bg-surface disabled:text-text-secondary"
                                    >
                                        <Check size={17} />
                                        {loading ? (
                                            <Loader />
                                        ) : ("Accept")}
                                    </button>
                                </div>
                            )
                    }

                    <p className="pt-1 text-center text-xs text-text-muted">
                    This invitation expires in 24 hours.
                    </p>
                </form>
                </div>
            </div>

            </div>
        </div>

                    <DeclineInvitationModal 
                        isOpen={isDeclineModalOpen}
                        onClose={() => setIsDeclineModalOpen(false)}
                        onConfirm={handleDeclineInvite}
                        isLoading={loading}
                        error={error}
                    />
        </div>
    );
}

export default InvitationPage;
