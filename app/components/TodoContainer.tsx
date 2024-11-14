"use client";

import { useState, useEffect } from "react";
import Task from "./Task";
import { log } from "console";

type TaskType = {
   task: string;
   state: string;
};

const TodoContainer: React.FC = () => {
   const [tasks, setTasks] = useState<TaskType[]>([]);
   const [newTask, setNewTask] = useState<string>("");

   // Use Effect Per Local Storage (Interazione esterna)
   useEffect(() => {
      if (typeof window !== "undefined") {
         const storedTasks = localStorage.getItem("tasks");
         if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
         }
      }
   }, []);

   // Con [tasks] come secondo argomento, useEffect si attiva ogni volta che tasks cambia
   useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
   }, [tasks]);

   const addTask = () => {
      if (newTask.trim() !== "") {
         setTasks([...tasks, { task: newTask, state: "incompleto" }]);
         setNewTask("");
      }
   };

   const toggleTaskState = (index: number) => {
      const updatedTasks = tasks.map((task, i) =>
         i === index
            ? {
                 ...task,
                 state: task.state === "completo" ? "incompleto" : "completo",
              }
            : task
      );
      setTasks(updatedTasks);
   };

   const deleteTask = (index: number) => {
      const updatedTasks = tasks.filter((task, i) => i !== index);
      setTasks(updatedTasks);
   };

   const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         handleGeminiRequest();
      }
   };

   /**
    * Handle Gemini Api
    */
   const [prompt, setPrompt] = useState("");

   const handleGeminiRequest = async () => {
      try {
         const response = await fetch("/api/gemini", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, todos: tasks }),
         });

         const data = await response.json();
         console.log("Risposta da Gemini:", data);

         /**
          * Handle Gemini Response
          */

         const content = JSON.parse(data.candidates[0].content.parts[0].text);

         const { operation, todo, state, id } = content[0];

         console.log("Operation:", operation);
         console.log("Todo:", todo);
         console.log("Id:", id);

         switch (operation) {
            case "add":
               setTasks([...tasks, { task: todo, state: "incompleto" }]);
               break;
            case "update":
               setTasks(
                  tasks.map((t, index) =>
                     index === parseInt(id)
                        ? { ...t, task: todo, state: state }
                        : t
                  )
               );
               break;
            case "delete":
               deleteTask(parseInt(id));
               break;
         }
      } catch (error) {
         console.error("Errore:", error);
      }
   };

   return (
      <div className="container mx-auto flex">
         <div className="container w-1/2 mt-5 bg-fuchsia-200 min-h-96 rounded-xl mx-6 p-5">
            {/* Ciclo in React */}
            {tasks.map((task, index) => (
               <Task key={index} task={task} />
            ))}
         </div>
         <div className="flex justify-center w-1/2 ">
            <div className="w-full">
               <div className="flex items-center border-b-2 border-teal-500 py-2">
                  <input
                     className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                     type="text"
                     placeholder="Add Todo"
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     onKeyUp={handleKeyUp}
                  />
                  <button
                     className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                     type="button"
                     onClick={handleGeminiRequest}
                  >
                     Invia
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TodoContainer;
