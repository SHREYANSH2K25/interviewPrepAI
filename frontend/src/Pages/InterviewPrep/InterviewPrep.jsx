import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pin,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useUser } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [loadingExplanations, setLoadingExplanations] = useState({});
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchSession();
  }, [sessionId, isAuthenticated, navigate]);

  const fetchSession = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.sessions.getById(sessionId));
      if (response.data.success) {
        setSession(response.data.session);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handlePinQuestion = async (questionId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.questions.pin(questionId));
      if (response.data.success) {
        setSession((prev) => ({
          ...prev,
          questions: prev.questions.map((q) =>
            q._id === questionId ? { ...q, isPinned: !q.isPinned } : q
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to pin question:', error);
    }
  };

  const handleExplainConcept = async (questionId) => {
    setLoadingExplanations((prev) => ({ ...prev, [questionId]: true }));

    try {
      const response = await axiosInstance.post(API_PATHS.ai.explainConcept(questionId));
      if (response.data.success) {
        setSession((prev) => ({
          ...prev,
          questions: prev.questions.map((q) =>
            q._id === questionId
              ? { ...q, conceptExplanation: response.data.explanation }
              : q
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      alert('Failed to generate explanation');
    } finally {
      setLoadingExplanations((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Sort questions: pinned first
  const sortedQuestions = [...session.questions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const visibleQuestions = sortedQuestions.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.role}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {session.experience} • {session.questions.length} questions
              </p>
            </div>
            {session.focusAreas && session.focusAreas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {session.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Interview Q & A</h2>

        <div className="space-y-6">
          {visibleQuestions.map((question) => (
            <div
              key={question._id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                question.isPinned
                  ? 'border-orange-400 shadow-orange-100'
                  : 'border-gray-100 hover:shadow-xl'
              }`}
            >
              {/* Question Header */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {question.isPinned && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          Pinned
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {question.question}
                    </h3>
                  </div>
                  <button
                    onClick={() => handlePinQuestion(question._id)}
                    className={`p-2.5 rounded-lg transition-colors ${
                      question.isPinned
                        ? 'bg-orange-100 text-orange-600'
                        : 'hover:bg-gray-100 text-gray-400'
                    }`}
                    title={question.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className={`w-5 h-5 ${question.isPinned ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => toggleExpand(question._id)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    Learn More
                    {expandedQuestions[question._id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {expandedQuestions[question._id] && !question.conceptExplanation && (
                    <button
                      onClick={() => handleExplainConcept(question._id)}
                      disabled={loadingExplanations[question._id]}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {loadingExplanations[question._id] ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Explain Concept
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Answer */}
              {expandedQuestions[question._id] && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {question.answer}
                    </ReactMarkdown>
                  </div>

                  {/* Concept Explanation */}
                  {question.conceptExplanation && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Concept Explanation</h4>
                      </div>
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm" {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {question.conceptExplanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < sortedQuestions.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-all hover:shadow-lg"
            >
              Load More Questions
            </button>
          </div>
        )}

        {visibleCount >= sortedQuestions.length && sortedQuestions.length > 5 && (
          <p className="text-center text-gray-500 mt-12">
            You've reached the end of the questions
          </p>
        )}
      </main>
    </div>
  );
};

export default InterviewPrep;
