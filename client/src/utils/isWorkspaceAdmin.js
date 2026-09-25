import useWorkspaceStore from "../stores/workspaceStore";

export const isWorkspaceAdmin = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { workspaces, currentWorkspaceId } = useWorkspaceStore();
    const selectedWorkspace = workspaces.find(workspace =>  workspace._id === currentWorkspaceId);

    return selectedWorkspace?.role === "Admin";
}