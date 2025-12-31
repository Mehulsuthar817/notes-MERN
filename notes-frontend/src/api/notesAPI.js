import api from "./axios";

export const getNotes = () =>
  api.get("/notes").then(res => ({
    ...res,
    data: res.data.map(n => ({ ...n, id: n._id })),
  }));

export const addNote = (content) =>
  api.post("/notes", { content });

export const updateNote = (id, content) =>
  api.put(`/notes/${id}`, { content });

export const deleteNote = (id) =>
  api.delete(`/notes/${id}`);
