import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Dashboard from "@/components/Dashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    status: "",
    search: ""
  });

  const fetchTopics = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.difficulty) params.append("difficulty", filters.difficulty);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      
      const response = await axios.get(`${API}/topics?${params.toString()}`);
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to fetch topics");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`${API}/topics/reminders/due`);
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const addTopic = async (topicData) => {
    try {
      const response = await axios.post(`${API}/topics`, topicData);
      setTopics([response.data, ...topics]);
      fetchStats();
      toast.success("Topic added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding topic:", error);
      toast.error("Failed to add topic");
      throw error;
    }
  };

  const updateTopic = async (topicId, updateData) => {
    try {
      const response = await axios.put(`${API}/topics/${topicId}`, updateData);
      setTopics(topics.map(t => t.id === topicId ? response.data : t));
      fetchStats();
      fetchReminders();
      toast.success("Topic updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating topic:", error);
      toast.error("Failed to update topic");
      throw error;
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await axios.delete(`${API}/topics/${topicId}`);
      setTopics(topics.filter(t => t.id !== topicId));
      fetchStats();
      toast.success("Topic deleted successfully");
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Failed to delete topic");
    }
  };

  const markReviewed = async (topicId) => {
    try {
      await axios.post(`${API}/topics/${topicId}/review`);
      fetchReminders();
      toast.success("Marked as reviewed");
    } catch (error) {
      console.error("Error marking reviewed:", error);
      toast.error("Failed to mark as reviewed");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTopics(), fetchStats(), fetchReminders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [filters]);

  return (
    <div className="App">
      <Dashboard
        topics={topics}
        stats={stats}
        reminders={reminders}
        loading={loading}
        filters={filters}
        setFilters={setFilters}
        addTopic={addTopic}
        updateTopic={updateTopic}
        deleteTopic={deleteTopic}
        markReviewed={markReviewed}
      />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;