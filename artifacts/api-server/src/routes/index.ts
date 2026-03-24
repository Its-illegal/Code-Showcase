import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import blogRouter from "./blog";
import commentsRouter from "./comments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use("/blog", blogRouter);
// Comments are nested under blog posts: /api/blog/:postId/comments
router.use("/blog/:postId/comments", commentsRouter);

export default router;
