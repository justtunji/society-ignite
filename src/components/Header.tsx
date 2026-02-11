import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import sbaLogo from "@/assets/logos/sba-logo.png";

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setNavigationItems([
      { id: '1', label: 'Home', url: '/', external: false, cta_style: false, visible: true },
      { id: '2', label: 'About', url: '/about', external: false, cta_style: false, visible: true },
      { id: '3', label: 'Resources', url: '/resources', external: false, cta_style: false, visible: true },
      { id: '4', label: 'Gallery', url: '/gallery', external: false, cta_style: false, visible: true },
      { id: '5', label: 'Contact', url: '/contact', external: false, cta_style: false, visible: true },
      { id: '6', label: 'Join Us', url: '/join-us', external: false, cta_style: true, visible: true },
    ]);
  }, []);

  const regularItems = navigationItems.filter(item => item.visible && !item.cta_style);
  const ctaItems = navigationItems.filter(item => item.visible && item.cta_style);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img 
              src={logoUrl || sbaLogo} 
              alt={siteName}
              className={cn(
                "h-10 w-auto transition-all duration-300",
                !isScrolled && "brightness-0 invert"
              )}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {regularItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "font-medium transition-colors relative py-2",
                  isScrolled 
                    ? "text-foreground hover:text-accent" 
                    : "text-primary-foreground hover:text-accent",
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:scale-x-0 after:transition-transform hover:after:scale-x-100"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full px-5",
                isScrolled 
                  ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground" 
                  : "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              )}
            >
              <a href="/join-us#part_spon">
                <Heart className="mr-1.5 h-4 w-4" />
                Donate / Sponsor
              </a>
            </Button>
            {ctaItems.map((item) => (
              <Button
                key={item.id}
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"
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
            className={cn(
              "lg:hidden p-2 transition-colors",
              isScrolled ? "text-foreground" : "text-primary-foreground"
            )}
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
          isOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <nav className="container-wide py-6 space-y-4">
          {regularItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="block text-foreground hover:text-accent transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <a href="/join-us#part_spon" onClick={() => setIsOpen(false)}>
              <Heart className="mr-1.5 h-4 w-4" />
              Donate / Sponsor
            </a>
          </Button>
          {ctaItems.map((item) => (
            <Button
              key={item.id}
              asChild
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
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
