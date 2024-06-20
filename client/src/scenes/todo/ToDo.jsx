import React, { useEffect, useState } from "react";
import axios from "axios";
import "./todo.css";
import Todoslist from "./TodoList";
import Swal from "sweetalert2";
import { server } from "index";

const App = () => {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);

  const updateHandler = async (id, newData) => {
    const result = await Swal.fire({
      title: "Are you sure you want to update the task?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (!result.isConfirmed) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await axios.put(`${server}/todo/${id}`, newData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...newData } : task
        )
      );
      setEditTaskId(null);
      setTitle("");

      Swal.fire({
        icon: "success",
        title: "Task Updated!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(
        "Error updating task:",
        error.response?.data?.message || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete the task?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await axios.delete(`${server}/todo/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();

      Swal.fire({
        icon: "success",
        title: "Task Deleted!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(
        "Error deleting task:",
        error.response?.data?.message || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      if (!editTaskId) {
        const result = await Swal.fire({
          title: "Are you sure you want to add the task?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, add it!",
        });

        if (!result.isConfirmed) {
          return;
        }

        await axios.post(
          `${server}/todo`,
          { title },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTitle("");
        fetchTasks();

        Swal.fire({
          icon: "success",
          title: "Task Added!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await updateHandler(editTaskId, { title });
      }

      setEditTaskId(null);
    } catch (error) {
      console.log(
        "Error adding/updating task:",
        error.response?.data?.message || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const { data } = await axios.get(`${server}/todo`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(data.tasks);
    } catch (error) {
      console.log(
        "Error fetching tasks:",
        error.response?.data?.message || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const handleEditTitle = (newTitle, id) => {
    setTitle(newTitle);
    setEditTaskId(id);
  };

  const completeHandler = async (id, isCompleted) => {
    const result = await Swal.fire({
      title: "Are you sure your task is completed?",
      // text: `Your task is ${isCompleted ? "incomplete" : "complete"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, mark  ${
        isCompleted ? "incomplete" : "complete"
      }!`,
    });

    if (!result.isConfirmed) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await axios.put(
        `${server}/todo/${id}`,
        { isCompleted: !isCompleted },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

      Swal.fire({
        icon: "success",
        title: `Task ${isCompleted ? "marked as incomplete" : "completed"}!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(
        `Error ${isCompleted ? "marking as incomplete" : "completing"} task:`,
        error.response?.data?.message || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const completedTasks = tasks.filter((task) => task.isCompleted);
  const incompleteTasks = tasks.filter((task) => !task.isCompleted);

  return (
    <div className="container">
      <div className="app-wrapper">
        <div className="header">ToDo-List</div>
        <div>
          <form onSubmit={submitHandler}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a Todo"
              type="text"
              className="task-input"
              required
            />
            <button type="submit" className="button-add">
              {editTaskId ? "Update" : "Add"}
            </button>
          </form>
        </div>
        <div className="task-list">
          <div className="section">
            <h2>Incomplete Tasks</h2>
            <ul>
              {incompleteTasks.map((task) => (
                <Todoslist
                  title={task.title}
                  isCompleted={task.isCompleted}
                  updateHandler={(newData) => updateHandler(task._id, newData)}
                  deleteHandler={() => deleteHandler(task._id)}
                  completeHandler={() =>
                    completeHandler(task._id, task.isCompleted)
                  }
                  id={task._id}
                  key={task._id}
                  onEditTitle={(title) => handleEditTitle(title, task._id)}
                />
              ))}
            </ul>
          </div>
          <div className="section">
            <h2>Completed Tasks</h2>
            <ul>
              {completedTasks.map((task) => (
                <Todoslist
                  title={task.title}
                  isCompleted={task.isCompleted}
                  deleteHandler={() => deleteHandler(task._id)}
                  completeHandler={() =>
                    completeHandler(task._id, task.isCompleted)
                  }
                  id={task._id}
                  key={task._id}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
