import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface FooterProps {
  siteName: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialX?: string;
  socialLinkedin?: string;
  socialInstagram?: string;
  footerBlurb?: string;
}

export const Footer = ({ 
  siteName, 
  contactEmail, 
  contactPhone, 
  address, 
  socialX, 
  socialLinkedin, 
  socialInstagram,
  footerBlurb 
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/society-of-black-academics/', icon: 'in' },
    { name: 'YouTube', href: 'https://www.youtube.com/channel/UC2mDgBLZlUUjipwEHVZuy-w', icon: '📺' },
    { name: 'Instagram', href: 'https://www.instagram.com/societyofblackacademics/', icon: '📷' },
    { name: 'X (Twitter)', href: 'https://twitter.com/SocietyBlackAca', icon: '𝕏' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-medium">{siteName}</h3>
            <p className="text-primary-foreground/80 max-w-md leading-relaxed">
              {footerBlurb || "Driving inclusive change in higher education by supporting Black academics through mentorship, research, and community building."}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              {contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contactEmail}
                  </a>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a 
                    href={`tel:${contactPhone}`}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contactPhone}
                  </a>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span className="text-primary-foreground/80">
                    {address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm group"
                >
                  <span className="text-base">{link.icon}</span>
                  {link.name}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-primary-foreground/80 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary-foreground/80 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};