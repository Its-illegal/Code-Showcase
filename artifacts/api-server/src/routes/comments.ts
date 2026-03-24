import { Router, type IRouter } from "express";
import { db, commentsTable, blogPostsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router({ mergeParams: true });

// Validation schema — strictly bounds input, no HTML allowed
const CreateCommentBody = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment too long (max 2000 chars)")
    // Strip any HTML tags to prevent stored-XSS
    .transform((val) => val.replace(/<[^>]*>/g, "")),
});

// GET /api/blog/:postId/comments — public, anyone can read
router.get("/", async (req, res) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId <= 0) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }

  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postId, postId))
    .orderBy(commentsTable.createdAt);

  res.json(comments);
});

// POST /api/blog/:postId/comments — requires authentication
router.post("/", async (req, res) => {
  // Auth guard — reject immediately if no valid session
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "You must be logged in to comment" });
    return;
  }

  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId <= 0) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }

  // Confirm the post actually exists before inserting
  const [post] = await db
    .select({ id: blogPostsTable.id })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, postId));

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  // Validate + sanitize body
  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const user = req.user!;

  const [comment] = await db
    .insert(commentsTable)
    .values({
      postId,
      authorId: user.id,
      authorName: [user.firstName, user.lastName].filter(Boolean).join(" ") || "Anonymous",
      authorProfileImage: user.profileImageUrl ?? null,
      body: parsed.data.body,
    })
    .returning();

  res.status(201).json(comment);
});

// DELETE /api/blog/:postId/comments/:commentId — owner only
router.delete("/:commentId", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "You must be logged in" });
    return;
  }

  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);

  if (!Number.isInteger(postId) || !Number.isInteger(commentId)) {
    res.status(400).json({ error: "Invalid IDs" });
    return;
  }

  const [comment] = await db
    .select()
    .from(commentsTable)
    .where(
      and(
        eq(commentsTable.id, commentId),
        eq(commentsTable.postId, postId),
      ),
    );

  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  // Only the author can delete their own comment
  if (comment.authorId !== req.user!.id) {
    res.status(403).json({ error: "You can only delete your own comments" });
    return;
  }

  await db.delete(commentsTable).where(eq(commentsTable.id, commentId));
  res.status(204).end();
});

export default router;
