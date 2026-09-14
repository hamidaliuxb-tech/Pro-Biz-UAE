import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Jurisdictions from "@/pages/Jurisdictions";
import Structuring from "@/pages/Structuring";
import Consultation from "@/pages/Consultation";
import About from "@/pages/About";
import Leadership from "@/pages/Leadership";
import Insights from "@/pages/Insights";
import Article from "@/pages/Article";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import { SiteProvider } from "@/lib/SiteContext";
import Legal from "@/pages/Legal";

let lenis = null;

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const NotFound = () => (
  <main className="bg-navy min-h-[70vh] flex items-center justify-center text-center px-6">
    <div>
      <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-4">404</p>
      <h1 className="font-serif text-4xl sm:text-5xl text-cream mb-6">This page has not been structured yet.</h1>
      <a href="/" data-testid="notfound-home-link" className="inline-block border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-navy transition-colors duration-300">Return to Homepage</a>
    </div>
  </main>
);

function App() {
  useEffect(() => {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  return (
    <div className="App">
      <SiteProvider>
      <BrowserRouter>
        <ScrollManager />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/jurisdictions" element={<Jurisdictions />} />
          <Route path="/structuring" element={<Structuring />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/legal/:page" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
      </SiteProvider>
    </div>
  );
}

export default App;
