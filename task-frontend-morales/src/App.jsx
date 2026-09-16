import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const API_URL = "http://127.0.0.1:8000/api/tasks";
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  // READ
  const getTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);
  // INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  // CREATE AND UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE
        await axios.put(
          `${API_URL}/${editingId}`,
          formData
        );
        alert("Task updated successfully!");
        setEditingId(null);
      } else {
        // CREATE
        await axios.post(
          API_URL,
          formData
        );
        alert("Task added successfully!");
      }
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium"
      });
      getTasks();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };
  // EDIT
  const editTask = (task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority || "Medium"
    });
  };
  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium"
    });
  };
  // DELETE
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(
        `${API_URL}/${id}`
      );
      alert("Task deleted successfully!");
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {

      console.error(error);
      alert("Unable to delete task.");
    }
  };
  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;

    return matchesTitle && matchesStatus;
  });

  return (
    <div className="app-shell">
      <main className="container">
      <header className="app-header">
        <p className="eyebrow">Task workspace</p>
        <h1>Student Task Manager</h1>
        <p className="subtitle">Plan, prioritize, and keep your work moving.</p>
      </header>
      <form className="panel task-form" onSubmit={handleSubmit}>
        <h2>
          {editingId ? "Edit Task" : "Add Task"}
        </h2>
        <label>Task Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleChange}
        />
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">
            Pending
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">
          {editingId ? "Update Task" : "Add Task"}

        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>
      <section className="panel task-list-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Task List</h2>
        </div>
        <span className="task-count">{filteredTasks.length} shown</span>
      </div>
      <label htmlFor="searchTask">Search Task</label>
      <input
        id="searchTask"
        type="text"
        placeholder="Search by task title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <label htmlFor="statusFilter">Filter by Status</label>
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      {filteredTasks.length === 0 ? (
        <p>
          {tasks.length === 0
            ? "No tasks available."
            : "No matching tasks found."}
        </p>
      ) : (
        filteredTasks.map((task) => (
          <div
            className="task-card"
            key={task.id}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              Status:
              <strong className={`badge status-${task.status.toLowerCase()}`}>
                {" "}{task.status}
              </strong>
            </p>
            <p>
              Priority:
              <strong className={`badge priority-${task.priority.toLowerCase()}`}>
                {" "}{task.priority}
              </strong>
            </p>
            <button
              type="button"
              onClick={() => editTask(task)}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))

      )}
      </section>
      </main>
    </div>
  );
}
export default App;