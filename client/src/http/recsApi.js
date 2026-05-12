import { $authHost } from "./index";

export const getRecsPlaylists = async () => {
  const { data } = await $authHost.get(`/api/recs`);
  return data;
};

export const getRecsPlaylistById = async (id) => {
  const { data } = await $authHost.get(`/api/recs/${id}`);
  return data;
};

export const updateRecsPlaylists = async (top_k = 100) => {
  const { data } = await $authHost.post(`/api/recs/update`, { top_k });
  return data;
};