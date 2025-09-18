import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ShowInput from "../elements/ShowInput";
import ShowNote from "../elements/ShowNote";
import axios from "axios";

function Notes() {
    const { goalId } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [goal, setGoal] = useState(null);
    const [notes, setNotes] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [noteVideo, setNoteVideo] = useState("");
    const [noteTime, setNoteTime] = useState(""); // in minutes
    const timersRef = useRef({});

  const fetchGoals = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backendUrl}/fetch`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.goals;
    } catch (error) {
        console.error("Error fetching goals", error);
        return [];
    }
};

const updateGoalBackend = async (updatedGoal) => {
    try {
        await axios.patch(`${backendUrl}/update`, updatedGoal);
    } catch (error) {
        console.error("Error updating goal on backend", error);
    }
};


    useEffect(() => {
        const loadGoal = async () => {
            const savedGoals = await fetchGoals();
            const currentGoal = savedGoals.find((g) => g.id === parseInt(goalId));
            if (!currentGoal) {
                navigate("/"); // redirect if goal not found
                return;
            }
            setGoal(currentGoal);
            setNotes(currentGoal.notes || []);
        };
        loadGoal();
    }, [goalId, navigate]);

    // Save notes whenever they change (local + backend)
   useEffect(() => {
    if (!goal) return;
    const updatedGoal = { ...goal, notes };
    setGoal(updatedGoal); 
    updateGoalBackend(updatedGoal);
}, [notes]);


    const addNote = () => {
        if (!noteText.trim() && !noteVideo.trim()) return;
        const newNote = {
            id: Date.now(),
            text: noteText,
            video: noteVideo.trim(),
            time: noteTime ? parseInt(noteTime) * 60 : 0,
            remaining: noteTime ? parseInt(noteTime) * 60 : 0,
            isRunning: false,
        };
        setNotes([newNote, ...notes]);
        setNoteText("");
        setNoteVideo("");
        setNoteTime("");
        setShowInput(false);
    };

    const deleteNote = (id) => {
        setNotes(notes.filter((note) => note.id !== id));
    };

    const startTimer = (id) => {
        setNotes((prev) =>
            prev.map((note) => {
                if (note.id === id && note.remaining > 0 && !note.isRunning) {
                    note.isRunning = true;
                    timersRef.current[id] = setInterval(() => {
                        setNotes((prevNotes) =>
                            prevNotes.map((n) =>
                                n.id === id
                                    ? {
                                          ...n,
                                          remaining: n.remaining > 0 ? n.remaining - 1 : 0,
                                          isRunning: n.remaining > 1,
                                      }
                                    : n
                            )
                        );
                    }, 1000);
                }
                return { ...note };
            })
        );
    };

    const pauseTimer = (id) => {
        clearInterval(timersRef.current[id]);
        setNotes((prev) =>
            prev.map((note) => (note.id === id ? { ...note, isRunning: false } : note))
        );
    };

    const resetTimer = (id) => {
        clearInterval(timersRef.current[id]);
        setNotes((prev) =>
            prev.map((note) =>
                note.id === id
                    ? { ...note, remaining: note.time, isRunning: false }
                    : note
            )
        );
    };

    const getEmbedUrl = (url) => {
        if (!url) return "";
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes("youtube.com")) {
                const videoId = parsedUrl.searchParams.get("v");
                return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
            }
            if (parsedUrl.hostname === "youtu.be") {
                const videoId = parsedUrl.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }
            return "";
        } catch {
            return "";
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {goal && (
                <>
                    <h1 className="text-4xl font-bold mb-6 text-white">
                        {goal.name.toUpperCase()} 📝
                    </h1>
                    <p className="text-gray-300 mb-6">{goal.achieve.toUpperCase()}</p>

                    <button
                        onClick={() => setShowInput(!showInput)}
                        className="mb-6 relative inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-lg hover:scale-105 transition-transform duration-200 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-white opacity-10 rounded-xl blur-xl animate-pulse"></span>
                        <span className="relative z-10">+ Add Note</span>
                    </button>

                    {showInput && (
                        <ShowInput
                            addNote={addNote}
                            noteText={noteText}
                            setNoteText={setNoteText}
                            noteVideo={noteVideo}
                            setNoteVideo={setNoteVideo}
                            noteTime={noteTime}
                            setNoteTime={setNoteTime}
                        />
                    )}

                    {notes.length === 0 ? (
                        <p className="text-gray-400">No notes yet. Start by adding one!</p>
                    ) : (
                        <ShowNote
                            notes={notes}
                            deleteNote={deleteNote}
                            getEmbedUrl={getEmbedUrl}
                            formatTime={formatTime}
                            startTimer={startTimer}
                            pauseTimer={pauseTimer}
                            resetTimer={resetTimer}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Notes;
