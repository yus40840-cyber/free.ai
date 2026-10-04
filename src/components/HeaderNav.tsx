import React, { useState } from 'react';
import { 
  Sparkles, Plus, BookOpen, User, Coins, Check, ShieldCheck, 
  Settings, CreditCard, LogOut, ChevronDown, Sliders, Menu, X 
} from 'lucide-react';
import studentAvatar from '../assets/images/student_avatar_1791105436108.jpg';
import { UserRole, UserState } from '../types';

interface HeaderNavProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onNewDocument: () => void;
  onOpenProfile: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenSynthesizer?: () => void;
  user: UserState;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  onNewDocument,
  onOpenProfile,
  onOpenPricing,
  onOpenAuth,
  onOpenSynthesizer,
  user
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand title, single line text wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="text-left flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-lg shadow-2xs">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 font-heading">
              ScholarFlow
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-neutral-600">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors hover:text-neutral-950 ${currentView === 'dashboard' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`transition-colors hover:text-neutral-950 ${currentView === 'features' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('templates')}
            className={`transition-colors hover:text-neutral-950 ${currentView === 'templates' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Templates
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`transition-colors hover:text-neutral-950 ${currentView === 'pricing' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Pricing & Credits
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className={`transition-colors hover:text-neutral-950 ${currentView === 'resources' ? 'text-neutral-950 font-bold' : ''}`}
          >
            Resources
          </button>
          <button
            onClick={onOpenProfile}
            className="transition-colors hover:text-neutral-950 flex items-center gap-1.5 text-neutral-700"
          >
            <span>My Writing Voice</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Voice profile active" />
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User Menu */}
        <div className="flex items-center gap-2.5">
          
          {/* Credits Counter Pill */}
          <button
            onClick={() => onNavigate('pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors font-mono-numbers"
            title="Available AI Credits"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>{user.aiUnits.toLocaleString()} Credits</span>
          </button>

          {/* Research Synthesizer Button */}
          {onOpenSynthesizer && (
            <button
              onClick={onOpenSynthesizer}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs group"
              title="Open Research & Writing Synthesizer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-12 transition-transform" />
              <span>Synthesizer</span>
            </button>
          )}

          {/* New Document Button */}
          <button
            onClick={onNewDocument}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Document</span>
          </button>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-neutral-200 transition-all focus:outline-none"
              title={`${user.name} (${user.role})`}
            >
              <img
                src={studentAvatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-neutral-300"
              />
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg py-1.5 z-50 text-xs divide-y divide-neutral-100 animate-in fade-in duration-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3.5 py-2">
                  <div className="font-semibold text-neutral-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{user.email}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{user.plan} Plan · {user.role}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={onOpenProfile}
                    className="w-full px-3.5 py-1.5 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Writing Voice Profile</span>
                  </button>

                  <button
                    onClick={() => onNavigate('billing')}
                    className="w-full px-3.5 py-1.5 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Subscription & Billing</span>
                  </button>

                  <button
                    onClick={() => onNavigate('admin')}
                    className="w-full px-3.5 py-1.5 text-left text-amber-900 hover:bg-amber-50/60 font-medium flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin & Multi-Model Console</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={onOpenAuth}
                    className="w-full px-3.5 py-1.5 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Switch / Log In Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 bg-white px-4 py-3 space-y-2 text-xs font-medium text-neutral-700">
          <button
            onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1.5 hover:text-neutral-950"
          >
            Dashboard
          </button>
          <button
            onClick={() => { onNavigate('features'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1.5 hover:text-neutral-950"
          >
            Features
          </button>
          <button
            onClick={() => { onNavigate('templates'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1.5 hover:text-neutral-950"
          >
            Templates
          </button>
          <button
            onClick={() => { onNavigate('pricing'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1.5 hover:text-neutral-950"
          >
            Pricing & AI Credits
          </button>
          <button
            onClick={() => { onNavigate('resources'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1.5 hover:text-neutral-950"
          >
            Resources
          </button>
          <button
            onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1.5 text-amber-800 font-semibold"
          >
            Admin Multi-Model Console
          </button>
        </div>
      )}
    </header>
  );
};
