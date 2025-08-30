import axios from "axios";

const baseUrl = "http://localhost:4000/api/v1";


const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, 
});

export const getProfile = async () => {
  const response = await api.get("/users/my-profile");
  return response;
};

export const updateProfile = async (data: any) => {
  const response = await api.put("/users/my-profile", data);
  return response;
};

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.put("/users/my-profile/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const updateCover = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.put("/users/my-profile/cover", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

// export const deleteProfile = async () => {