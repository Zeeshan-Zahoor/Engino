import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lightbulb,
    Users,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import Loader from "../../components/common/Loader";

const Login = () => {
    const { 
        login,
        checkAuth,
    } =  useAuthStore();

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true) 
        try {
            await login(formData);
            await checkAuth();

            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to login user. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-background p-4 md:p-6">
            <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-7xl overflow-hidden rounded-2xl bg-card shadow-xl md:min-h-[calc(100dvh-3rem)]">

                {/* left panel */}
                <div className="relative hidden w-[46%] overflow-hidden bg-gradient-to-br from-[#302080] via-[#39248f] to-[#241760] px-10 py-10 text-white lg:flex lg:flex-col">

                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-card/5" />
                    <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-card/5" />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/15">
                            <Zap
                                size={20}
                                fill="currentColor"
                                strokeWidth={2.5}
                            />
                        </div>

                        <span className="text-2xl font-bold tracking-tight">
                            Engino
                        </span>
                    </div>

                    {/* Hero */}
                    <div className="relative z-10 mt-auto max-w-md pb-8 pt-10">
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-purple-200">
                            Work smarter
                        </p>

                        <h1 className="text-3xl font-semibold leading-tight xl:text-4xl">
                            Turn ideas into
                            <br />
                            real progress
                        </h1>

                        <p className="mt-6 max-w-sm text-base leading-7 text-purple-100">
                            Plan smarter. Collaborate better. Build faster.
                        </p>

                        <div className="mt-10 space-y-6">
                            <Benefit
                                icon={<Lightbulb size={19} />}
                                title="Turn ideas into plans"
                                description="Transform requirements into structured, actionable work."
                            />

                            <Benefit
                                icon={<Zap size={19} />}
                                title="Leverage AI"
                                description="Let AI help analyze requirements and generate plans."
                            />

                            <Benefit
                                icon={<Users size={19} />}
                                title="Work as a team"
                                description="Keep projects, tasks and your team organized in one place."
                            />
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto pt-8">
                        <div className="mb-4 h-px w-8 bg-card/70" />

                        <p className="text-sm text-purple-100">
                            “A more organized team builds a brighter tomorrow.”
                        </p>
                    </div>
                </div>

                {/* right pannel */}
                <div className="flex flex-1 flex-col">

                    {/* Form */}
                    <div className="flex flex-1 items-center justify-center px-6 pb-10 sm:px-10 lg:px-16">
                        <div className="w-full max-w-md">
                            {/* Mobile logo */}
                            <div className="mb-10 flex items-center gap-2 lg:hidden">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#542cff] text-white">
                                    <Zap
                                        size={20}
                                        fill="currentColor"
                                    />
                                </div>

                                <span className="text-2xl font-bold text-text-primary">
                                    Engino
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                                    Welcome back
                                </h2>

                                <p className="mt-2 text-sm text-text-secondary">
                                    Sign in to continue to Engino
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-text-primary"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@company.com"
                                        autoComplete="email"
                                        required
                                        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-[#542cff] focus:ring-4 focus:ring-[#542cff]/10"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-text-primary"
                                        >
                                            Password
                                        </label>

                                        <a
                                            href="/forgot-password"
                                            className="text-xs font-medium text-[#542cff] hover:text-[#3920d9]"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            required
                                            className="h-12 w-full rounded-xl border border-border bg-card px-4 pr-12 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-[#542cff] focus:ring-4 focus:ring-[#542cff]/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-secondary"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-danger text-center text-sm my-2">{error}</p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#542cff] text-sm font-semibold text-white shadow-lg shadow-[#542cff]/20 transition hover:bg-[#4520e6] hover:shadow-[#542cff]/30 active:scale-[0.99]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader />
                                            <span>Signing...</span>
                                        </>
                                    ) : "Sign In"}

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                            </form>

                            <div className="flex justify-center px-6 py-6 sm:px-10">
                                <p className="text-sm text-text-secondary">
                                    New to Engino?{" "}
                                    <a
                                        href="/register"
                                        className="font-medium text-[#4c2cff] transition hover:text-[#3920d9]"
                                    >
                                        Create an account
                                    </a>
                                </p>
                            </div>

                            {/* Terms */}
                            <p className="mt-6 text-center text-xs leading-5 text-text-muted">
                                By signing in, you agree to our{" "}
                                <a
                                    href="#"
                                    className="text-[#542cff] underline underline-offset-2"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="text-[#542cff] underline underline-offset-2"
                                >
                                    Privacy Policy
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Benefit = ({ icon, title, description }) => {
    return (
        <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card/10 text-white ring-1 ring-white/10">
                {icon}
            </div>

            <div>
                <h3 className="text-sm font-semibold text-white">
                    {title}
                </h3>

                <p className="mt-1 max-w-xs text-sm leading-5 text-purple-100/75">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default Login;
