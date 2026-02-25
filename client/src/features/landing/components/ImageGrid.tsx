import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ImageGrid() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

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
        scale: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
      })
      .from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
      }, '-=0.3')
      .from(imagesRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div ref={badgeRef} className="inline-block bg-green-100 text-[#7ab42c] px-4 py-1 rounded-full mb-4">
            Our Gallery
          </div>
          <h2 ref={headingRef} className="text-4xl lg:text-5xl text-[#1a4d3c]">
            Bringing nature's bounty<br />
            <span className="text-[#7ab42c]">to your table</span>
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Image - Spans 2 columns on desktop */}
          <div ref={el => imagesRef.current[0] = el} className="lg:col-span-2 lg:row-span-2">
            <div className="relative h-[400px] lg:h-full rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1761070852353-c33a65a2aaec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHRvbWF0b2VzJTIwaGFydmVzdHxlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fresh tomatoes"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl mb-2">Fresh Harvest</h3>
                  <p>Organic tomatoes picked at peak ripeness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Small Image 1 */}
          <div ref={el => imagesRef.current[1] = el} className="h-[300px] lg:h-auto">
            <div className="relative h-full rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1596415340783-e459d0757527?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBmaWVsZCUyMHN1bnNldHxlbnwxfHx8fDE3NjU3MjIzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Farmer in field"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="mb-1">Sunset Farming</h3>
                  <p className="text-sm">Working the land</p>
                </div>
              </div>
            </div>
          </div>

          {/* Small Image 2 */}
          <div ref={el => imagesRef.current[2] = el} className="h-[300px] lg:h-auto">
            <div className="relative h-full rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1659038025134-5f47bf7956c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwZXMlMjB2aW5leWFyZHxlbnwxfHx8fDE3NjU2MDc0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Grapes vineyard"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="mb-1">Vineyard</h3>
                  <p className="text-sm">Fresh grapes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medium Image 1 */}
          <div ref={el => imagesRef.current[3] = el} className="h-[300px] lg:h-auto">
            <div className="relative h-full rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1570913182974-40e1158b780a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBob2xkaW5nJTIwcHJvZHVjZXxlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Farmer holding produce"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="mb-1">Quality Produce</h3>
                  <p className="text-sm">Hand-selected vegetables</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medium Image 2 */}
          <div ref={el => imagesRef.current[4] = el} className="h-[300px] lg:h-auto lg:col-span-2">
            <div className="relative h-full rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1708796705570-33fd29ef67d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwZmFybWluZ3xlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Greenhouse farming"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl mb-2">Modern Greenhouse</h3>
                  <p>Sustainable indoor farming technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}