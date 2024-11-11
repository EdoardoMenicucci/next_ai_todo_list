"use client";

import { useState } from "react";
import Task from "./Task";

type TaskType = {
   task: string;
   state: string;
};

const TodoContainer: React.FC = () => {
   const [tasks, setTasks] = useState<TaskType[]>([
      { task: "Portare a spasso il cane", state: "incompleto" },
      { task: "Fare la spesa", state: "incompleto" },
      { task: "Studiare TypeScript", state: "completo" },
   ]);

   const [newTask, setNewTask] = useState<string>("");

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

   return (
      <div className="container mx-auto">
         <div className="flex justify-center">
            <div className="w-1/2">
               <div className="flex items-center border-b-2 border-teal-500 py-2">
                  <input
                     className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                     type="text"
                     placeholder="Add Todo"
                     onChange={(e) => setNewTask(e.target.value)}
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
         {/* Ciclo in React */}
         {tasks.map((task, index) => (
            <Task
               key={index}
               task={task}
               toggleTaskState={() => toggleTaskState(index)}
            />
         ))}
      </div>
   );
};

export default TodoContainer;
