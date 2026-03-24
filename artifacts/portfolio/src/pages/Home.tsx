import { motion } from "framer-motion";
import { ArrowRight, Code2, GitBranch, Star, Terminal } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_CONFIG } from "@/lib/config";
import { useGithubRepos } from "@/hooks/use-github";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { HeroCodePanel } from "@/components/hero/HeroCodePanel";
import { HeroSnake } from "@/components/hero/HeroSnake";

export function Home() {
  const { data: repos, isLoading: reposLoading } = useGithubRepos();

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract minimal tech background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
        </div>

        {/* Python snake — weaves above bg, below content */}
        <HeroSnake />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-center md:text-left"
            >
              <h2 className="text-primary font-mono tracking-wider uppercase text-sm md:text-base mb-4 inline-block glass-panel px-4 py-1.5 rounded-full">
                Welcome to my digital space
              </h2>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6">
                Hi, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {PORTFOLIO_CONFIG.name}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
                {PORTFOLIO_CONFIG.bio}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Button asChild size="lg">
                  <a href="#repos">
                    View Projects <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link href="/blog">Read My Blog</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex-shrink-0 w-full md:w-auto"
            >
              <HeroCodePanel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* GITHUB REPOS SECTION */}
      <section id="repos" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Open Source</h2>
              <p className="text-muted-foreground mt-1">Live from GitHub @{PORTFOLIO_CONFIG.githubUsername}</p>
            </div>
          </div>

          {reposLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos?.map((repo, idx) => (
                <motion.a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group glass-panel p-6 rounded-2xl flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
                >
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-muted-foreground" />
                    {repo.name}
                  </h3>
                  <p className="text-muted-foreground mt-3 flex-grow text-sm line-clamp-3">
                    {repo.description || "No description available."}
                  </p>
                  <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground font-mono">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" /> {repo.forks_count}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PYTHON SHOWCASE SECTION */}
      <section className="py-20 relative bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Python Lab</h2>
              <p className="text-muted-foreground mt-1">Curated snippets and engineering experiments.</p>
            </div>
          </div>

          <div className="space-y-16">
            {PORTFOLIO_CONFIG.pythonProjects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row gap-8 items-start ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 w-full space-y-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">{project.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-[1.5] w-full max-w-full overflow-hidden">
                  <MarkdownRenderer 
                    content={`\`\`\`python\n${project.code}\n\`\`\``} 
                    className="[&_div.rounded-xl]:my-0 shadow-2xl" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
