import React, { useEffect, useRef } from 'react';
import { TrendingUp, Users, Award, Leaf } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function StatsSection() {
  const sectionRef = useRef(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stats = [
    {
      icon: <TrendingUp size={40} />,
      value: '200+',
      label: 'Acres Farmed',
    },
    {
      icon: <Users size={40} />,
      value: '300+',
      label: 'Happy Clients',
    },
    {
      icon: <Award size={40} />,
      value: '100+',
      label: 'Awards Won',
    },
    {
      icon: <Leaf size={40} />,
      value: '700+',
      label: 'Organic Products',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      statsRef.current.forEach((stat, index) => {
        gsap.from(stat, {
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          scale: 0.5,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'back.out(1.7)',
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              ref={el => statsRef.current[index] = el}
              className="text-center"
            >
              <div className="flex justify-center mb-4 text-[#7ab42c]">
                {stat.icon}
              </div>
              <div className="text-4xl lg:text-5xl text-[#1a4d3c] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}