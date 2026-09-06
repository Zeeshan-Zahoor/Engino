import api from "../lib/api";

export const sendInvitation = async (workspaceId, data) => {
    const response = await api.post(`/workspaces/${workspaceId}/invite`, data);
    return response.data;
}