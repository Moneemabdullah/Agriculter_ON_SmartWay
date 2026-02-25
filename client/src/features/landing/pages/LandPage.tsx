import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ImageGrid } from "../components/ImageGrid";
import { StatsSection } from "../components/StatsSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { ProductShowcase } from "../components/ProductShowcase";
import { BlogSection } from "../components/BlogSection";
import { NewsletterSection } from "../components/NewsletterSection";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Blog } from "../components/Blog";
import Changelog from "../components/Changelog";
import ContactPage from "../components/Contact";
import MainAbout from "./MainAbout";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  // 3s loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1a4d3c] flex items-center justify-center z-[100]">
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <div className="w-24 h-24 bg-[#7ab42c] rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-5xl">🌱</span>
            </div>
          </div>
          <h1 className="text-5xl text-white mb-6 animate-pulse">Smart Agri</h1>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#7ab42c] rounded-full animate-[loading_1s_linear_forwards]" />
          </div>
          <p className="text-white/80 mt-6 animate-fade-in">Growing Nature, Nurturing Future</p>
        </div>

        <style>{`
          @keyframes loading {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 1s ease-out 0.5s both; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {currentPage === 'blog' ? (
        <>
          <Blog /> 
          <Footer />
          <ScrollToTop />
        </>
      ) : currentPage === 'changelog' ? (
        <>
          <Changelog />
          <Footer />
          <ScrollToTop />
        </>
      ) : currentPage === 'contact' ? (
        <>
          <ContactPage />
          <Footer />
          <ScrollToTop />
        </>
      ) : currentPage === 'about' ? (
        <>
          <MainAbout />
        </>
      ) : (
        <>
          <Header />
          <HeroSection />
          <AboutSection />
          <ImageGrid />
          <StatsSection />
          <FeaturesSection />
          <ProductShowcase />
          <BlogSection /> 
          <NewsletterSection />
          <Footer />
          <ScrollToTop />
        </>
      )}
    </div>
  );
}
