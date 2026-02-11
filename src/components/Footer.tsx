import { Mail, MapPin } from "lucide-react";
import sbaLogo from "@/assets/logos/sba-logo.png";

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

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Resources', href: '/resources' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    { name: 'Join Us', href: '/join-us' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: socialLinkedin || 'https://www.linkedin.com/company/society-of-black-academics/' },
    { name: 'YouTube', href: 'https://www.youtube.com/channel/UC2mDgBLZlUUjipwEHVZuy-w' },
    { name: 'Instagram', href: socialInstagram || 'https://www.instagram.com/societyofblackacademics/' },
    { name: 'X (Twitter)', href: socialX || 'https://x.com/SocietyBlackAca' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container-wide py-16 lg:py-24">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-block mb-6">
              <img 
                src={sbaLogo} 
                alt={siteName}
                className="h-12 w-auto brightness-0 invert"
              />
            </a>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-md mb-8">
              {footerBlurb || "Driving inclusive change in higher education by supporting Black academics through mentorship, research, and community building."}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactEmail && (
                <div className="flex items-center gap-3 text-primary-foreground/70">
                  <Mail className="h-5 w-5" />
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {contactEmail}
                  </a>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-3 text-primary-foreground/70">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Connect With Us</h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
            <p>© {currentYear} {siteName}. All rights reserved.</p>
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
