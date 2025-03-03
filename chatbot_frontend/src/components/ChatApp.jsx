import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSun, FaMoon, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dashboardName, setDashboardName] = useState("Internal AI Dashboard");
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(true); 

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      setUser(userId);
      fetchHistory(userId);
      fetchAssistants(userId);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users", {
        username,
        email,
      });
      const userId = res.data.data.id;
      localStorage.setItem("id", userId);
      setUser(userId);
      setIsLoginModalOpen(false);
      fetchHistory(userId);
      fetchAssistants(userId);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("threadId");
    setUser(null);
    setMessages([]);
    setHistory([]);
    setAssistants([]);
  };

  const handleAssistantClick = (item) => {
    setDashboardName(item.name);
    startNewChat();
    fetchHistory(localStorage.getItem("id"))
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { title: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const threadId = localStorage.getItem("threadId");
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        userId: localStorage.getItem("id"),
        threadId: threadId || null,
      });

      if (!threadId) {
        localStorage.setItem("threadId", res.data.data.threadId);
      }

      setMessages((prev) => [...prev, { title: "ai", content: res.data.data.response.content }]);
    } catch {
      setMessages((prev) => [...prev, { title: "ai", content: "Error fetching AI response" }]);
    }
    setLoading(false);
  };

  const startNewChat = () => {
    localStorage.removeItem("threadId");
    setMessages([]);
    fetchHistory(localStorage.getItem("id"))
  };

  const fetchHistory = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history?userId=${userId}`);
      setHistory(res.data.data);
    } catch (error) {
      console.error("Error fetching history", error);
    }
  };

  const fetchAssistants = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/assistants?userId=${userId}`);
      setAssistants(res.data.data);
    } catch (error) {
      console.error("Error fetching assistants", error);
    }
  };

  const loadChatHistory = async (item) => {
    localStorage.setItem("threadId", item.threadId);
    const formattedMessages = item.messages.map((msg) => ({
      title: msg.sender === "user" ? "user" : "ai",
      content: msg.content,
    }));
    setMessages(formattedMessages);
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage()
    }
  };
  return (
    <div className={`h-screen flex ${isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className={`w-64 p-4 ${isDarkTheme ? "bg-gray-800" : "bg-gray-200"}`}>
        <button
          className={`w-full py-2 mb-4 rounded ${
            isDarkTheme ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
          }`}
          onClick={startNewChat}
        >
          New Chat
        </button>
        <ul>
          {history.map((item) => (
            <li
              key={item.id}
              className={`p-2 hover:${isDarkTheme ? "bg-gray-700" : "bg-gray-300"} cursor-pointer rounded`}
              onClick={() => loadChatHistory(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className={`flex justify-between p-4 border-b ${isDarkTheme ? "border-gray-700" : "border-gray-300"}`}>
          <h1 className="text-lg font-semibold">{dashboardName}</h1>
          <div className="flex space-x-4">
            <button onClick={toggleTheme} className="focus:outline-none">
              {isDarkTheme ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
            </button>
            {user ? (
              <button onClick={handleLogout} className="focus:outline-none">
                <FaSignOutAlt className={`${isDarkTheme ? "text-white" : "text-gray-900"}`} />
              </button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="focus:outline-none">
                <FaSignInAlt className={`${isDarkTheme ? "text-white" : "text-gray-900"}`} />
              </button>
            )}
          </div>
        </div>
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className={`p-6 rounded-lg ${isDarkTheme ? "bg-gray-800" : "bg-gray-100"}`}>
              <h2 className="text-lg font-semibold mb-4">Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2 mb-4 rounded ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 mb-4 rounded ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}
              />
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded mr-2 ${
                    isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900"
                  }`}
                  onClick={() => setIsLoginModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    isDarkTheme ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
                  }`}
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assistants */}
        <div className={`flex justify-center space-x-4 p-4 border-b ${isDarkTheme ? "border-gray-700" : "border-gray-300"}`}>
          {assistants.map((assistant) => (
            <div
              key={assistant.id}
              className={`p-3 rounded-lg text-center cursor-pointer ${
                isDarkTheme ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleAssistantClick(assistant)}
            >
              <span className="text-2xl">{assistant.icon}</span>
              <p className="text-sm">{assistant.name}</p>
            </div>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg max-w-xs ${
                msg.title === "user"
                  ? isDarkTheme
                    ? "bg-blue-500 text-white self-end"
                    : "bg-blue-600 text-white self-end"
                  : isDarkTheme
                  ? "bg-gray-700 text-white self-start"
                  : "bg-gray-300 text-gray-900 self-start"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </div>

        {/* Input Box */}
        <div className={`p-4 border-t ${isDarkTheme ? "border-gray-700" : "border-gray-300"}`}>
          <div className="flex">
            <input
              className={`flex-grow p-2 rounded border ${
                isDarkTheme ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-200 border-gray-300 text-gray-900"
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={handleKeyDown}
            />
            <button
              className={`ml-2 px-4 py-2 rounded ${
                isDarkTheme ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
              }`}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}