import { motion } from "framer-motion";
import { Link } from "wouter";
import { format } from "date-fns";
import { Plus, PenLine } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostForm } from "@/components/blog/PostForm";
import { useListBlogPosts, useCreateBlogPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function BlogList() {
  const { data: posts, isLoading, error } = useListBlogPosts();
  const createMutation = useCreateBlogPost();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = (data: any) => {
    createMutation.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        setIsDialogOpen(false);
        toast({ title: "Success", description: "Blog post created successfully" });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Thoughts & Writings</h1>
            <p className="text-xl text-muted-foreground">Essays on software engineering, architecture, and technology.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Write Post
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel p-8 rounded-2xl text-center">
            <p className="text-destructive">Failed to load posts. Please try again.</p>
          </div>
        ) : posts?.length === 0 ? (
          <div className="glass-panel p-16 rounded-2xl text-center flex flex-col items-center">
            <PenLine className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share your thoughts.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts?.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group glass-panel p-6 sm:p-8 rounded-2xl relative"
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <time dateTime={post.publishedAt}>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </time>
                  <div className="flex items-center gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-primary font-mono text-xs uppercase bg-primary/10 px-2 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="mt-6 flex items-center text-primary font-medium text-sm">
                  Read article <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <PostForm onSubmit={handleCreate} isPending={createMutation.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Importing here just for the icon in BlogList
import { ArrowRight } from "lucide-react";
