import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateBlogPostBody,
  GetBlogPostParams,
  UpdateBlogPostBody,
  UpdateBlogPostParams,
  DeleteBlogPostParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

router.get("/", async (req, res) => {
  const posts = await db
    .select()
    .from(blogPostsTable)
    .orderBy(blogPostsTable.publishedAt);
  res.json(posts.reverse());
});

router.post("/", async (req, res) => {
  const body = CreateBlogPostBody.parse(req.body);
  const slug = slugify(body.title) + "-" + Date.now();
  const [post] = await db
    .insert(blogPostsTable)
    .values({
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt,
      tags: body.tags,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    })
    .returning();
  res.status(201).json(post);
});

router.get("/:id", async (req, res) => {
  const { id } = GetBlogPostParams.parse({ id: Number(req.params.id) });
  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id));
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.put("/:id", async (req, res) => {
  const { id } = UpdateBlogPostParams.parse({ id: Number(req.params.id) });
  const body = UpdateBlogPostBody.parse(req.body);
  const existing = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id));
  if (!existing.length) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const [post] = await db
    .update(blogPostsTable)
    .set({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      tags: body.tags,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(blogPostsTable.id, id))
    .returning();
  res.json(post);
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteBlogPostParams.parse({ id: Number(req.params.id) });
  const existing = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id));
  if (!existing.length) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.status(204).end();
});

export default router;
