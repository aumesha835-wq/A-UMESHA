import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Plus,
  Send,
  Sparkles,
  MapPin,
  Bot,
  UserCheck,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { Language, CommunityPost, CommunityComment } from '../types/plants';
import { initialCommunityPosts, cropList } from '../data/mockData';

interface CommunityForumProps {
  language: Language;
  prefillQuestion?: {
    cropName: string;
    issueTitle: string;
    imageUrl?: string;
  } | null;
  onClearPrefill?: () => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  language,
  prefillQuestion,
  onClearPrefill,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const stored = localStorage.getItem('plants_community_posts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading community posts from storage:', e);
    }
    return initialCommunityPosts;
  });
  const [showAskModal, setShowAskModal] = useState<boolean>(!!prefillQuestion);
  const [filterMode, setFilterMode] = useState<'all' | 'solved'>('all');

  // Save to device local storage
  const savePostsToDevice = (updated: CommunityPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem('plants_community_posts', JSON.stringify(updated.slice(0, 30)));
    } catch (e) {
      console.warn('Failed saving community posts locally:', e);
    }
  };

  // Form states
  const [cropInput, setCropInput] = useState<string>(prefillQuestion?.cropName || 'Tomato');
  const [titleInput, setTitleInput] = useState<string>(prefillQuestion?.issueTitle || '');
  const [descInput, setDescInput] = useState<string>('');
  const [authorNameInput, setAuthorNameInput] = useState<string>('ರೈತ ಮಿತ್ರ (Farmer)');
  const [locationInput, setLocationInput] = useState<string>('ಹಾಸನ, ಕರ್ನಾಟಕ (Hassan, KA)');
  const [imagePreview, setImagePreview] = useState<string | null>(prefillQuestion?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New comment input per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleUpvote = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const hasUpvoted = post.hasUpvoted;
        return {
          ...post,
          upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          hasUpvoted: !hasUpvoted,
        };
      }
      return post;
    });
    savePostsToDevice(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      authorName: language === 'kn' ? 'ನೀವು (Farmer)' : 'You (Farmer)',
      text,
      timeAgo: 'Just now',
      upvotes: 0,
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    savePostsToDevice(updated);

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    setIsSubmitting(true);

    let aiReplyText = '';
    try {
      const response = await fetch('/api/community/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `${titleInput}. ${descInput}`,
          crop: cropInput,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        aiReplyText = data.reply;
      }
    } catch (err) {
      console.warn('AI Agronomist ask error, generating local reply:', err);
    }

    if (!aiReplyText) {
      aiReplyText =
        language === 'kn'
          ? `ನಮಸ್ಕಾರ, ಈ ರೋಗಲಕ್ಷಣಕ್ಕೆ 3 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ಹಾನಿಗೊಳಗಾದ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ. ತೇವಾಂಶ ನಿಯಂತ್ರಿಸಿ.`
          : `Dear Farmer, spray Neem Oil @ 3ml/L water immediately and isolate affected foliage. Maintain balanced moisture.`;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: authorNameInput,
      authorRole: 'Farmer',
      location: locationInput,
      cropNameEn: cropInput,
      cropNameKn: cropInput,
      title: titleInput,
      description: descInput || titleInput,
      imageUrl: imagePreview || undefined,
      upvotes: 1,
      hasUpvoted: true,
      isSolved: true,
      timeAgo: 'Just now',
      comments: [
        {
          id: `ai-${Date.now()}`,
          authorName: language === 'kn' ? 'AI ಕೃಷಿ ವೈದ್ಯರು (Plants AI Agronomist)' : 'Plants AI Agronomist',
          isAgronomist: true,
          text: aiReplyText,
          timeAgo: 'Just now',
          upvotes: 5,
        },
      ],
    };

    savePostsToDevice([newPost, ...posts]);
    setIsSubmitting(false);
    setShowAskModal(false);
    setTitleInput('');
    setDescInput('');
    setImagePreview(null);
    if (onClearPrefill) onClearPrefill();
  };

  const filteredPosts = posts.filter((p) => {
    if (filterMode === 'solved') return p.isSolved;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-4 sm:p-5 rounded-2xl shadow-md flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-300" />
            <span>{language === 'kn' ? 'ರೈತ ಸಮುದಾಯ & ಕೃಷಿ ವೇದಿಕೆ' : 'Krishi Community & Agronomist'}</span>
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            {language === 'kn'
              ? 'ಫೋಟೋ ಹಾಕಿ ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳಿಂದ ಪರಿಹಾರ ಮತ್ತು ರೈತರ ಅನುಭವಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ'
              : 'Share plant issues, ask questions, and get verified agronomist solutions'}
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="shrink-0 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'kn' ? 'ಪ್ರಶ್ನೆ ಕೇಳಿ' : 'Ask Question'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterMode === 'all'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          {language === 'kn' ? 'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು' : 'All Discussions'}
        </button>

        <button
          onClick={() => setFilterMode('solved')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            filterMode === 'solved'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'kn' ? 'ಪರಿಹಾರವಾದವು (Solved)' : 'Solved Remedies'}</span>
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3"
          >
            {/* Post Author Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{post.authorName}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{post.location}</span>
                    <span>•</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                {language === 'kn' ? post.cropNameKn : post.cropNameEn}
              </span>
            </div>

            {/* Post Content */}
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{post.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{post.description}</p>

            {/* Optional Attached Leaf Image */}
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden max-h-56 border border-slate-200">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Interactions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => handleUpvote(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors font-semibold ${
                  post.hasUpvoted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-emerald-700' : ''}`} />
                <span>{post.upvotes} {language === 'kn' ? 'ಉಪಯುಕ್ತ' : 'Helpful'}</span>
              </button>

              <div className="flex items-center gap-1 text-slate-500 font-medium">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.comments.length} {language === 'kn' ? 'ಉತ್ತರಗಳು' : 'Answers'}</span>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-3 space-y-2.5 border border-slate-200/80">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {comment.isAgronomist ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Bot className="w-3 h-3 text-amber-300" />
                            {language === 'kn' ? 'AI ಕೃಷಿ ವಿಜ್ಞಾನಿ' : 'AI Agronomist'}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800">{comment.authorName}</span>
                        )}
                        <span className="text-[10px] text-slate-400">{comment.timeAgo}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium pl-1">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Box */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ಉತ್ತರ ಬರೆಯಿರಿ...' : 'Write your answer or remedy...'}
                value={commentInputs[post.id] || ''}
                onChange={(e) =>
                  setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(post.id);
                }}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{language === 'kn' ? 'ರೈತ ಸಮುದಾಯ & AI ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ' : 'Ask Question to Community & AI'}</span>
              </h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'kn' ? 'ಬೆಳೆಯ ಹೆಸರು (Crop):' : 'Crop Name:'}
                </label>
                <select
                  value={cropInput}
                  onChange={(e) => setCropInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {cropList.map((c) => (
                    <option key={c.id} value={c.nameEn}>
                      {language === 'kn' ? c.nameKn : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'kn' ? 'ಸಮಸ್ಯೆಯ ಶೀರ್ಷಿಕೆ (Title / Main issue):' : 'Issue Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'kn' ? 'ಉದಾಹರಣೆ: ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಚುಕ್ಕೆಗಳು ಕಾಣಿಸುತ್ತಿವೆ...' : 'e.g. Yellow spots on bottom leaves...'}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'kn' ? 'ವಿವರಣೆ (Description):' : 'Detailed Description:'}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === 'kn' ? 'ಬೆಳೆಯ ವಯಸ್ಸು, ಹವಾಮಾನ ಮತ್ತು ಎಷ್ಟು ಎಲೆಗಳಿಗೆ ಹರಡಿದೆ ಎಂದು ಬರೆಯಿರಿ...' : 'Crop age, weather, how widespread...'}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು:' : 'Your Name:'}
                  </label>
                  <input
                    type="text"
                    value={authorNameInput}
                    onChange={(e) => setAuthorNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'kn' ? 'ಸ್ಥಳ (Location):' : 'Location:'}
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden h-28 border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Attached"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isSubmitting
                      ? (language === 'kn' ? 'AI ಪರಿಶೀಲಿಸುತ್ತಿದೆ...' : 'AI Diagnosing...')
                      : (language === 'kn' ? 'ಪ್ರಕಟಿಸಿ & AI ಸಲಹೆ ಪಡೆಯಿರಿ' : 'Publish & Get AI Remedy')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
