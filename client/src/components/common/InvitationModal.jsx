import { UserPlus, X, Mail, Send } from "lucide-react"
import { useState } from "react";
import { createPortal } from "react-dom";
import { sendInvitation } from "../../services/invitationService";
import Loader from "./Loader";
import useToastStore from "../../stores/toastStore";
import Toast from './Toast';

function InvitationModal({ isOpen, onClose, workspaceId }) {
    const { showToast } = useToastStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        email: "",
        role: "Member",
    })
    
    const handleChange = (e) => {
        setError("");
        
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    
    
    
    const handleSendInvitation = async () => {
        setError("");
        setLoading(true);
        try {
            await sendInvitation(workspaceId, formData);
            onClose();
            showToast("Invitation sent successfully!", "success");
        } catch (error) {
            setError(error.response?.data.message || "Failed to send invitation. Try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-4 backdrop-blur-sm">
    <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-card shadow-2xl">

      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <UserPlus size={21} strokeWidth={2.2} />
            </div>

            <h2 className="text-xl font-bold text-text-primary">
              Invite members
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Add people to your workspace and start collaborating.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg
                       text-text-muted transition-colors
                       hover:bg-subtle-strong hover:text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 px-6 py-6">

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">
            Email address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="colleague@example.com"
            className="w-full rounded-xl border border-border bg-subtle
                       px-4 py-3 text-sm text-text-primary
                       outline-none transition
                       placeholder:text-text-muted
                       focus:border-primary focus:bg-card
                       focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">
            Workspace role
          </label>

          <select
            value={formData.role}
            name="role"
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-subtle
                       px-4 py-3 text-sm text-text-primary
                       outline-none transition
                       focus:border-primary focus:bg-card
                       focus:ring-4 focus:ring-primary/10"
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Info */}
        <div className="flex gap-3 rounded-xl bg-primary-light px-4 py-3.5">
          <Mail
            size={18}
            className="mt-0.5 shrink-0 text-primary"
          />

          <p className="text-sm leading-5 text-text-secondary">
            An invitation email will be sent with a secure link to join
            this workspace.
          </p>
        </div>

      </div>
    
     {error && (
        <p className="text-danger text-center text-sm mt-2">{error}</p>
     )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold
                     text-text-secondary transition-colors
                     hover:bg-subtle-strong"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSendInvitation}
          className="flex items-center gap-2 rounded-xl
                     bg-primary px-5 py-2.5
                     text-sm font-semibold text-white
                     shadow-sm transition-all
                     hover:opacity-90 hover:shadow-md
                     active:scale-[0.98]"
        >
          <Send size={16} />
          {loading 
            ? (
                <Loader />
            ) 
            : ("Send Invitation")}
        </button>
      </div>

    </div>

    <Toast />
  </div>,
        document.body,
    )
}

export default InvitationModal
