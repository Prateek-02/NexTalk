// frontend/src/pages/Home.jsx
import { ChatBox } from "../components/ChatBox";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem(import.meta.env.VITE_JWT_KEY);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setContacts(res.data.filter((u) => u._id !== user?._id));
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user?._id]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-70 bg-slate-900/50 backdrop-blur-2xl border-r border-slate-600/30 flex flex-col relative z-10 shadow-2xl">
        {/* Modern Header */}
        <div className="p-6 border-b border-slate-600/30">
          {/* App Logo */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              NexTalk
            </h1>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between p-2 bg-slate-700/40 backdrop-blur-xl rounded-2xl border border-slate-600/20">
            <div 
              className="flex items-center space-x-3 flex-1 cursor-pointer hover:bg-slate-600/30 rounded-xl p-2 -m-2 transition-all duration-200 group"
              onClick={() => navigate("/profile")}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors duration-200">
                  {user?.username || "My Profile"}
                </h2>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Contacts ({contacts.length})
              </h3>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-700/50 backdrop-blur-xl rounded-xl mx-auto mb-3 flex items-center justify-center border border-slate-600/20">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400 font-medium">No contacts found</p>
                <p className="text-xs text-slate-500 mt-1">Users will appear here when they join</p>
              </div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedContact(c)}
                  className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                    selectedContact?._id === c._id
                      ? "bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 shadow-lg"
                      : "hover:bg-slate-800/40 hover:backdrop-blur-xl hover:border hover:border-slate-600/20"
                  }`}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center rounded-full text-white font-semibold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    {c.username[0].toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-white text-sm group-hover:text-blue-100 transition-colors duration-200">
                      {c.username}
                    </p>
                  </div>
                  {selectedContact?._id === c._id && (
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Chat Header */}
        <header className="px-3 py-3 bg-slate-800/40 backdrop-blur-2xl border-b border-slate-600/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {selectedContact ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center rounded-full text-white font-semibold shadow-lg">
                    {selectedContact.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xl">
                      {selectedContact.username}
                    </h2>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="font-bold text-white text-xl">NexTalk</h2>
                  <p className="text-sm text-slate-400">Select a contact to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Content Area */}
        <div className="flex-1 overflow-hidden">
          {selectedContact ? (
            <ChatBox selectedContact={selectedContact} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-slate-800/20 backdrop-blur-xl">
              {/* Welcome Animation */}
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse scale-110"></div>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl border border-slate-600/30">
                  {/* Chat Bubble Stack Animation */}
                  <div className="relative w-24 h-24">
                    <div className="absolute top-4 right-0 w-16 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl rounded-tr-sm opacity-80 animate-bounce delay-700"></div>
                    <div className="absolute top-0 left-0 w-20 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl rounded-bl-sm shadow-xl animate-bounce delay-300 flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center max-w-md">
                <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Welcome to NexTalk
                </h3>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Select a contact from the sidebar to start a conversation. 
                  Connect, chat, and create memories with your friends.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="px-4 py-2 bg-slate-700/40 backdrop-blur-xl rounded-full border border-slate-600/20 text-sm text-slate-300">
                    🚀 Real-time messaging
                  </div>
                  <div className="px-4 py-2 bg-slate-700/40 backdrop-blur-xl rounded-full border border-slate-600/20 text-sm text-slate-300">
                    🔒 Secure & private
                  </div>
                  <div className="px-4 py-2 bg-slate-700/40 backdrop-blur-xl rounded-full border border-slate-600/20 text-sm text-slate-300">
                    💬 Easy to use
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};