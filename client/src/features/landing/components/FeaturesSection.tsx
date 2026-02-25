import React, { useEffect, useRef } from 'react';
import { Sprout, Droplet, Sun, Recycle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: <Sprout size={48} />,
      title: 'Organic Seeds',
      description: 'We use only certified organic, non-GMO seeds for all our crops.',
    },
    {
      icon: <Droplet size={48} />,
      title: 'Water Conservation',
      description: 'Advanced irrigation systems to minimize water usage and waste.',
    },
    {
      icon: <Sun size={48} />,
      title: 'Solar Powered',
      description: 'Renewable energy powers our facilities, reducing carbon footprint.',
    },
    {
      icon: <Recycle size={48} />,
      title: 'Zero Waste',
      description: 'Composting and recycling programs ensure nothing goes to waste.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
      })
      .from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
      }, '-=0.3')
      .from(featuresRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.8,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '-=0.4');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div ref={badgeRef} className="inline-block bg-green-100 text-[#7ab42c] px-4 py-1 rounded-full mb-4">
            Why Choose Us
          </div>
          <h2 ref={headingRef} className="text-4xl lg:text-5xl text-[#1a4d3c]">
            Harvesting dreams one<br />
            <span className="text-[#7ab42c]">crop at a time</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => featuresRef.current[index] = el}
              className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#7ab42c] mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl text-[#1a4d3c] mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}