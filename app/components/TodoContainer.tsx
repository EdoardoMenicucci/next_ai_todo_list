"use client";

import { useState, useEffect } from "react";
import Task from "./Task";

type TaskType = {
   task: string;
   state: string;
};

const TodoContainer: React.FC = () => {

   const [tasks, setTasks] = useState<TaskType[]>([
   ]);
   const [newTask, setNewTask] = useState<string>("");

   // Use Effect Per Local Storage (Interazione esterna)
   useEffect(() => {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
         setTasks(JSON.parse(storedTasks));
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


   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         addTask();
      }
   };


   return (
      <div className="container mx-auto">
         <div className="flex justify-center">
            <div className="w-1/2">
               <div className="flex items-center border-b-2 border-teal-500 py-2">
                  <input
                     className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                     type="text"
                     placeholder="Add Todo"
                     value={newTask}
                     onChange={(e) => setNewTask(e.target.value)}
                     onKeyUp={handleKeyPress}
                  />
                  <button
                     className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                     type="button"
                     onClick={addTask}
                  >
                     Add
                  </button>
               </div>
            </div>
         </div>
         <div className='container mx-auto w-1/2 mt-5'>
         {/* Ciclo in React */}
         {tasks.map((task, index) => (
            <Task
               key={index}
               task={task}
               toggleTaskState={() => toggleTaskState(index)}
               deleteTask={() => deleteTask(index)}
            />
         ))}
         </div>
      </div>
   );
};

export default TodoContainer;
