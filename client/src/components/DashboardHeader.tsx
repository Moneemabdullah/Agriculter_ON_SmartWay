import React from 'react';
import { Bell, Menu, Settings, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 shadow-sm">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div className="hidden md:block">
            <h1 className="font-semibold text-gray-800">Smart Agriculture</h1>
            <p className="text-sm text-gray-500">Monitoring System</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs shadow-sm">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="flex w-full items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Low Soil Moisture Alert</span>
                </div>
                <p className="text-sm text-gray-500">
                  Field A requires irrigation
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="flex w-full items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>High Temperature Warning</span>
                </div>
                <p className="text-sm text-gray-500">
                  Temperature reached 35°C
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="flex w-full items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Irrigation Completed</span>
                </div>
                <p className="text-sm text-gray-500">
                  Field B watered successfully
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [avatar, setAvatar] = React.useState<string | null>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUserName(null);
        setAvatar(null);
        return;
      }

      setIsAuthenticated(true);

      try {
        const api = (await import('../utils/axios')).default;
        const res = await api.get('/auth/me');

        if (res.data?.success) {
          setUserName(
            res.data.data.name ||
              res.data.data.email ||
              'User'
          );
        }
      } catch (err) {
        console.warn('Could not fetch user', err);
      }
    };

    checkAuth();

    const onAuthChanged = () => checkAuth();
    window.addEventListener('auth-changed', onAuthChanged);

    return () =>
      window.removeEventListener('auth-changed', onAuthChanged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('auth-changed'));
    window.location.href = '/';
  };

  if (!isAuthenticated) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 hover:shadow-sm transition-all"
          >
            <Avatar className="h-9 w-9 ring-2 ring-gray-200">
              <AvatarImage
                src={
                  avatar ||
                  'https://i.pinimg.com/736x/18/89/57/1889571bec55294b795af81c2b9e6359.jpg'
                }
                alt="Profile"
              />
              <AvatarFallback>
                {(userName || 'U').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="hidden md:inline font-semibold text-gray-800 tracking-wide">
              {userName || 'User'}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="shadow-lg">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => {
              setOpen(false);
              navigate('/dashboard');
            }}
          >
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setOpen(false);
              navigate('/settings');
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
