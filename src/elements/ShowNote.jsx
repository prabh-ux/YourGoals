import React from 'react'

const ShowNote = ({notes,getEmbedUrl,formatTime,pauseTimer,startTimer,resetTimer,deleteNote}) => {
    
    return (
        <ul className="space-y-6">
            {notes.map((note) => (
              
                <li
                    key={note.id}
                    className="p-5 bg-[#2a2f45] rounded-2xl shadow hover:shadow-2xl transition"
                >

                    <div className='w-full flex justify-between items-center'> 
                        <p className="text-gray-100 mb-3">{note.text}</p>
                         {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNote(note.id);
                                }}
                                className="mb-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                            >
                                🗑 
                            </button>
                    </div>
                    
                    {note.video && getEmbedUrl(note.video) && (
                        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg mb-3">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={getEmbedUrl(note.video)}
                                title="YouTube video"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {note.time > 0 && (
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-gray-200 font-mono">
                                {formatTime(note.remaining)}
                            </span>
                            {note.isRunning ? (
                                <button
                                    onClick={() => pauseTimer(note.id)}
                                    className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
                                >
                                    ⏸ Pause
                                </button>
                            ) : (
                                <button
                                    onClick={() => startTimer(note.id)}
                                    className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                                >
                                    ▶ Start
                                </button>
                            )}
                            <button
                                onClick={() => resetTimer(note.id)}
                                className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                            >
                                🔄 Reset
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default ShowNote