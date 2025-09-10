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
      { id: '1', label: 'Home', url: '/', external: false, cta_style: false, visible: true },
      { id: '2', label: 'About Us', url: '/about', external: false, cta_style: false, visible: true },
      { id: '3', label: 'Resources', url: '/resources', external: false, cta_style: false, visible: true },
      { id: '4', label: 'Gallery', url: '/gallery', external: false, cta_style: false, visible: true },
      { id: '5', label: 'Contact Us', url: '/contact', external: false, cta_style: false, visible: true },
      { id: '6', label: 'Join Us', url: '/join-us', external: false, cta_style: true, visible: true },
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
              src="/lovable-uploads/logo@2x.png" 
              alt={siteName}
              className="h-10 w-auto bg-transparent"
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
                className="text-foreground hover:text-foreground transition-colors font-medium relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-black"
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
              className="block text-foreground hover:text-foreground transition-colors font-medium relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-black"
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
