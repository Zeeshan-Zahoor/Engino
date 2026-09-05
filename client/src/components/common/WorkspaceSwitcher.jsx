import { useState } from "react";
import {
    Check,
    ChevronDown,
} from "lucide-react";

function WorkspaceSwitcher() {
    const [isOpen, setIsOpen] = useState(false);

    const workspaces = [
        {
            id: "1",
            name: "Zeeshan's Workspace",
            meta: "7 projects · 5 members",
            initial: "Z",
            color: "bg-violet-600",
        },
        {
            id: "2",
            name: "Engineering Team",
            meta: "12 projects · 8 members",
            initial: "E",
            color: "bg-blue-500",
        },
        {
            id: "3",
            name: "Student Portal",
            meta: "4 projects · 3 members",
            initial: "S",
            color: "bg-emerald-500",
        },
    ];

    const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);

    const handleSelect = (workspace) => {
        setSelectedWorkspace(workspace);
        setIsOpen(false);
    };

    return (
        <div className="relative px-4 mb-6">
            {/* Current Workspace */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5
                    bg-violet-50 hover:bg-violet-100 transition-colors
                    text-left ${
                        isOpen ? "ring-1 ring-violet-200" : ""
                    }`}
            >
                <div
                    className={`h-9 w-9 shrink-0 rounded-full ${selectedWorkspace.color}
                    flex items-center justify-center text-white font-semibold text-sm`}
                >
                    {selectedWorkspace.initial}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                        {selectedWorkspace.name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                        Personal Workspace
                    </p>
                </div>

                <ChevronDown
                    size={17}
                    className={`shrink-0 text-slate-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute left-4 right-4 top-[calc(100%+6px)] z-50
                    rounded-xl border border-slate-200 bg-white shadow-xl
                    shadow-slate-200/50 overflow-hidden"
                >
                    <div className="px-4 py-3">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                            Workspaces
                        </p>
                    </div>

                    <div className="px-2 pb-2">
                        {workspaces.map((workspace) => {
                            const isSelected =
                                selectedWorkspace.id === workspace.id;

                            return (
                                <button
                                    key={workspace.id}
                                    type="button"
                                    onClick={() =>
                                        handleSelect(workspace)
                                    }
                                    className={`w-full flex items-center gap-3
                                        rounded-lg px-2.5 py-2.5 text-left
                                        transition-colors ${
                                            isSelected
                                                ? "bg-violet-50"
                                                : "hover:bg-slate-50"
                                        }`}
                                >
                                    <div
                                        className={`h-9 w-9 shrink-0 rounded-full
                                            ${workspace.color}
                                            flex items-center justify-center
                                            text-white font-semibold text-sm`}
                                    >
                                        {workspace.initial}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-800 truncate">
                                            {workspace.name}
                                        </p>

                                        <p className="text-xs text-slate-500 truncate">
                                            {workspace.meta}
                                        </p>
                                    </div>

                                    {isSelected && (
                                        <Check
                                            size={17}
                                            className="shrink-0 text-violet-600"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceSwitcher;