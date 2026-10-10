import { useState, useEffect, useRef } from "react";
import {
    X,
    UserRound,
    LockKeyhole,
    Mail,
    Camera,
    Upload,
    Trash2,
    ShieldCheck,
    LoaderCircle,
    EyeOff,
    Eye,
} from "lucide-react";
import Avatar from "../../utils/Avatar";

function AccountModal({
    isOpen,
    onClose,
    user,
    onSaveProfile,
    onChangePhoto,
    onRemovePhoto,
    onChangePassword,
    savingProfile = false,
    savingPassword = false,
    uploadingPhoto = false,
    photoUploadError = "",
    profileSaveError = "",
    passwordError = "",
}) {
    const [activeTab, setActiveTab] = useState("profile");
    const [name, setName] = useState(user?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(user?.name || "");
            setActiveTab("profile");
        }
    }, [isOpen, user?.name]);

    if(!isOpen) return null;

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        onSaveProfile?.(name.trim());
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            return;
        }

        const success = await onChangePassword?.({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        if (success) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    const handlePhotoSelection = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp", 
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG and WEBP images are allowed.");
            event.target.value = "";
            return;
        }

        if(file.size > 2 * 1024 * 1024) {
            alert("Image size must not exceed 2 MB.");
            event.target.value = "";
            return;
        }

        onChangePhoto?.(file);
        event.target.value = "";
    };

    const inputClass =
        "h-11 w-full rounded-lg border border-border bg-white px-3.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10";

    const labelClass =
        "mb-2 block text-sm font-medium text-text-primary";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
        <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
        >
            {/* Header */}
            <header className="flex items-start justify-between border-b border-border px-6 py-5 sm:px-8">
            <div>
                <h2
                id="account-modal-title"
                className="text-xl font-bold text-text-primary"
                >
                Account
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                Manage your personal information and security settings.
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close account settings"
                className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
            >
                <X size={20} />
            </button>
            </header>

            {/* Modal body */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:flex-row">
            {/* Left navigation */}
            <nav
                aria-label="Account settings"
                className="shrink-0 border-b border-border p-3 sm:w-56 sm:border-b-0 sm:border-r sm:p-4"
            >
                <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    activeTab === "profile"
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
                >
                <UserRound size={19} />

                <span>
                    <span className="block text-sm font-semibold">
                    Profile
                    </span>
                    <span className="mt-0.5 block text-xs opacity-80">
                    Personal information
                    </span>
                </span>
                </button>

                <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    activeTab === "security"
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
                >
                <LockKeyhole size={19} />

                <span>
                    <span className="block text-sm font-semibold">
                    Security
                    </span>
                    <span className="mt-0.5 block text-xs opacity-80">
                    Password and account
                    </span>
                </span>
                </button>
            </nav>

            {/* Right content */}
            <div className="min-w-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                {activeTab === "profile" ? (
                <form
                    id="account-profile-form"
                    onSubmit={handleProfileSubmit}
                    className="space-y-6"
                >
                    <div className="border-b border-border pb-5">
                    <h3 className="text-base font-semibold text-text-primary">
                        Profile Information
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                        Update your personal details and profile picture.
                    </p>
                    </div>

                    {/* Avatar */}
                    <div className="flex flex-wrap items-center gap-5">
                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Avatar user={user} />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Choose profile photo"
                            disabled={uploadingPhoto}
                            className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-primary shadow-md transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
                            >
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="min-w-0">
                        <h4 className="text-base font-semibold text-text-primary">
                        {user?.name || "Your name"}
                        </h4>

                        <span className="mt-2 inline-flex rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                        {user?.role || "Member"}
                        </span>

                        <p className="mt-2 text-xs text-text-secondary">
                        JPG, PNG or WEBP. Maximum size 2 MB.
                        </p>

                        {uploadingPhoto && (
                            <p className="mt-2 flex items-center gap-2 text-sm text-primary">
                                <LoaderCircle size={15} className="animate-spin" />
                                processing ...
                            </p>
                            )}

                            {photoUploadError && (
                            <p className="mt-2 text-sm text-red-600" role="alert">
                                {photoUploadError}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={uploadingPhoto}
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-primary/40 px-3 text-xs font-semibold text-primary transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Upload size={14} />
                            Change Photo
                        </button>

                        <button
                            type="button"
                            onClick={() => onRemovePhoto?.()}
                            disabled={uploadingPhoto}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                            <Trash2 size={14} />
                            Remove
                        </button>
                        </div>

                        <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoSelection}
                        className="hidden"
                        />
                    </div>
                    </div>

                    {/* Full name */}
                    <div>
                    <label
                        htmlFor="account-full-name"
                        className={labelClass}
                    >
                        Full Name
                    </label>

                    <div className="relative">
                        <UserRound
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                        />

                        <input
                        id="account-full-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your full name"
                        maxLength={80}
                        required
                        className={`${inputClass} pl-10`}
                        />
                    </div>

                    <p className="mt-2 text-xs text-text-secondary">
                        This is how your name will appear to other workspace members.
                    </p>
                    </div>

                    {/* Email */}
                    <div>
                    <label
                        htmlFor="account-email"
                        className={labelClass}
                    >
                        Email Address
                    </label>

                    <div className="relative">
                        <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                        />

                        <input
                        id="account-email"
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className={`${inputClass} cursor-not-allowed bg-surface pl-10 text-text-secondary`}
                        />
                    </div>

                    <p className="mt-2 text-xs text-text-secondary">
                        Your email address cannot be changed here.
                    </p>
                    </div>
                </form>
                ) : (
                <form
                    id="account-security-form"
                    onSubmit={handlePasswordSubmit}
                    className="space-y-5"
                >
                    <div className="border-b border-border pb-5">
                    <h3 className="text-base font-semibold text-text-primary">
                        Security
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                        Keep your account secure by updating your password.
                    </p>
                    </div>

                    <div className="flex gap-3 rounded-lg border border-primary/15 bg-primary-light/50 p-4">
                    <ShieldCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-primary"
                    />

                    <p className="text-sm leading-6 text-text-secondary">
                        Choose a strong password that you don't use for other accounts.
                    </p>
                    </div>

                    <div>
                    <label htmlFor="current-password" className={labelClass}>
                        Current Password
                    </label>

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                                }
                            value={currentPassword}
                            onChange={(event) =>
                                setCurrentPassword(event.target.value)
                            }
                            placeholder="Enter current password"
                            autoComplete="current-password"
                            required
                            className={inputClass}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                        >
                            {showPassword ? (
                                <EyeOff size={19} />
                            ) : (
                                <Eye size={19} />
                            )}
                        </button>
                    </div>
                    </div>

                    <div>
                    <label htmlFor="new-password" className={labelClass}>
                        New Password
                    </label>

                    <div className="relative">
                        <input
                            id="new-password"
                            type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                    }
                            autoComplete="new-password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                            required
                            className={inputClass}
                        />
                        <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                            >
                                {showPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">
                        Use at least 6 characters.
                    </p>
                    </div>

                    <div>
                    <label htmlFor="confirm-password" className={labelClass}>
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                    }
                            autoComplete="new-password"
                            value={confirmPassword}
                            placeholder="Confirm new password"
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            required
                            className={inputClass}
                        />
                        <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                            >
                                {showPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                        </button>
                    </div>
                    </div>
                </form>
                )}
            </div>
            </div>

            {/* Footer */}

            {profileSaveError && (
                <p className="text-sm text-red-600 text-center" role="alert">
                    {profileSaveError}
                </p>
            )}

            {passwordError && (
                <p className="text-sm text-red-600 text-center" role="alert">
                    {passwordError}
                </p>
            )}

            <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4 sm:px-8">
            <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-border px-5 text-sm font-medium text-text-secondary transition hover:bg-surface"
            >
                Cancel
            </button>

            <button
                type="submit"
                form={
                activeTab === "profile"
                    ? "account-profile-form"
                    : "account-security-form"
                }
                disabled={savingProfile || savingPassword}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {savingProfile || savingPassword ? (
                <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Saving...
                </>
                ) : activeTab === "profile" ? (
                "Save Changes"
                ) : (
                "Update Password"
                )}
            </button>
            </footer>
        </section>
        </div>
    );
}

export default AccountModal;