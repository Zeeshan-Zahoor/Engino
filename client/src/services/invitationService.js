import api from "../lib/api";

export const sendInvitation = async (workspaceId, data) => {
    const response = await api.post(`/workspaces/${workspaceId}/invite`, data);
    return response.data;
}

export const fetchInvitation = async (token) => {
    const response = await api.get(`/workspaces/invitations/${token}`);
    return response.data;
}

export const acceptInvitation = async (data) => {
    const response = await api.post('/workspaces/accept-invite', data);
    return response.data;
}

export const declineInvitation = async (token) => {
    const response = await api.post('/workspaces/decline-invite', {token});
    return response.data;
}