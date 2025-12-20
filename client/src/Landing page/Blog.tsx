import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, ArrowRight, Search, Tag, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1708796705570-33fd29ef67d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwZmFybWluZ3xlbnwxfHx8fDE3NjU3MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Sustainable Farming Practices for Modern Agriculture',
    excerpt: 'Discover how sustainable farming methods can improve crop yields while protecting the environment for future generations.',
    date: 'Dec 16, 2024',
    author: 'John Smith',
    category: 'Sustainability',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1609342332922-c1d9ace16697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBlYXRpbmclMjBoZWFsdGh5fGVufDF8fHx8MTc2NTcyMjM5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'The Benefits of Eating Organic Produce',
    excerpt: 'Learn why choosing organic vegetables can lead to a healthier lifestyle for you and your family.',
    date: 'Dec 14, 2024',
    author: 'Sarah Johnson',
    category: 'Health',
    readTime: '6 min read',
    featured: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjU3MjIzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'From Field to Fork: Our Journey',
    excerpt: 'Follow the path of our produce from seed planting to your dinner table.',
    date: 'Dec 12, 2024',
    author: 'Mike Davis',
    category: 'Farm Life',
    readTime: '5 min read',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1657288649124-b80bdee3c17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybWluZyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzY1ODg5OTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Organic Farming: A Complete Guide',
    excerpt: 'Everything you need to know about starting your own organic farming journey.',
    date: 'Dec 10, 2024',
    author: 'Emma Wilson',
    category: 'Guides',
    readTime: '10 min read',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1758158286655-f0d93d86e174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZmllbGR8ZW58MXx8fHwxNzY1ODE1NjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Building Sustainable Agriculture Systems',
    excerpt: 'Explore innovative techniques for creating long-term sustainable farming practices.',
    date: 'Dec 8, 2024',
    author: 'Robert Chen',
    category: 'Sustainability',
    readTime: '7 min read',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1622383568506-4774b018cd5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwaGFydmVzdCUyMHByb2R1Y2V8ZW58MXx8fHwxNzY1ODkyNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Maximizing Your Harvest Season',
    excerpt: 'Tips and tricks for getting the most out of your harvest while maintaining quality.',
    date: 'Dec 6, 2024',
    author: 'Lisa Martinez',
    category: 'Farming Tips',
    readTime: '6 min read',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1623851692885-27a0a57b1acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwcGxhbnRzJTIwZ3Jvd2luZ3xlbnwxfHx8fDE3NjU4OTI3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Modern Greenhouse Farming Techniques',
    excerpt: 'Discover how greenhouse technology is revolutionizing year-round crop production.',
    date: 'Dec 4, 2024',
    author: 'David Kim',
    category: 'Technology',
    readTime: '9 min read',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1694093817187-0c913bc4ad87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjB3b3JraW5nJTIwZmllbGR8ZW58MXx8fHwxNzY1ODkyNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'A Day in the Life of a Modern Farmer',
    excerpt: 'Experience the daily routines and challenges faced by today\'s agricultural professionals.',
    date: 'Dec 2, 2024',
    author: 'James Anderson',
    category: 'Farm Life',
    readTime: '5 min read',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzY1ODgxMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Farm to Market: Distribution Strategies',
    excerpt: 'Learn effective strategies for bringing your fresh produce to local markets.',
    date: 'Nov 30, 2024',
    author: 'Patricia Lee',
    category: 'Business',
    readTime: '8 min read',
  },
];

const categories = ['All', 'Sustainability', 'Health', 'Farm Life', 'Guides', 'Farming Tips', 'Technology', 'Business'];

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const postsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Filter posts based on category and search
    let filtered = blogPosts;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    // Hero animation
    // gsap.from(heroRef.current, {
    //   opacity: 0,
    //   y: -50,
    //   duration: 1,
    //   ease: 'power3.out',
    // });

    // // Search bar animation
    // gsap.from(searchRef.current, {
    //   opacity: 0,
    //   y: 30,
    //   duration: 0.8,
    //   delay: 0.3,
    //   ease: 'power3.out',
    // });

    // Categories animation
    // gsap.from(categoriesRef.current, {
    //   opacity: 0,
    //   y: 30,
    //   duration: 0.8,
    //   delay: 0.5,
    //   ease: 'power3.out',
    // });
  }, []);

  useEffect(() => {
    // Animate blog posts when they change
    postsRef.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out',
          }
        );
      }
    });
  }, [filteredPosts]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative bg-gradient-to-r from-[#1a4d3c] to-[#2a6d5c] text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1609148934713-e61b6dd14929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwZmllbGQlMjB0cmFjdG9yfGVufDF8fHx8MTc2NTcyMjM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <button
              onClick={() => window.location.hash = ''}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
            <br/> 
            <div className="inline-block bg-[#7ab42c] text-white px-4 py-1 rounded-full mb-4">
              Our Blog
            </div>
            
            <h1 className="text-5xl lg:text-6xl mb-4">
              Stories from the Farm
            </h1>
            
            <p className="text-xl text-white/90">
              Insights, tips, and updates from the world of sustainable agriculture
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div ref={searchRef} className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#7ab42c] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div ref={categoriesRef} className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full transition-all ${
                      selectedCategory === category
                        ? 'bg-[#7ab42c] text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    ref={el => postsRef.current[index] = el}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#7ab42c] text-white px-3 py-1 rounded-full text-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl text-[#1a4d3c] mb-3 group-hover:text-[#7ab42c] transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={16} />
                          <span>{post.author}</span>
                        </div>
                        
                        <button className="text-[#7ab42c] flex items-center gap-2 hover:gap-3 transition-all">
                          Read More <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl text-gray-600 mb-2">No posts found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Featured Posts */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-[#7ab42c]" size={24} />
                <h3 className="text-xl text-[#1a4d3c]">Featured Posts</h3>
              </div>
              
              <div className="space-y-4">
                {featuredPosts.map(post => (
                  <div key={post.id} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm text-[#1a4d3c] mb-1 line-clamp-2 group-hover:text-[#7ab42c] transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="text-[#7ab42c]" size={24} />
                <h3 className="text-xl text-[#1a4d3c]">Categories</h3>
              </div>
              
              <div className="space-y-2">
                {categories.filter(cat => cat !== 'All').map(category => {
                  const count = blogPosts.filter(post => post.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#7ab42c] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{category}</span>
                      <span className={`text-sm ${
                        selectedCategory === category ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-[#1a4d3c] to-[#2a6d5c] text-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl mb-3">Stay Updated</h3>
              <p className="text-sm text-white/80 mb-4">
                Get the latest farming tips and stories delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg mb-3 text-white focus:outline-none ring-2 ring-[#7ab42c]"
              />
              <button className="w-full bg-[#7ab42c] text-white py-2 rounded-lg hover:bg-[#6a9c28] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
