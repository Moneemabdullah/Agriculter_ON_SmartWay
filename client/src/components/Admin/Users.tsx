import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Users, Search, Mail, Shield, MoreHorizontal, 
  UserPlus, UserX, Filter, CheckCircle, Trash2, Ban 
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned?: boolean;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const data = res.data?.data || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Search Logic ---
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Admin Action Handlers ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleBan = async (id: string) => {
    try {
      await api.patch(`/users/ban/${id}`);
      fetchUsers(); // Refresh list to see updated status
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Identities...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header with Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-emerald-600" size={32} /> User Directory
          </h1>
          <p className="text-slate-500 mt-1">Search and manage platform access levels.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* SEARCH BAR IMPLEMENTATION */}
          <div className="relative flex-1 lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-11 pr-4 bg-white border-slate-200 rounded-2xl focus:ring-emerald-500 h-12 shadow-sm border-2 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl px-6 h-12 font-bold shadow-lg shadow-slate-200">
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-50">
          <CardTitle className="text-xl font-bold text-slate-800">Master List</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Profile</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="group hover:bg-slate-50/40 transition-all duration-200">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm transition-all ${user.isBanned ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-600 group-hover:border-emerald-200'}`}>
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${user.isBanned ? 'text-slate-400 line-through' : 'text-slate-900'} transition-colors`}>
                              {user.name}
                            </p>
                            <div className="flex items-center text-[11px] text-slate-400 gap-1 font-medium">
                              <Mail size={10} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Badge className={`px-3 py-1 rounded-lg border text-[10px] font-black tracking-widest uppercase shadow-none 
                          ${user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          <Shield size={10} className="mr-1" /> {user.role}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        {user.isBanned ? (
                          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-tighter">
                            <Ban size={14} /> Banned Access
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                            <CheckCircle size={14} /> Active
                          </div>
                        )}
                      </td>
                      {/* ACTION BUTTONS (DELETE & BANNED) */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleBan(user._id)}
                            className={`h-8 w-8 p-0 rounded-lg transition-colors ${user.isBanned ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                            title={user.isBanned ? "Unban User" : "Ban User"}
                          >
                            <Ban size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(user._id)}
                            className="h-8 w-8 p-0 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <UserX className="h-12 w-12 text-slate-200 mb-4" />
                        <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Identity not found</h3>
                        <p className="text-slate-300 text-[10px] mt-1 italic">Try searching with a different name or email</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;