import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import JoinUs from "./pages/JoinUs";
import NotFound from "./pages/NotFound";
import Programs from "./pages/Programs";

// Admin pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const SiteSettingsAdmin = lazy(() => import("./pages/admin/SiteSettingsAdmin"));
const NavigationAdmin = lazy(() => import("./pages/admin/NavigationAdmin"));
const PartnersAdmin = lazy(() => import("./pages/admin/PartnersAdmin"));
const TeamAdmin = lazy(() => import("./pages/admin/TeamAdmin"));
const GalleryAdmin = lazy(() => import("./pages/admin/GalleryAdmin"));
const EventsAdmin = lazy(() => import("./pages/admin/EventsAdmin"));
const ProgramsAdmin = lazy(() => import("./pages/admin/ProgramsAdmin"));
const PromotionsAdmin = lazy(() => import("./pages/admin/PromotionsAdmin"));
const ResourcesAdmin = lazy(() => import("./pages/admin/ResourcesAdmin"));
const StoriesAdmin = lazy(() => import("./pages/admin/StoriesAdmin"));
const CommunitiesAdmin = lazy(() => import("./pages/admin/CommunitiesAdmin"));
const ContactsAdmin = lazy(() => import("./pages/admin/ContactsAdmin"));

const queryClient = new QueryClient();

const AdminFallback = () => <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/programs" element={<Programs />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="site-settings" element={<SiteSettingsAdmin />} />
              <Route path="navigation" element={<NavigationAdmin />} />
              <Route path="partners" element={<PartnersAdmin />} />
              <Route path="team" element={<TeamAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="programs" element={<ProgramsAdmin />} />
              <Route path="promotions" element={<PromotionsAdmin />} />
              <Route path="resources" element={<ResourcesAdmin />} />
              <Route path="stories" element={<StoriesAdmin />} />
              <Route path="communities" element={<CommunitiesAdmin />} />
              <Route path="contacts" element={<ContactsAdmin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
