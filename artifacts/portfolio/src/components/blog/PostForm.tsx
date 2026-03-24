import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateBlogPost, BlogPost } from "@workspace/api-client-react";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().min(5, "Excerpt is required"),
  tags: z.string(), // We'll convert this to array on submit
});

type FormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: BlogPost;
  onSubmit: (data: CreateBlogPost) => void;
  isPending: boolean;
}

export function PostForm({ initialData, onSubmit, isPending }: PostFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      content: initialData.content,
      excerpt: initialData.excerpt,
      tags: initialData.tags.join(", "),
    } : {
      title: "",
      content: "",
      excerpt: "",
      tags: "",
    },
  });

  const submitHandler = (values: FormValues) => {
    onSubmit({
      title: values.title,
      content: values.content,
      excerpt: values.excerpt,
      tags: values.tags.split(",").map(t => t.trim()).filter(Boolean),
      publishedAt: initialData?.publishedAt || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5 mt-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
        <Input {...register("title")} placeholder="e.g. Building an Async Pipeline" />
        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt</label>
        <Input {...register("excerpt")} placeholder="Short summary..." />
        {errors.excerpt && <p className="text-destructive text-sm mt-1">{errors.excerpt.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Tags (comma separated)</label>
        <Input {...register("tags")} placeholder="Python, Async, Data" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Content (Markdown)</label>
        <Textarea 
          {...register("content")} 
          placeholder="Write your post here using Markdown..."
          className="min-h-[250px] font-mono"
        />
        {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
