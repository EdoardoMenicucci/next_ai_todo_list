"use client";

type TaskProps = {
   task: {
      task: string;
      state: string;
   };
};

// Si puo' passare una funzione come prop per aggiornare lo stato del componente padre
const Task: React.FC<TaskProps> = ({ task }) => {
   return (
      <div className={`list-item m-3`}>
         {/* If in react */}
         {task.state === "done" ? (
            <span className="line-through">{task.task} </span>
         ) : (
            <span>{task.task}</span>
         )}
      </div>
   );
};

export default Task;
