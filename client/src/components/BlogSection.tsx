import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { 
  Heart, 
  Trash2, 
  Plus, 
  Sprout, 
  Search, 
  Filter,
  MessageSquare
} from 'lucide-react';
import { Badge } from './ui/badge';

interface Blog {
  _id: string;
  title: string;
  content: string;
  likes: number;
  owner: {
    username: string;
    email: string;
  };
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter logic: Matches title or content (case-insensitive)
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createBlog = async () => {
    if (!title || !content) return alert('Title & content required');
    setLoading(true);
    try {
      await api.post('/blogs', {
        title,
        content,
        owner: localStorage.getItem('userId'),
      });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
      fetchBlogs();
    } finally {
      setLoading(false);
    }
  };

  const likeBlog = async (id: string) => {
    await api.post(`/blogs/${id}/like`);
    fetchBlogs();
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Delete this agronomy update?')) return;
    await api.delete(`/blogs/${id}`);
    fetchBlogs();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      
      {/* --- TOP BAR & MODAL TRIGGER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sprout className="text-green-600" /> Farm Intelligence
          </h1>
          <p className="text-sm text-gray-500">Community insights and field observations</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 gap-2 px-6">
              <Plus size={18} /> Create Post
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-131.25 rounded-2xl bg-white border border-gray-200 shadow-2xl p-0 overflow-hidden">
            <div className="h-1.5 bg-green-600 w-full" />
            <DialogHeader className="px-6 pt-6 text-left">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                New Agriculture Post
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Share your findings, crop status, or sensor data with the community.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <Input 
                  placeholder="e.g., Soil PH levels in Sector B" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Content</label>
                <Textarea 
                  placeholder="What's happening on the farm?" 
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                />
              </div>
            </div>

            <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100 mt-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={createBlog} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md px-8"
              >
                {loading ? "Publishing..." : "Publish Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10 bg-white border-none shadow-sm focus-visible:ring-green-500" 
            placeholder="Search insights by title or content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm gap-2">
          <Filter size={18} /> Filter
        </Button>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <Card key={blog._id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-none font-medium">
                  Agronomy
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-red-500 p-0 h-6 w-6 transition-colors"
                  onClick={() => deleteBlog(blog._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                {blog.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                {blog.content}
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-green-200 shadow-sm">
                    {blog.owner?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">{blog.owner?.username}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Contributor</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-pink-500 hover:bg-pink-50 rounded-full px-3"
                  onClick={() => likeBlog(blog._id)}
                >
                  <Heart size={16} className={`mr-1.5 transition-all ${blog.likes > 0 ? 'fill-current scale-110' : ''}`} />
                  {blog.likes}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* --- EMPTY STATE --- */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <MessageSquare className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold text-lg">
            {searchTerm ? "No results found" : "No insights found"}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? `Try searching for something else than "${searchTerm}"` : "Start the conversation by clicking 'Create Post' above."}
          </p>
          {searchTerm && (
            <Button 
              variant="link" 
              className="mt-2 text-green-600"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}