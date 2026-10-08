import api from "../lib/api";

export const updateWorkspaceMemberRole = async (
  workspaceId,
  userId,
  role
) => {
  const response = await api.patch(
    `/workspaces/${workspaceId}/team/${userId}/role`,
    { role }
  );

  return response.data;
};

export const removeWorkspaceMember = async (
  workspaceId,
  userId
) => {
  const response = await api.delete(
    `/workspaces/${workspaceId}/team/${userId}`
  );

  return response.data;
};