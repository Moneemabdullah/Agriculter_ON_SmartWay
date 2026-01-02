import React, { useState, useEffect, useRef } from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ProductShowcase() {
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const productsRef = useRef<(HTMLDivElement | null)[]>([]);

  const products = [
    {
      image: 'https://images.unsplash.com/photo-1761070852353-c33a65a2aaec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHRvbWF0b2VzJTIwaGFydmVzdHxlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      price: 'TK 120',
      rating: 5,
    },
    {
      image: 'https://images.unsplash.com/photo-1663441041574-274dc77d17bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY2Fycm90c3xlbnwxfHx8fDE3NjU2OTI2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      name: 'Organic Carrots',
      category: 'Root Vegetables',
      price: 'TK 90',
      rating: 5,
    },
    {
      image: 'https://images.unsplash.com/photo-1757332334667-d2e75d5816ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJlbGwlMjBwZXBwZXJzfGVufDF8fHx8MTc2NTcyMjM5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      name: 'Bell Peppers',
      category: 'Vegetables',
      price: 'TK 100',
      rating: 5,
    },
    {
      image: 'https://images.unsplash.com/photo-1730815046052-75a1b90117e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJiYWdlJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc2NTcwMDAzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      name: 'Fresh Cabbage',
      category: 'Leafy Greens',
      price: 'Tk 110',
      rating: 4,
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
      .from(productsRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '-=0.4');
    });

    return () => ctx.revert();
  }, []);

  const addToCart = (product: any, index: number) => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add product to cart
    cart.push({
      ...product,
      quantity: 1,
    });
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show feedback
    setAddedToCart(index);
    setTimeout(() => setAddedToCart(null), 2000);

    // Dispatch custom event to notify header of cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div ref={badgeRef} className="inline-block bg-green-100 text-[#7ab42c] px-4 py-1 rounded-full mb-4">
            Our Products
          </div>
          <h2 ref={headingRef} className="text-4xl lg:text-5xl text-[#1a4d3c]">
            Nourishing the world<br />
            <span className="text-[#7ab42c]">from seed to table</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              ref={el => productsRef.current[index] = el}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-[#7ab42c] text-white px-3 py-1 rounded-full text-sm">
                  Organic
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                <h3 className="text-xl text-[#1a4d3c] mb-3">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-[#7ab42c]">{product.price}</span>
                  <button 
                    onClick={() => addToCart(product, index)}
                    className={`p-3 rounded-lg transition-all ${
                      addedToCart === index
                        ? 'bg-green-500 text-white'
                        : 'bg-[#7ab42c] text-white hover:bg-[#6a9c28]'
                    }`}
                  >
                    {addedToCart === index ? <Check size={20} /> : <ShoppingCart size={20} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}