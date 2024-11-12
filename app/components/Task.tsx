"use client";

type TaskProps = {
   task: {
      task: string;
      state: string;
   };
   toggleTaskState: () => void;
   deleteTask: () => void;
};

// Si puo' passare una funzione come prop per aggiornare lo stato del componente padre
const Task: React.FC<TaskProps> = ({ task, toggleTaskState, deleteTask }) => {
   return (
      <div className={`list-item`}>
         {/* If in react */}
         {task.state === "completo" ? (
            <span className="line-through">
               {task.task}{" "}
               <button
                  className="ml-4 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded px-2"
                  type="button"
                  onClick={toggleTaskState}
               >
                  X
               </button>
            </span>
         ) : (
            <span>
               {task.task}
               <button
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded px-2"
                  type="button"
                  onClick={toggleTaskState}
               >
                  X
               </button>
            </span>
         )}
         <span>
         <button
             className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded px-2"
             type="button"
             onClick={deleteTask}>
               Delete
         </button>
         </span>
      </div>
   );
};

export default Task;
