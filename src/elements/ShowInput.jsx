import React from 'react'

const ShowInput = ({addNote,noteText,setNoteTime,setNoteText,noteVideo,setNoteVideo,noteTime}) => {
    return (
        <div className="mb-6 p-4 bg-[#2a2f45] rounded-xl shadow flex flex-col gap-3">
            <textarea
                className="p-3 rounded-lg bg-[#1b1f2f] text-gray-100 focus:outline-none"
                rows={3}
                placeholder="Write your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
            />
            <input
                type="text"
                className="p-3 rounded-lg bg-[#1b1f2f] text-gray-100 focus:outline-none"
                placeholder="Paste YouTube link (optional)"
                value={noteVideo}
                onChange={(e) => setNoteVideo(e.target.value)}
            />
            <input
                type="number"
                className="p-3 rounded-lg bg-[#1b1f2f] text-gray-100 focus:outline-none"
                placeholder="Set time in minutes (optional)"
                value={noteTime}
                onChange={(e) => setNoteTime(e.target.value)}
            />
            <button
                onClick={addNote}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg self-end"
            >
                Add
            </button>
        </div>
    )
}

export default ShowInput