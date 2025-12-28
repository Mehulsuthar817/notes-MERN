import { createContext,useContext, useEffect, useState } from "react";
import { addNote } from "../api/notesAPI";
const NotesContext = createContext();

export function NotesProvider({children}){
    const [ notes,setNotes]= useState(()=> {
        const savedNotes=localStorage.getItem("notes");
        return savedNotes?JSON.parse(savedNotes):[];
    });

    useEffect(()=> {
        localStorage.setItem("notes",JSON.stringify(notes));
    },[notes]);


function addNote(note){
    setNotes(prev=> [...prev,note])
}

function deleteNote(id){
    setNotes(prev=> prev.filter(n=> n.id !== id));
}
function editNotes(id,newContent){
    setNotes(prev=>
        prev.map(n=> 
            n.id==id
            ?{...n,content:newContent,updatedAt: Date.now()}:
            n
        )
    );
}

return(
    <NotesContext.Provider value={{notes,addNote,deleteNote,editNotes}} >
        {children}
    </NotesContext.Provider>
)

}

export function useNotes(){
    return useContext(NotesContext);
}

