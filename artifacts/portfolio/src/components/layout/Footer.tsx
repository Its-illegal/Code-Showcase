import { PORTFOLIO_CONFIG } from "@/lib/config";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-muted-foreground text-sm text-center md:text-left mb-6 md:mb-0">
          © {new Date().getFullYear()} {PORTFOLIO_CONFIG.name}. Built with React, Vite & Tailwind.
        </p>
        <div className="flex space-x-6">
          <a href={PORTFOLIO_CONFIG.socials.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href={PORTFOLIO_CONFIG.socials.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href={PORTFOLIO_CONFIG.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href={PORTFOLIO_CONFIG.socials.email} className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
