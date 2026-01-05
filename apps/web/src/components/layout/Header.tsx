import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calculator, Wallet, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/calculator', label: 'IL Calculator', icon: Calculator },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            <span className="text-xl font-serif font-semibold text-text-primary">
              Vibe<span className="text-accent">DeFi</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === path
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-all duration-200 hover:shadow-glow">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-surface-border">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === path
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <button className="flex items-center gap-3 w-full mt-2 px-4 py-3 rounded-lg bg-accent text-background text-sm font-medium">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
