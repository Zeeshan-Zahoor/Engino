import { LogOut, UserPlus, X } from "lucide-react";
import { sidebarNavigation } from "../../config/navigation";
import { NavLink } from "react-router-dom";
import LogoutConfirmModal from "../common/LogoutConfirmationModal";
import { useState } from "react";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import WorkspaceSwitcher from "../common/WorkspaceSwitcher";
import useWorkspaceStore from "../../stores/workspaceStore";
import useToastStore from "../../stores/toastStore";

import InvitationModal from "../common/InvitationModal";
import AccountModal from "../common/AccountModal";
import Avatar from "../../utils/Avatar";
import api from "../../lib/api";

function Sidebar({ isOpen = false, onClose }) {
  const { user, logout, updateUser } = useAuthStore();
  const { workspaces, currentWorkspaceId } = useWorkspaceStore();
  const { showToast } =  useToastStore();
  const navigate = useNavigate();

  const selectedWorkspace = workspaces.find((workspace) => 
    workspace._id === currentWorkspaceId
  );

  const role = selectedWorkspace?.role || "Member"
  const isAdmin = selectedWorkspace?.role === "Admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSaveProfile = async (name) => {
    setProfileSaveError("");

    if (isSavingProfile) return;
    setIsSavingProfile(true);

    try {
      const response = await api.patch("/auth/profile", { name });

      if (response.data.success) {
        updateUser({
          name: response.data.user.name,
        });

        setIsAccountModalOpen(false);
        showToast("Profile Updated Successfully!", "success");
      } else {
        setProfileSaveError(
          response.data.message || "Failed to update profile."
        );
      }
    } catch (error) {
      console.error("Profile update failed:", error);

      setProfileSaveError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  const handleLogout = async () => {
    setError("");
    setLoading(true);
    try {
      await logout();
      setIsModalOpen(false);
      navigate('/login');

    } catch (error) {
      setError(error.response?.data?.message || "Failed to log out. Try Again.");
    } finally {
      setLoading(false);
    }
  }

  const handleChangePhoto = async (file) => {
    setPhotoUploadError("");

    if(isUploadingPhoto) return;

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await api.patch(
       "/auth/profile/photo",
       formData 
      );

      if(response.data.success) {
        updateUser({
          avatar: response.data.user.avatar,
        });
      } else {

        setPhotoUploadError(
          response.data.message || "Failed to upload photo."
        );
      }
    } catch (error) {
       
        setPhotoUploadError(
          error.response?.data?.message || 
          "Failed to upload profile photo. Please try again."
        );

        console.log(error.response)
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  const handleRemovePhoto = async () => {
    if (isUploadingPhoto) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile photo?"
    );

    if(!confirmed) return;

    setPhotoUploadError("")
    setIsUploadingPhoto(true);

    try {
      const response = await api.delete("/auth/profile/photo");

      if (response.data.success) {
        updateUser({
          avatar: response.data.user.avatar,
        });
      } else {
        setPhotoUploadError(
          response.data.message || "Failed to remove profile photo."
        );
      }
    } catch (error) {
      console.error("Remove profile photo failed:", error);

      setPhotoUploadError(
        error.response?.data?.message ||
          "Failed to remove profile photo. Please try again."
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  
const handleChangePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    setPasswordError("");

    if (isSavingPassword) return;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await api.patch("/auth/profile/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        setIsAccountModalOpen(false);
        showToast("Password Updated Successfully!", "success");

      } else {
        setPasswordError(
          response.data.message || "Failed to change password."
        );
      }
    } catch (error) {
      console.error("Password change failed:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };


  return (
    <aside
      id="authenticated-navigation"
      aria-label="Primary navigation"
      className={`fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh w-64 max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-sidebar transition-transform duration-200 ease-out lg:static lg:h-screen lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:transition-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6">
        <h1 className="text-xl font-bold text-primary">Engino</h1>

        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary lg:hidden"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Workspace Switcher*/}
      <WorkspaceSwitcher />

      {/* Invite button */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="mx-4 mb-5 w-[calc(100%-2rem)] flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white
                    shadow-sm transition-all
                    hover:opacity-90 hover:shadow-md
                    active:scale-[0.98]"
        >
          <UserPlus size={17} strokeWidth={2.2} />
          Invite Members
        </button>
      )}

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Workspace
        </p>

        <div className="space-y-1">
          {sidebarNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="flex justify-between items-center border-t border-border p-4">
        <button
          type="button"
          onClick={() => setIsAccountModalOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left transition hover:bg-surface"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            <Avatar user={user} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {user?.name}
            </p>
            <p className="text-xs text-text-secondary">
              {role}
            </p>
          </div>
        </button>

        <button
          role="button"
          onClick={() => setIsModalOpen(true)}
          className="text-primary cursor-pointer h-8 w-8 rounded-l hover:bg-surface flex justify-center items-center">
          <LogOut size={18} strokeWidth={2}  />
        </button>
      </div>

      <LogoutConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={loading}
        error={error}
      />

      <InvitationModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceId={currentWorkspaceId}
      />

      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
        onChangePhoto={handleChangePhoto}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        uploadingPhoto={isUploadingPhoto}
        photoUploadError={photoUploadError}
        profileSaveError={profileSaveError}
        onRemovePhoto={handleRemovePhoto}
        savingProfile={isSavingProfile}
        passwordError={passwordError}
        savingPassword={isSavingPassword}
      />
    </aside>
  );
}

export default Sidebar;
