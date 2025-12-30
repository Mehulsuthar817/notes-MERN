import api from "./axios";

const API = "http://localhost:5000";


export const getNotes = () => api.get(`${API}/notes`).then(res => ({ ...res, data: res.data.map(n => ({ ...n, id: n._id })) }));
export const addNote = (content) => api.post(`${API}/notes`, { content });
export const updateNote = (id,content)=>api.put(`${API}/notes/${id}`,{content});
export const deleteNote = (id)=>api.delete(`${API}/notes/${id}`);