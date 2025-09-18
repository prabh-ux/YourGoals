import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

function Home() {

    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem("userGoals");
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const updateGoal = async (goal) => {
        try {

            const url = `${backendUrl}/update`;

            const res = await axios.patch(url, { ...goal });

            if (res.status === 200) {
                console.log("success");
            }

        } catch (error) {
            console.error("an error occured while updating goal ", error);
        }

    }


    const fetchGoals = async () => {
        try {
            const token = localStorage.getItem("token")
            const url = `${backendUrl}/fetch`;

            const res =await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });


            if (res.status === 200) {
                console.log("success");
                setGoals(res.data.goals)
            }

        } catch (error) {
            console.error("an error occured while updating goal ", error);
        }
    }

    const submit = async (Goals) => {

        try {

            const url = `${backendUrl}/save`;

            const res = await axios.post(url, { ...Goals });

            if (res.status === 200) {
                console.log("success");
            }

        } catch (error) {
            console.error("an error occured while saving goal ", error);
        }


    }

    useEffect(() => {


        fetchGoals();

    }, []);

    const createGoal = () => {
        const name = prompt("🎯 Enter your goal name:");
        if (!name) return;
        const achieve = prompt("📝 What do you want to achieve?");

        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const newGoal = {
            email: decode.email,
            id: Date.now(),
            name,
            achieve,
            bookmarked: false,
            notes: [],
            streaks: {
                current: 1,
                best: 0,
                lastDate: null
            }
        };

        setGoals([...goals, newGoal]);
        submit(newGoal);
        navigate(`/notes/${newGoal.id}`);
    };

    const deleteGoal = async (id) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            setGoals(goals.filter((g) => g.id !== id));
        }
        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const email = decode.email;
        try {

            const url = `${backendUrl}/delete`;

            const res =await axios.delete(url, { data:{id, email} });

            if (res.status === 200) {
                console.log("success");
            }

        } catch (error) {
            console.error("an error occured while updating goal ", error);
        }

    };

    const toggleBookmark = (id) => {
        
          const UpdatedGoals=  goals.map((g) =>
                g.id === id ? { ...g, bookmarked: !g.bookmarked } : g
            ).sort((a, b) => b.bookmarked - a.bookmarked)
    
            setGoals(UpdatedGoals);
        

            const updatedGoal=UpdatedGoals.find((g)=>
            g.id===id);
            updateGoal(updatedGoal);

    };

    const formatDate = (date) => {
        const newDate = new Date(date).toLocaleDateString("en-GB", {

            day: "numeric",
            month: "short",
            year: "numeric"
        })
        return newDate;
    }

    const setStreak = (goal) => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let { current, best, lastDate } = goal.streaks;


        if (!lastDate) {
            current = 1;
            best = 1;

        }
        else {

            const prev = new Date(lastDate);
            prev.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((today - prev) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                current += 1;

            } else if (diffDays > 1) {
                current = 0;
            }

            best = Math.max(best, current);



        }

        const updatedGoal = {
            ...goal, streaks: {
                current: current,
                best: best,
                lastDate: today.toISOString()
            }
        }


        setGoals(goals.map(g =>
            g.id === goal.id ? updatedGoal : g

        ))
        updateGoal(updatedGoal);


    }





    return (
        <div className="p-6 max-w-6xl mx-auto text-gray-100">


            {/* Create Goal Button */}
            <button
                onClick={createGoal}
                className="mb-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
            >
                + Create New Goal
            </button>

            {/* Show Goals */}
            {goals.length === 0 ? (
                <p className="text-gray-400">No goals yet. Start by creating one!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="p-6 rounded-2xl bg-gradient-to-br from-[#2a2f45] to-[#1b1f2f] border border-gray-700 shadow-xl hover:shadow-2xl transition cursor-pointer relative"

                            onClick={() => {
                                setStreak(goal);
                                navigate(`/notes/${goal.id}`)
                            }}
                        >
                            {/* Bookmark */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmark(goal.id);
                                }}
                                className="absolute top-3 right-3 text-xl"
                            >
                                {goal.bookmarked ? "⭐" : "☆"}
                            </button>

                            <h2 className="text-2xl font-bold mb-2 text-white">
                                {goal.name}
                            </h2>
                            <p className="text-gray-300 mb-4">{goal.achieve}</p>

                            {goal.notes && goal.notes.length > 0 ? (
                                <p className="text-sm text-green-400">
                                    {goal.notes.length} notes created
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No notes yet. Click to create!
                                </p>
                            )}

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteGoal(goal.id);
                                }}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                            >
                                🗑 Delete
                            </button>

                            {/* show streak */}
                            <button

                                className="absolute bottom-3 right-3 text-xl"
                            >
                                {goal.streaks.current}
                            </button>



                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;