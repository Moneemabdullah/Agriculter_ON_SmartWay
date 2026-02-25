import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const sectionRef = useRef(null);
  const iconRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const formRef = useRef(null);
  const noteRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from(iconRef.current, {
        opacity: 0,
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
      .from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
      }, '-=0.4')
      .from(paragraphRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
      }, '-=0.4')
      .from(formRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
      }, '-=0.3')
      .from(noteRef.current, {
        opacity: 0,
        duration: 0.5,
      }, '-=0.2');
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#1a4d3c] text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1570966087241-20278ac27b2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBoYXBweSUyMGZpZWxkfGVufDF8fHx8MTc2NTcyMjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div ref={iconRef} className="w-16 h-16 bg-[#7ab42c] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h2 ref={headingRef} className="text-4xl lg:text-5xl mb-6">
            Subscribe to our<br />
            <span className="text-[#7ab42c]">newsletter</span>
          </h2>
          <p ref={paragraphRef} className="text-gray-300 mb-8 text-lg">
            Get the latest updates on new products, farming tips, and exclusive offers 
            delivered straight to your inbox.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 rounded-lg text-white focus:outline-none ring-2 ring-[#7ab42c]"
            />
            <button
              type="submit"
              className="bg-[#7ab42c] text-white px-8 py-4 rounded-lg hover:bg-[#6a9c28] transition-colors flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight size={20} />
            </button>
          </form>

          <p ref={noteRef} className="text-sm text-gray-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}