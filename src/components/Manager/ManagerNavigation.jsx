import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  FolderGit2,
  FileBarChart,
  Search,
  UserCircle,
  ChevronDown,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ManagerNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/manager/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/manager/jobs',
      label: 'Jobs',
      icon: Briefcase
    },
    {
      path: '/manager/employees',
      label: 'Employees',
      icon: Users
    },
    {
      path: '/manager/kpis',
      label: 'Performance & Development',
      icon: BarChart3
    },
    {
      path: '/manager/projects',
      label: 'Projects',
      icon: FolderGit2
    },
    {
      path: '/manager/reports',
      label: 'Reports',
      icon: FileBarChart
    }
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="w-[200px]">
            <Link 
              to="/manager/dashboard" 
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
                    // Active state (yellow background, black text)
                    location.pathname === item.path
                      ? 'bg-yellow-400 text-black'
                      : ''
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: Search and User */}
          <div className="w-[300px] flex items-center justify-end space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 w-[180px] h-9"
              />
            </div>
            
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerNavigation;
