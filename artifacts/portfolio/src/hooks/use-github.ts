import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { PORTFOLIO_CONFIG } from "@/lib/config";

const GithubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.string(),
});

export type GithubRepo = z.infer<typeof GithubRepoSchema>;

export function useGithubRepos() {
  return useQuery({
    queryKey: ["github-repos", PORTFOLIO_CONFIG.githubUsername],
    queryFn: async () => {
      const username = PORTFOLIO_CONFIG.githubUsername;
      if (!username) return [];

      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9`);
      if (!res.ok) {
        throw new Error("Failed to fetch GitHub repos");
      }
      
      const data = await res.json();
      // Parse and filter out invalid/empty repos robustly
      return z.array(GithubRepoSchema).parse(data);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
