"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Send, ArrowRight, X, ChevronDown, ChevronUp, Lock, Mic } from "lucide-react";
import { SITE_DATA } from "@/content/site";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sanitizeInput } from "@/lib/security";

export interface Answer {
  id: string;
  author: string;
  content: string;
  date: string;
  votes: number;
}

export interface Question {
  id: string;
  title: string;
  details: string;
  author: string;
  category: string;
  date: string;
  votes: number;
  answers: Answer[];
}

interface UserProfile {
  email: string;
  name: string;
}

interface QnASectionProps {
  user: UserProfile | null;
  onRequireAuth: (intent: string) => void;
  showOnlyMyQuestions?: boolean;
}

export default function QnASection({ user, onRequireAuth, showOnlyMyQuestions = false }: QnASectionProps) {
  const { openFloor } = SITE_DATA;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDetails, setNewDetails] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("General");

  // State for adding an answer
  const [answerInputs, setAnswerInputs] = useState<{ [qId: string]: string }>({});

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("questions")
            .select("id, title, details, author_name, category, created_at, votes, answers(id, author_name, content, created_at, votes)")
            .order("created_at", { ascending: false })
            .limit(10);

          if (!error && data && data.length > 0) {
            const mapped: Question[] = data.map((q) => ({
              id: q.id,
              title: q.title,
              details: q.details || "",
              author: q.author_name || "Debater",
              category: q.category || "General",
              date: q.created_at ? new Date(q.created_at).toLocaleDateString() : "Recently",
              votes: q.votes || 1,
              answers: (q.answers || []).map((a: { id: string; author_name?: string; content?: string; created_at?: string; votes?: number }) => ({
                id: a.id,
                author: a.author_name || "Debater",
                content: a.content || "",
                date: a.created_at ? new Date(a.created_at).toLocaleDateString() : "Recently",
                votes: a.votes || 1,
              })),
            }));
            setQuestions(mapped);
            return;
          }
        } catch (e) {
          console.error("Error loading from Supabase", e);
        }
      }

      try {
        const saved = localStorage.getItem("at_debate_qna_questions");
        if (saved) {
          setQuestions(JSON.parse(saved));
        } else {
          setQuestions([]);
        }
      } catch (e) {
        console.error("Failed to load QnA questions", e);
      }
    }

    loadData();
  }, []);

  const saveQuestions = (updated: Question[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem("at_debate_qna_questions", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save QnA questions", e);
    }
  };

  const handleOpenAskModal = () => {
    if (!user) {
      onRequireAuth("ask a question");
      return;
    }
    setIsAskModalOpen(true);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (!user) {
      onRequireAuth("ask a question");
      return;
    }

    // XSS Sanitization
    const sanitizedTitle = sanitizeInput(newTitle);
    const sanitizedDetails = sanitizeInput(newDetails);
    const sanitizedCategory = sanitizeInput(newCategory || "General");

    const created: Question = {
      id: `q-${Date.now()}`,
      title: sanitizedTitle,
      details: sanitizedDetails,
      author: sanitizeInput(user.name),
      category: sanitizedCategory,
      date: "Just now",
      votes: 1,
      answers: []
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("questions").insert([
          {
            title: created.title,
            details: created.details,
            author_name: created.author,
            category: created.category,
            votes: 1
          }
        ]);
      } catch (err) {
        console.error("Failed to insert question to Supabase", err);
      }
    }

    const updated = [created, ...questions];
    saveQuestions(updated);
    setExpandedQuestionId(created.id);

    setNewTitle("");
    setNewDetails("");
    setNewCategory("General");
    setIsAskModalOpen(false);
  };

  const handleAddAnswer = async (qId: string) => {
    if (!user) {
      onRequireAuth("post an answer");
      return;
    }

    const rawText = answerInputs[qId]?.trim();
    if (!rawText) return;

    // XSS Sanitization
    const sanitizedContent = sanitizeInput(rawText);

    const newAns: Answer = {
      id: `ans-${Date.now()}`,
      author: sanitizeInput(user.name),
      content: sanitizedContent,
      date: "Just now",
      votes: 1
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("answers").insert([
          {
            question_id: qId,
            author_name: newAns.author,
            content: newAns.content,
            votes: 1
          }
        ]);
      } catch (err) {
        console.error("Failed to insert answer to Supabase", err);
      }
    }

    const updated = questions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          answers: [...q.answers, newAns]
        };
      }
      return q;
    });

    saveQuestions(updated);
    setAnswerInputs((prev) => ({ ...prev, [qId]: "" }));
  };

  const handleVoteQuestion = (qId: string) => {
    if (!user) {
      onRequireAuth("support useful contributions");
      return;
    }

    const updated = questions.map((q) => {
      if (q.id === qId) {
        return { ...q, votes: q.votes + 1 };
      }
      return q;
    });
    saveQuestions(updated);
  };

  const handleVoteAnswer = (qId: string, ansId: string) => {
    if (!user) {
      onRequireAuth("support useful contributions");
      return;
    }

    const updated = questions.map((q) => {
      if (q.id === qId) {
        const newAnswers = q.answers.map((a) => {
          if (a.id === ansId) {
            return { ...a, votes: a.votes + 1 };
          }
          return a;
        });
        return { ...q, answers: newAnswers };
      }
      return q;
    });
    saveQuestions(updated);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesUser = !showOnlyMyQuestions || (user && q.author === user.name);
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answers.some((a) => a.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === "Unanswered") {
      return matchesUser && matchesSearch && q.answers.length === 0;
    }
    return matchesUser && matchesSearch;
  });

  if (activeFilter === "Top Voted") {
    filteredQuestions.sort((a, b) => b.votes - a.votes);
  }

  return (
    <section id="open-floor" className="bg-[#F5F0E6] text-[#171717] py-12 md:py-20 border-b border-[#171717]/10 paper-grain scroll-mt-20 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 pb-6 border-b border-[#171717]/15">
          
          <div className="flex items-start gap-6 flex-1">
            {/* Stage Microphone Artwork */}
            <div className="hidden sm:block w-28 sm:w-36 h-28 sm:h-36 shrink-0 relative">
              <Image
                src="/open-floor-microphone.webp"
                alt=""
                width={140}
                height={140}
                loading="lazy"
                sizes="140px"
                className="object-contain w-full h-full mix-blend-multiply"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525] mb-2">
                <Mic className="w-3.5 h-3.5 text-[#E87525]" />
                <span>SPEAK &amp; DEBATE</span>
              </div>
              <h2 className="font-condensed text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.88] uppercase text-[#171717]">
                {openFloor.title}
              </h2>
              <p className="text-base sm:text-lg text-[#171717]/80 font-sans mt-3 font-medium">
                {openFloor.supportingText}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAskModal}
            className="w-full sm:w-auto px-5 py-3.5 font-condensed text-sm bg-[#E87525] text-[#F5F0E6] uppercase tracking-wider hover:bg-[#171717] transition-colors border border-[#171717]/20 flex items-center justify-center gap-2 min-h-[44px] shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F5F0E6]" />
            <span>ASK A QUESTION</span>
          </button>
        </div>

        {/* Rectangular Filters & Search */}
        <div className="flex flex-col sm:flex-row-reverse gap-4 justify-between items-stretch sm:items-center mb-8 max-w-[1100px] mx-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] placeholder-[#171717]/60 focus:outline-none focus:border-[#E87525]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {["All", "Top Voted", "Unanswered"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-2 font-condensed text-xs uppercase tracking-wider border border-[#171717]/15 transition-colors min-h-[44px] ${
                  activeFilter === filter
                    ? "bg-[#171717] text-[#F5F0E6]"
                    : "bg-[#F5F0E6] text-[#171717] hover:bg-[#171717]/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Question List Rows */}
        {filteredQuestions.length > 0 ? (
          <div className="border-t border-[#171717]/15 max-w-[1100px] mx-auto">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="border-b border-[#171717]/15 py-6 transition-colors hover:bg-[#171717]/[0.02]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Question Title & Context */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-sans">
                        <span className="font-condensed font-bold text-xs uppercase tracking-wider text-[#E87525]">
                          {q.category}
                        </span>
                        <span className="text-[#171717]/30">•</span>
                        <span className="text-[#171717]/70">By {q.author}</span>
                        <span className="text-[#171717]/30">•</span>
                        <span className="text-[#171717]/50 font-mono text-[11px]">{q.date}</span>
                      </div>

                      <h3
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="font-sans font-bold text-xl sm:text-2xl text-[#171717] hover:text-[#E87525] cursor-pointer transition-colors leading-snug line-clamp-2 break-words"
                      >
                        {q.title}
                      </h3>

                      {q.details && (
                        <p className="text-xs sm:text-sm text-[#171717]/80 leading-relaxed font-sans line-clamp-2 break-words">
                          {q.details}
                        </p>
                      )}
                    </div>

                    {/* Right: Actions & Metrics */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0 pt-3 md:pt-0 font-sans border-t md:border-t-0 border-[#171717]/10">
                      
                      {/* Hear Hear Vote Button */}
                      <button
                        onClick={() => handleVoteQuestion(q.id)}
                        className="min-h-[44px] border border-[#171717]/20 bg-[#F5F0E6] hover:bg-[#171717] hover:text-[#F5F0E6] px-3.5 py-2 text-xs font-bold transition-colors flex items-center gap-2"
                        title="Hear Hear! Upvote argument"
                      >
                        <span className="text-[#E87525] font-condensed font-bold text-sm">👏</span>
                        <span className="font-condensed text-sm tracking-wider uppercase">Hear Hear ({q.votes})</span>
                      </button>

                      {/* Answers Count Toggle */}
                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="min-h-[44px] text-xs font-bold text-[#171717] hover:text-[#E87525] flex items-center gap-1.5 px-3 border border-[#171717]/15 bg-white"
                      >
                        <span>{q.answers.length} {q.answers.length === 1 ? "Answer" : "Answers"}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#E87525]" /> : <ChevronDown className="w-4 h-4 text-[#E87525]" />}
                      </button>

                      {/* Open Arrow */}
                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#E87525] hover:translate-x-1 transition-transform"
                        aria-label="Toggle question answers"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>

                    </div>

                  </div>

                  {/* Expanded Answer Panel */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-[#171717]/15 space-y-6 font-sans">
                      
                      {/* Answers List */}
                      <div className="space-y-4">
                        <h4 className="font-condensed font-extrabold text-sm text-[#171717] uppercase tracking-wider">
                          Answers &amp; Contributions ({q.answers.length})
                        </h4>

                        {q.answers.length === 0 ? (
                          <p className="text-xs text-[#171717]/60 italic">
                            No answers recorded yet. Be the first to contribute!
                          </p>
                        ) : (
                          q.answers.map((ans) => (
                            <div
                              key={ans.id}
                              className="bg-white border border-[#171717]/15 p-4 flex flex-col sm:flex-row items-start justify-between gap-4"
                            >
                              <div className="space-y-1.5 flex-1 break-words">
                                <div className="flex items-center gap-2 text-xs text-[#171717]/70">
                                  <strong className="text-[#171717]">{ans.author}</strong>
                                  <span>•</span>
                                  <span className="font-mono text-[11px]">{ans.date}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#171717] leading-relaxed">
                                  {ans.content}
                                </p>
                              </div>

                              <button
                                onClick={() => handleVoteAnswer(q.id, ans.id)}
                                className="min-h-[44px] border border-[#171717]/20 px-3.5 py-2 text-xs font-bold text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] flex items-center gap-1.5 transition-colors shrink-0 self-end sm:self-start"
                              >
                                <span>👏</span>
                                <span className="font-condensed font-bold">{ans.votes}</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Answer Input / Respectful Auth Prompt */}
                      <div className="pt-4 border-t border-[#171717]/15">
                        {user ? (
                          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                            <textarea
                              rows={2}
                              placeholder={`Replying as ${user.name}...`}
                              value={answerInputs[q.id] || ""}
                              onChange={(e) =>
                                setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })
                              }
                              className="flex-1 p-3 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525] resize-none"
                            />
                            <button
                              onClick={() => handleAddAnswer(q.id)}
                              className="min-h-[44px] w-full sm:w-auto px-6 py-3 bg-[#E87525] text-[#F5F0E6] font-condensed text-sm uppercase font-bold tracking-wider hover:bg-[#171717] transition-colors border border-[#171717]/20 flex items-center justify-center gap-2 shrink-0"
                            >
                              <Send className="w-4 h-4" />
                              <span>Post Answer</span>
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => onRequireAuth("post an answer")}
                            className="border border-[#171717]/15 bg-[#D7D0C4]/40 p-4 text-center cursor-pointer hover:border-[#E87525] transition-colors"
                          >
                            <p className="text-xs text-[#171717] font-sans flex items-center justify-center gap-2 font-medium">
                              <Lock className="w-4 h-4 text-[#E87525]" />
                              <span>Create an account or sign in to ask questions, post answers and support useful contributions.</span>
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Purposeful Empty State */
          <div className="border border-[#171717]/15 bg-white p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-8 font-sans shadow-xs">
            <Mic className="w-12 h-12 mx-auto text-[#E87525]" />
            <h3 className="font-condensed text-3xl sm:text-4xl text-[#171717] uppercase tracking-wider">
              {openFloor.emptyHeading}
            </h3>
            <p className="text-sm text-[#171717]/80 leading-relaxed">
              {openFloor.emptyText}
            </p>
            <button
              onClick={handleOpenAskModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#171717]/20 bg-[#E87525] text-[#F5F0E6] hover:bg-[#171717] font-condensed text-sm uppercase tracking-wider font-bold transition-colors mt-2 min-h-[44px] w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{openFloor.emptyButtonText}</span>
            </button>
          </div>
        )}

      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="bg-[#F5F0E6] text-[#171717] max-w-lg w-full p-6 relative border border-[#171717]/30 shadow-xl max-h-[calc(100dvh-32px)] overflow-y-auto my-auto">
            <button
              onClick={() => setIsAskModalOpen(false)}
              className="absolute top-4 right-4 text-[#171717] hover:text-[#E87525] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-condensed text-2xl uppercase tracking-wider text-[#171717] mb-4 pb-2 border-b border-[#171717]/15 flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#E87525]" />
              <span>OPEN FLOOR — ASK QUESTION</span>
            </h3>

            <form onSubmit={handleAskQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                  Question / Motion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to structure a 7-minute PM speech?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                  Context / Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Background context..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                >
                  <option value="General">General</option>
                  <option value="Debate Strategy">Debate Strategy</option>
                  <option value="Debate Motion">Debate Motion</option>
                  <option value="Rhetoric & Tips">Rhetoric &amp; Tips</option>
                  <option value="Tong Discussion">Tong Discussion</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3 font-condensed text-sm uppercase">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 font-bold text-[#171717]/70 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E87525] text-[#F5F0E6] font-bold uppercase tracking-wider border border-[#171717]/20 min-h-[44px]"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
