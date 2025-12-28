import { useEffect, useState } from "react";
import { addNote, deleteNote, getNotes, updateNote } from "../api/notesAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg for notes.png";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [editingID, setEditingID] = useState(null);
  const [editText, setEditText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const lightColors = [
    'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-pink-300', 'bg-purple-300',
    'bg-indigo-300', 'bg-red-300', 'bg-teal-300', 'bg-orange-300', 'bg-cyan-300'
  ];

  const getRandomLightColor = (id) => {
    const hash = id.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return lightColors[Math.abs(hash) % lightColors.length];
  };



  useEffect(() => {
    getNotes().then((res) => setNotes(res.data));
  }, []);

  const filteredNotes = notes.filter((n) =>
    search.trim() === ""
      ? true
      : n.content.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  const handleAdd = async (content) => {
    if (!content.trim()) return;
    const res = await addNote(content);
    setNotes((prev) => [res.data, ...prev]);
    setText("");
  };

  const handleUpdate = async (id, content) => {
    await updateNote(id, content);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };


  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const openModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };


  return (
    <div
      className="notes-container min-h-screen p-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">My Notes</h1>
          <button
            onClick={handleLogout}
            className="glass-btn px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Logout
          </button>
        </div>

<div className="bg-white p-6 rounded-2xl shadow-2xl mb-8 space-y-4">

  {/* ADD NOTE SECTION */}
  <div className="flex gap-4 items-end">

    {/* FLOATING INPUT */}
    <div className="relative flex-1">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder=" "
        className="
          peer w-full px-4 pt-5 pb-2
          text-gray-800 bg-gray-100
          rounded-xl

          border-2 border-gray-300
          focus:border-blue-500
          focus:ring-4 focus:ring-blue-500/30
          focus:outline-none

          transition-all duration-300
        "
      />

      <label
        className="
          absolute left-4 top-3
          text-gray-500 text-sm pointer-events-none

          transition-all duration-300
          peer-placeholder-shown:top-4
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400

          peer-focus:top-1
          peer-focus:text-xs
          peer-focus:text-blue-500
        "
      >
        Write a new note
      </label>
    </div>

    {/* ADD BUTTON */}
    <button
      onClick={() => handleAdd(text)}
      className="
        px-6 py-3
        bg-blue-500 text-white font-semibold
        rounded-xl

        hover:bg-blue-600
        hover:scale-105
        active:scale-95

        focus:outline-none
        focus:ring-4 focus:ring-blue-500/40

        transition-all duration-300
      "
    >
      Add Note
    </button>
  </div>

  {/* SEARCH INPUT */}
  <div className="relative w-full">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder=" "
      className="
        peer w-full px-4 pt-5 pb-2
        text-gray-800 bg-gray-100
        rounded-xl

        border-2 border-gray-300
        focus:border-blue-500
        focus:ring-4 focus:ring-blue-500/30
        focus:outline-none

        transition-all duration-300
      "
    />

    <label
      className="
        absolute left-4 top-3
        text-gray-500 text-sm pointer-events-none

        transition-all duration-300
        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400

        peer-focus:top-1
        peer-focus:text-xs
        peer-focus:text-blue-500
      "
    >
      Search notes
    </label>
  </div>

</div>


        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((n) => (
            <div key={n.id} className={`${getRandomLightColor(n.id)} p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:scale-105 relative h-64 flex flex-col`}>
              <button
                onClick={() => handleDelete(n.id)}
                className="absolute top-2 right-2 text-white hover:text-red-300 text-2xl transition duration-200"
              >
                ×
              </button>
              {editingID === n.id ? (
                <div className="  space-y-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="  w-full input-field px-4 py-3 rounded-lg border border-gray-300 bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200 resize-none"
                    rows="4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await handleUpdate(n.id, editText);
                        setEditingID(null);
                        setEditText("");
                      }}
                      className="flex-1 glass-btn px-4 py-2 bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingID(null)}
                      className="flex-1 glass-btn px-4 py-2 bg-gray-500 bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex-1 flex flex-col">
                  <p className="text-white text-lg leading-relaxed">{truncateText(n.content)}</p>
                  {n.content.length > 100 && (
                    <button
                      onClick={() => openModal(n)}
                      className="text-white underline hover:text-gray-200 transition duration-200"
                    >
                      Read More
                    </button>
                  )}
                  <div className="mt-auto flex justify-start">
                    <button
                      onClick={() => {
                        setEditingID(n.id);
                        setEditText(n.content);
                      }}
                      className="px-3 py-1 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {isModalOpen && selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Note Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{selectedNote.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
