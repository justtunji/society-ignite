import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import sbaLogo from "@/assets/logos/sba-logo.png";
import { cldUrl } from "@/lib/cloudinary";
import { supabase } from "@/integrations/supabase/client";

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  external: boolean;
  cta_style: boolean;
  visible: boolean;
  parent_id: string | null;
  order_index: number;
  children?: NavigationItem[];
}

interface HeaderProps {
  logoUrl?: string;
  siteName: string;
}

const FALLBACK: NavigationItem[] = [
  { id: '1', label: 'Home', url: '/', external: false, cta_style: false, visible: true, parent_id: null, order_index: 0 },
  { id: '2', label: 'About', url: '/about', external: false, cta_style: false, visible: true, parent_id: null, order_index: 1 },
  { id: '3', label: 'Resources', url: '/resources', external: false, cta_style: false, visible: true, parent_id: null, order_index: 2 },
  { id: '4', label: 'Gallery', url: '/gallery', external: false, cta_style: false, visible: true, parent_id: null, order_index: 3 },
  { id: '5', label: 'Contact', url: '/contact', external: false, cta_style: false, visible: true, parent_id: null, order_index: 4 },
  { id: '6', label: 'Join Us', url: '/join-us', external: false, cta_style: true, visible: true, parent_id: null, order_index: 5 },
];

export const Header = ({ logoUrl, siteName }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NavigationItem[]>(FALLBACK);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('id,label,url,external,cta_style,visible,parent_id,order_index')
        .eq('visible', true)
        .order('order_index', { ascending: true });
      if (cancelled || error || !data || data.length === 0) return;
      setItems(data as NavigationItem[]);
    })();
    return () => { cancelled = true; };
  }, []);

  // Build tree
  const topLevel = items
    .filter(i => !i.parent_id)
    .map(i => ({
      ...i,
      children: items.filter(c => c.parent_id === i.id).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    }))
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const regularItems = topLevel.filter(i => !i.cta_style);
  const ctaItems = topLevel.filter(i => i.cta_style);

  const linkProps = (item: NavigationItem) => ({
    target: item.external ? "_blank" : undefined,
    rel: item.external ? "noopener noreferrer" : undefined,
  });

  return (
    <header
      data-section="header"
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
              src={logoUrl ? cldUrl(logoUrl, { h: 80, c: 'fit' }) : sbaLogo}
              alt={siteName}
              decoding="async"
              className={cn(
                "h-10 w-auto transition-all duration-300",
                !isScrolled && "brightness-0 invert"
              )}
            />
          </a>

          {/* Desktop Navigation */}
          <nav data-section="navigation" className="hidden lg:flex items-center space-x-8">
            {regularItems.map((item) => {
              const hasChildren = (item.children?.length ?? 0) > 0;
              const linkClasses = cn(
                "font-medium transition-colors relative py-2 inline-flex items-center gap-1",
                isScrolled
                  ? "text-foreground hover:text-accent"
                  : "text-primary-foreground hover:text-accent",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:scale-x-0 after:transition-transform hover:after:scale-x-100"
              );
              if (!hasChildren) {
                return (
                  <a key={item.id} href={item.url} {...linkProps(item)} className={linkClasses}>
                    {item.label}
                  </a>
                );
              }
              return (
                <div key={item.id} className="relative group">
                  <a href={item.url} {...linkProps(item)} className={linkClasses}>
                    {item.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </a>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 min-w-[200px]">
                    <div className="bg-background border border-border rounded-md shadow-lg py-2">
                      {item.children!.map(child => (
                        <a
                          key={child.id}
                          href={child.url}
                          {...linkProps(child)}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
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
              <a href="https://donate.stripe.com/8x23cucfY6fJeY08Vuf3a00" target="_blank" rel="noopener noreferrer">
                <Heart className="mr-1.5 h-4 w-4" />
                Donate / Support
              </a>
            </Button>
            {ctaItems.map((item) => (
              <Button
                key={item.id}
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"
              >
                <a href={item.url} {...linkProps(item)}>{item.label}</a>
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
          isOpen ? "max-h-[700px] overflow-y-auto" : "max-h-0"
        )}
      >
        <nav data-section="navigation-mobile" className="container-wide py-6 space-y-2">
          {regularItems.map((item) => (
            <div key={item.id}>
              <a
                href={item.url}
                {...linkProps(item)}
                className="block text-foreground hover:text-accent transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
              {item.children && item.children.length > 0 && (
                <div className="pl-4 space-y-1 border-l border-border ml-2">
                  {item.children.map(child => (
                    <a
                      key={child.id}
                      href={child.url}
                      {...linkProps(child)}
                      className="block text-sm text-muted-foreground hover:text-accent py-1.5"
                      onClick={() => setIsOpen(false)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground mt-4"
          >
            <a href="https://donate.stripe.com/8x23cucfY6fJeY08Vuf3a00" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
              <Heart className="mr-1.5 h-4 w-4" />
              Donate / Support
            </a>
          </Button>
          {ctaItems.map((item) => (
            <Button
              key={item.id}
              asChild
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
            >
              <a href={item.url} {...linkProps(item)} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};
