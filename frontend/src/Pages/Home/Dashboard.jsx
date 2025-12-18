import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  LogOut,
  Sparkles,
  BookOpen,
  Clock,
  Trash2,
  ChevronRight,
  Loader2,
  X,
  Target,
} from 'lucide-react';
import { useUser } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    focusAreas: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchSessions();
  }, [isAuthenticated, navigate]);

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.sessions.getAll);
      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const focusAreasArray = formData.focusAreas
        ? formData.focusAreas.split(',').map((area) => area.trim())
        : [];

      const response = await axiosInstance.post(API_PATHS.sessions.create, {
        role: formData.role,
        experience: formData.experience,
        focusAreas: focusAreasArray,
      });

      if (response.data.success) {
        setSessions([response.data.session, ...sessions]);
        setShowCreateForm(false);
        setFormData({ role: '', experience: '', focusAreas: '' });
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      alert(error.response?.data?.message || 'Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await axiosInstance.delete(API_PATHS.sessions.delete(sessionId));
      setSessions(sessions.filter((s) => s._id !== sessionId));
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Interview Prep AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{sessions.length}</h3>
            <p className="text-gray-600">Total Sessions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {sessions.reduce((acc, s) => acc + s.questions.length, 0)}
            </h3>
            <p className="text-gray-600">Questions Practiced</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {sessions.length > 0
                ? new Date(sessions[0].createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </h3>
            <p className="text-gray-600">Last Session</p>
          </div>
        </div>

        {/* Sessions Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Sessions</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Session
          </button>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-6">Create your first interview prep session to get started!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-600">
                      {session.role.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSession(session._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {session.role}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{session.experience} experience</p>

                {session.focusAreas && session.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.focusAreas.slice(0, 3).map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    {session.questions.length} questions
                  </span>
                  <button
                    onClick={() => navigate(`/interview/${session._id}`)}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm group-hover:gap-2 transition-all"
                  >
                    Start
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Session Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in fade-in duration-300">
            <button
              onClick={() => setShowCreateForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 pb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Session</h2>
              <p className="text-gray-600">Generate AI-powered interview questions</p>
            </div>

            <form onSubmit={handleCreateSession} className="px-8 pb-8">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Frontend Developer, Data Scientist"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level *
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 2 years, 5+ years, Entry level"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Areas <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.focusAreas}
                  onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                  placeholder="React, Node.js, MongoDB (comma-separated)"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Separate multiple areas with commas</p>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  'Create Session'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
