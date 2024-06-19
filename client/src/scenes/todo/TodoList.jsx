// import React, { useState, useEffect } from "react";
// import "./todo.css";

// const Todoslist = ({
//   title,
//   isCompleted,
//   updateHandler,
//   deleteHandler,
//   id,
//   onEditTitle,
// }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [newTitle, setNewTitle] = useState(title);

//   useEffect(() => {
//     setNewTitle(title);
//   }, [title]);

//   const handleCompleteChange = () => {
//     updateHandler({ isCompleted: !isCompleted });
//   };

//   const handleTitleChange = (e) => {
//     setNewTitle(e.target.value);
//   };

//   const handleEdit = () => {
//     setEditMode(true);
//     onEditTitle(newTitle, id);
//   };

//   const handleUpdate = () => {
//     if (editMode) {
//       updateHandler({ title: newTitle });
//       setEditMode(false);
//     } else {
//       handleCompleteChange();
//     }
//   };

//   const handleDelete = () => {
//     deleteHandler(id);
//   };

//   return (
//     <li className="list-item">
//       <input
//         type="text"
//         value={newTitle}
//         className={`list ${isCompleted ? "complete" : ""}`}
//         readOnly={!editMode}
//         onChange={handleTitleChange}
//       />
//       <div>
//         {!isCompleted && (
//           <>
//             <button
//               className="button-complete task-button"
//               onClick={handleCompleteChange}
//             >
//               <i className="fa fa-check-circle"></i>
//             </button>
//             <button className="button-edit task-button" onClick={handleEdit}>
//               <i className="fa fa-edit"></i>
//             </button>
//           </>
//         )}
//         <button className="button-delete task-button" onClick={handleDelete}>
//           <i className="fa fa-trash"></i>
//         </button>
//       </div>
//     </li>
//   );
// };

// export default Todoslist;

import React, { useState, useEffect } from "react";
import "./todo.css";

const Todoslist = ({
  title,
  isCompleted,
  updateHandler,
  deleteHandler,
  completeHandler,
  id,
  onEditTitle,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleCompleteChange = () => {
    completeHandler(id, isCompleted);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleEdit = () => {
    setEditMode(true);
    onEditTitle(newTitle, id);
  };

  const handleUpdate = () => {
    if (editMode) {
      updateHandler({ title: newTitle });
      setEditMode(false);
    } else {
      handleCompleteChange();
    }
  };

  const handleDelete = () => {
    deleteHandler(id);
  };

  return (
    <li className="list-item">
      <input
        type="text"
        value={newTitle}
        className={`list ${isCompleted ? "complete" : ""}`}
        readOnly={!editMode}
        onChange={handleTitleChange}
      />
      <div>
        {!isCompleted && (
          <>
            <button
              className="button-complete task-button"
              onClick={handleCompleteChange}
            >
              <i className="fa fa-check-circle"></i>
            </button>
            <button className="button-edit task-button" onClick={handleEdit}>
              <i className="fa fa-edit"></i>
            </button>
          </>
        )}
        <button className="button-delete task-button" onClick={handleDelete}>
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default Todoslist;
