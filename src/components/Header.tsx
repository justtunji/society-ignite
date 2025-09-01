import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  external: boolean;
  cta_style: boolean;
  visible: boolean;
}

interface HeaderProps {
  logoUrl?: string;
  siteName: string;
}

export const Header = ({ logoUrl, siteName }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);

  // Sample navigation - in production this would come from Supabase
  useEffect(() => {
    setNavigationItems([
      { id: '1', label: 'About', url: '/about', external: false, cta_style: false, visible: true },
      { id: '2', label: 'Programs', url: '/programs', external: false, cta_style: false, visible: true },
      { id: '3', label: 'Events', url: '/events', external: false, cta_style: false, visible: true },
      { id: '4', label: 'Resources', url: '/resources', external: false, cta_style: false, visible: true },
      { id: '5', label: 'Gallery', url: '/gallery', external: false, cta_style: false, visible: true },
      { id: '6', label: 'Blog', url: '/blog', external: false, cta_style: false, visible: true },
      { id: '7', label: 'Contact', url: '/contact', external: false, cta_style: false, visible: true },
      { id: '8', label: 'Donate', url: '/donate', external: false, cta_style: true, visible: true },
    ]);
  }, []);

  const regularItems = navigationItems.filter(item => item.visible && !item.cta_style);
  const ctaItems = navigationItems.filter(item => item.visible && item.cta_style);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/9071cb07-b6a6-474a-8089-4c0309c824c6.png" 
              alt={siteName}
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {regularItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-foreground hover:text-accent transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {ctaItems.map((item) => (
              <Button
                key={item.id}
                asChild
                variant="default"
                className="btn-accent"
              >
                <a
                  href={item.url}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  {item.label}
                </a>
              </Button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-background border-b border-border",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="px-4 py-4 space-y-4">
          {regularItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="block text-foreground hover:text-accent transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {ctaItems.map((item) => (
            <Button
              key={item.id}
              asChild
              variant="default"
              className="btn-accent w-full"
            >
              <a
                href={item.url}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};