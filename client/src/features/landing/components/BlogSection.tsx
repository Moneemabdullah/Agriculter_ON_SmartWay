import React, { useEffect, useRef } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function BlogSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const blogsRef = useRef<(HTMLDivElement | null)[]>([]);

  const blogs = [
    {
      image: 'https://images.unsplash.com/photo-1708796705570-33fd29ef67d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwZmFybWluZ3xlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Sustainable Farming Practices for Modern Agriculture',
      excerpt: 'Discover how sustainable farming methods can improve crop yields while protecting the environment.',
      date: 'Dec 10, 2025',
      author: 'John Smith',
    },
    {
      image: 'https://images.unsplash.com/photo-1609342332922-c1d9ace16697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBlYXRpbmclMjBoZWFsdGh5fGVufDF8fHx8MTc2NTcyMjM5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'The Benefits of Eating Organic Produce',
      excerpt: 'Learn why choosing organic vegetables can lead to a healthier lifestyle for you and your family.',
      date: 'Dec 8, 2025',
      author: 'Sarah Johnson',
    },
    {
      image: 'https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjU3MjIzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'From Field to Fork: Our Journey',
      excerpt: 'Follow the path of our produce from seed planting to your dinner table.',
      date: 'Dec 5, 2025',
      author: 'Mike Davis',
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
        scale: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
      })
      .from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
      }, '-=0.3')
      .from(blogsRef.current, {
        opacity: 0,
        y: 80,
        rotationX: -30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div ref={badgeRef} className="inline-block bg-green-100 text-[#7ab42c] px-4 py-1 rounded-full mb-4">
            Our Blog
          </div>
          <h2 ref={headingRef} className="text-4xl lg:text-5xl text-[#1a4d3c]">
            Cultivating a sustainable<br />
            <span className="text-[#7ab42c]">tomorrow</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              ref={el => blogsRef.current[index] = el}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{blog.author}</span>
                  </div>
                </div>
                <h3 className="text-xl text-[#1a4d3c] mb-3">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <button className="text-[#7ab42c] flex items-center gap-2 hover:gap-3 transition-all">
                  Read More <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}