import React, { useEffect, useRef } from 'react'
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from "react-router-dom";
import { gsap } from 'gsap'

export function HeroSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: 'power4.out',
          duration: 1.2,
        },
      })

      tl.from('.hero-badge', {
        y: 20,
        opacity: 0,
      })
        .from(
          '.hero-title',
          {
            y: 60,
            opacity: 0,
          },
          '-=0.6'
        )
        .from(
          '.hero-title span',
          {
            y: 40,
            opacity: 0,
          },
          '-=0.8'
        )
        .from(
          '.hero-desc',
          {
            y: 30,
            opacity: 0,
          },
          '-=0.7'
        )
        .from(
          '.hero-buttons button',
          {
            y: 20,
            opacity: 0,
            stagger: 0.15,
          },
          '-=0.6'
        )
        .from(
          '.hero-image',
          {
            scale: 0.9,
            opacity: 0,
          },
          '-=1'
        )
        .from(
          '.hero-badge-circle',
          {
            scale: 0.6,
            opacity: 0,
            ease: 'expo.out',
          },
          '-=0.6'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[600px] lg:min-h-[95vh] flex items-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1609148934713-e61b6dd14929)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d3c]/80 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="text-white">
            <div className="hero-badge inline-block bg-[#7ab42c] px-4 py-1 rounded-full mb-4">
              Welcome to FarmHub
            </div>

            <h1 className="hero-title text-5xl lg:text-[86px] mb-6 font-bold">
              Plowing the earth{' '}
              <span className="text-[#7ab42c] block">
                harvesting hope
              </span>
            </h1>

            <p className="hero-desc text-2xl mb-8 text-gray-200">
              We cultivate excellence in every seed, nurturing sustainable
              farming practices that bring the finest organic produce from our
              fields to your table.
            </p>

            <div className="hero-buttons flex flex-wrap gap-4">
            <Link to="/logs">
              <button 
                onClick={() => window.location.hash = '#changelog'}
                className="bg-[#7ab42c] text-white px-8 py-3 rounded-md hover:bg-[#6a9c28] transition-colors flex items-center gap-2"
              >
                Changelog <FileText size={20} />
              </button>
            </Link>

              <button className="bg-white text-[#1a4d3c] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative hero-image">
              <div className="w-[400px] h-[400px] rounded-full overflow-hidden border-8 border-[#7ab42c] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1633956051353-1754f9ecb500"
                  alt="Fresh vegetables"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="hero-badge-circle absolute -bottom-4 -right-4 w-24 h-24 bg-[#7ab42c] rounded-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs">Organic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
