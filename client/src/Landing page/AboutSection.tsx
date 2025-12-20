import React, { useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef(null);
  const decorativeRef1 = useRef(null);
  const decorativeRef2 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from(imageRef.current, {
        opacity: 0,
        x: -100,
        scale: 0.8,
        duration: 1,
        ease: 'power3.out',
      })
      .from(decorativeRef1.current, {
        opacity: 0,
        rotation: -180,
        scale: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '-=0.5')
      .from(decorativeRef2.current, {
        opacity: 0,
        rotation: 180,
        scale: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '-=0.6')
      .from(badgeRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
      }, '-=0.8')
      .from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
      }, '-=0.5')
      .from(paragraphRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
      }, '-=0.4')
      .from(featuresRef.current, {
        opacity: 0,
        x: 50,
        stagger: 0.2,
        duration: 0.6,
      }, '-=0.3')
      .from(buttonRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
      }, '-=0.2');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div ref={imageRef} className="relative rounded-full overflow-hidden w-full max-w-[500px] mx-auto aspect-square">
              <img
                src="https://images.unsplash.com/photo-1633956051353-1754f9ecb500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjB2ZWdldGFibGVzJTIwYmFza2V0fGVufDF8fHx8MTc2NTcyMjM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Farmer with vegetables"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div ref={decorativeRef1} className="absolute -top-8 -left-8 w-32 h-32 opacity-30">
              <img src="https://images.unsplash.com/photo-1761070852353-c33a65a2aaec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHRvbWF0b2VzJTIwaGFydmVzdHxlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Tomatoes" className="w-full h-full object-cover rounded-full" />
            </div>
            <div ref={decorativeRef2} className="absolute -bottom-8 -right-8 w-32 h-32 opacity-30">
              <img src="https://images.unsplash.com/photo-1663441041574-274dc77d17bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY2Fycm90c3xlbnwxfHx8fDE3NjU2OTI2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Carrots" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>

          {/* Content Side */}
          <div>
            <div ref={badgeRef} className="inline-block bg-green-100 text-[#7ab42c] px-4 py-1 rounded-full mb-4">
              About Our Farm
            </div>
            <h2 ref={headingRef} className="text-4xl lg:text-5xl mb-6 text-[#1a4d3c]">
              Bringing nature's bounty<br />
              <span className="text-[#7ab42c]">to your farm</span>
            </h2>
            <p ref={paragraphRef} className="text-gray-600 mb-6">
              For over 30 years, we've been dedicated to sustainable farming practices 
              that respect the earth and deliver the freshest, most nutritious produce. 
              Our commitment to organic methods ensures that every harvest is both 
              environmentally friendly and exceptionally delicious.
            </p>
            
            <div className="space-y-4 mb-8">
              <div ref={el => featuresRef.current[0] = el} className="flex items-start gap-3">
                <CheckCircle className="text-[#7ab42c] flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-[#1a4d3c] mb-1">100% Organic Farming</h3>
                  <p className="text-gray-600 text-sm">
                    No pesticides or harmful chemicals used in our cultivation
                  </p>
                </div>
              </div>
              <div ref={el => featuresRef.current[1] = el} className="flex items-start gap-3">
                <CheckCircle className="text-[#7ab42c] flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-[#1a4d3c] mb-1">Sustainable Practices</h3>
                  <p className="text-gray-600 text-sm">
                    Committed to preserving the environment for future generations
                  </p>
                </div>
              </div>
              <div ref={el => featuresRef.current[2] = el} className="flex items-start gap-3">
                <CheckCircle className="text-[#7ab42c] flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-[#1a4d3c] mb-1">Farm to Table Fresh</h3>
                  <p className="text-gray-600 text-sm">
                    Direct delivery ensuring maximum freshness and nutrition
                  </p>
                </div>
              </div>
            </div>

            <button ref={buttonRef} className="bg-[#7ab42c] text-white px-8 py-3 rounded-md hover:bg-[#6a9c28] transition-colors flex items-center gap-2">
              Learn More <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}