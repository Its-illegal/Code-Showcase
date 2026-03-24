import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, LogIn, Loader2, User } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: number;
  postId: number;
  authorId: string;
  authorName: string;
  authorProfileImage: string | null;
  body: string;
  createdAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE}/api/blog/${postId}/comments`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load comments");
  return res.json();
}

async function postComment(postId: number, body: string): Promise<Comment> {
  const res = await fetch(`${BASE}/api/blog/${postId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (res.status === 401) throw new Error("You must be logged in to comment");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to post comment");
  }
  return res.json();
}

async function deleteComment(postId: number, commentId: number): Promise<void> {
  const res = await fetch(`${BASE}/api/blog/${postId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 403) throw new Error("You can only delete your own comments");
  if (!res.ok) throw new Error("Failed to delete comment");
}

function Avatar({ name, src }: { name: string; src?: string | null }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        style={{ boxShadow: "0 0 0 1px rgba(0,210,170,0.20)" }}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold select-none"
      style={{
        background: "linear-gradient(135deg, hsl(170,90%,38%) 0%, hsl(210,90%,48%) 100%)",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {initials}
    </div>
  );
}

export function CommentSection({ postId }: { postId: number }) {
  const { user, isLoading: authLoading, isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const COMMENTS_KEY = ["comments", postId];

  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: COMMENTS_KEY,
    queryFn: () => fetchComments(postId),
  });

  const addMutation = useMutation({
    mutationFn: (body: string) => postComment(postId, body),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(COMMENTS_KEY, (prev = []) => [...prev, newComment]);
      setDraft("");
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData<Comment[]>(COMMENTS_KEY, (prev = []) =>
        prev.filter((c) => c.id !== commentId),
      );
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  };

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,210,170,0.10)", border: "1px solid rgba(0,210,170,0.18)" }}
        >
          <MessageSquare className="w-4 h-4" style={{ color: "hsl(170,90%,42%)" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Discussion
          </h2>
          <p className="text-xs font-mono" style={{ color: "rgba(0,210,170,0.50)" }}>
            {commentsLoading ? "loading…" : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Compose box */}
      <div
        className="rounded-2xl p-5 mb-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(0,210,170,0.07) 0%, rgba(55,35,180,0.09) 55%, rgba(4,8,18,0.92) 100%)",
          border: "1px solid rgba(0,210,170,0.13)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* gloss */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,210,170,0.30) 40%, rgba(80,50,220,0.20) 70%, transparent)",
          }}
        />

        {authLoading ? (
          <div className="flex items-center gap-2 py-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : !isAuthenticated ? (
          /* Login prompt */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                Join the discussion
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
                Log in to leave a comment on this post.
              </p>
            </div>
            <button
              onClick={login}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(170,90%,38%) 0%, hsl(210,90%,46%) 100%)",
                color: "rgba(0,0,0,0.85)",
                fontFamily: "var(--font-display)",
              }}
            >
              <LogIn className="w-4 h-4" />
              Log in to comment
            </button>
          </div>
        ) : (
          /* Compose form */
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar name={user?.firstName ?? "You"} src={user?.profileImageUrl} />
              <div className="flex-1 relative">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Share your thoughts…"
                  maxLength={2000}
                  rows={3}
                  className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,210,170,0.14)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-sans)",
                    caretColor: "hsl(170,90%,42%)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,210,170,0.35)";
                    e.target.style.boxShadow = "0 0 0 2px rgba(0,210,170,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,210,170,0.14)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {/* char count */}
                {draft.length > 0 && (
                  <span
                    className="absolute bottom-2 right-3 text-xs font-mono pointer-events-none"
                    style={{ color: draft.length > 1800 ? "hsl(0,82%,60%)" : "rgba(255,255,255,0.22)" }}
                  >
                    {draft.length}/2000
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!draft.trim() || addMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, hsl(170,90%,38%) 0%, hsl(210,90%,46%) 100%)",
                  color: "rgba(0,0,0,0.85)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {addMutation.isPending ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Comment list */}
      {commentsLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded bg-white/10" />
                <div className="h-10 rounded-xl bg-white/05" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{ border: "1px dashed rgba(0,210,170,0.10)", color: "rgba(255,255,255,0.28)" }}
        >
          <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="flex gap-3 group"
              >
                <Avatar name={c.authorName} src={c.authorProfileImage} />
                <div className="flex-1 min-w-0">
                  {/* header row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "rgba(255,255,255,0.82)", fontFamily: "var(--font-display)" }}
                    >
                      {c.authorName}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                      title={new Date(c.createdAt).toLocaleString()}
                    >
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </span>
                    {/* delete button — only for comment owner */}
                    {user?.id === c.authorId && (
                      <button
                        onClick={() => deleteMutation.mutate(c.id)}
                        disabled={deleteMutation.isPending}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10"
                        style={{ color: "hsl(0,82%,60%)" }}
                        title="Delete comment"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  {/* body */}
                  <div
                    className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.70)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {c.body}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
