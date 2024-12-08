import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserRoleContext } from '../contexts/UserRoleContext';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Briefcase, 
  BarChart3, 
  DollarSign,
  ChevronDown,
  UserCircle,
  LogOut,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

const Navigation = () => {
  const location = useLocation();
  const { userRole, setUserRole } = useContext(UserRoleContext);

  const navigationItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/planning',
      label: 'Weekly Planning',
      icon: Calendar
    },
    {
      path: '/activity',
      label: 'Weekly Activity',
      icon: BarChart3
    },
    {
      path: '/job-orders',
      label: 'Job Orders',
      icon: Briefcase
    },
    {
      path: '/commission',
      label: 'Commission',
      icon: DollarSign
    },
    ...(userRole === 'admin' ? [
      {
        path: '/admin',
        label: 'Admin',
        icon: Settings
      }
    ] : [])
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="w-[200px]">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-black hover:opacity-90 transition-opacity"
            >
              KIPPY4
            </Link>
          </div>

          {/* Main Navigation - Centered */}
          <div className="flex-1 flex justify-center">
            <nav className="flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    // Base styles
                    'flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150',
                    // Default state (black text)
                    'text-black',
                    // Hover state (light gray background, maintain black text)
                    'hover:bg-gray-100 hover:text-black',
                    // Active state (yellow background, white text)
                    location.pathname === item.path
                      ? 'bg-yellow-400 text-white'
                      : ''
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section */}
          <div className="w-[200px] flex items-center justify-end space-x-4">
            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setUserRole('recruiter')}>
                  Recruiter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('manager')}>
                  Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('admin')}>
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={cn(
                    'flex items-center space-x-2 rounded-md px-3 py-2',
                    'text-sm font-medium text-black',
                    'hover:bg-gray-100 hover:text-black transition-colors duration-150'
                  )}
                >
                  <UserCircle className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center space-x-2 text-black hover:bg-gray-100">
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;