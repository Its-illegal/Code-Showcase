import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { PostForm } from "@/components/blog/PostForm";
import { CommentSection } from "@/components/blog/CommentSection";
import { useListBlogPosts, useUpdateBlogPost, useDeleteBlogPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function BlogPost() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch list to find post by slug
  const { data: posts, isLoading } = useListBlogPosts();
  const post = posts?.find(p => p.slug === slug);

  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-white/10 rounded" />
          <div className="h-16 w-3/4 bg-white/10 rounded" />
          <div className="h-6 w-1/4 bg-white/10 rounded" />
          <div className="h-96 w-full bg-white/10 rounded-2xl mt-12" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-6">Post not found</h1>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const handleUpdate = (data: any) => {
    updateMutation.mutate({ id: post.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        setIsEditOpen(false);
        toast({ title: "Success", description: "Post updated successfully" });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: post.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        toast({ title: "Deleted", description: "Post removed" });
        setLocation("/blog");
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <article className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Admin Controls */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all posts
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="h-9 border-white/10">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)} className="h-9">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), "MMMM d, yyyy")}
            </time>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground leading-tight mb-8">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Content */}
        <div className="glass-panel p-6 sm:p-12 rounded-3xl">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <PostForm initialData={post} onSubmit={handleUpdate} isPending={updateMutation.isPending} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mt-4 mb-6">
            Are you sure you want to delete "{post.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete it"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
