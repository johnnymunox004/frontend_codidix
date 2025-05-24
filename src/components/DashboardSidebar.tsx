"use client";

import { FiMenu } from 'react-icons/fi';
import { 
  FiHome, 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiLogOut 
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      label: 'Panel Principal',
      href: '/dashboard',
      icon: <FiHome className="w-5 h-5" />
    },
    {
      label: 'Consultar Procesos',
      href: '/dashboard/consulta',
      icon: <FiSearch className="w-5 h-5" />
    },
    {
      label: 'Alertas y Notificaciones',
      href: '/dashboard/alertas',
      icon: <FiBell className="w-5 h-5" />
    },
    {
      label: 'Perfil de Usuario',
      href: '/dashboard/profile',
      icon: <FiUser className="w-5 h-5" />
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
        aria-label="Open menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-64 md:w-72 md:z-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">LexTrack</h1>
              <p className="text-sm text-gray-500">Sistema de Gestión Judicial</p>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <span className={`
                        flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'}
                      `}>
                        {item.icon}
                        <span>{item.label}</span>
                        {item.label === 'Alertas y Notificaciones' && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                            2
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Juan Pérez</p>
                  <p className="text-xs text-gray-500">Empresa ABC S.A.S.</p>
                </div>
              </div>
              <Link href="/sign-in">
                <span className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  <FiLogOut className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
