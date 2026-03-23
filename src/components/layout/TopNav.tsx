import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, User, CheckCircle2 } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/mai', label: 'MAI ADE' },
  { to: '/natalia', label: 'NATALIA ADE' },
  { to: '/collections', label: 'Collections' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

const TopNav: React.FC = () => {
  return (
    <header className="h-14 bg-bg-card border-b border-border-base flex items-center px-4 gap-4 z-40 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-1.5 mr-4">
        <span className="text-lg font-bold text-mai-accent font-display tracking-tight">SMM</span>
        <span className="text-lg text-text-muted font-light font-display">Facilities</span>
        <span className="ml-2 text-xs bg-accent-blue-light text-accent-blue font-medium px-1.5 py-0.5 rounded font-mono">ADE</span>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors font-sans ${
                isActive
                  ? 'bg-accent-blue-light text-accent-blue'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* QB Connected */}
        <div className="flex items-center gap-1.5 bg-accent-green-light text-accent-green text-xs font-medium px-2.5 py-1 rounded-full">
          <CheckCircle2 size={12} />
          <span>QB Connected</span>
        </div>

        {/* Bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-red text-white text-xs font-bold rounded-full flex items-center justify-center font-mono leading-none">
            4
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 bg-bg-secondary px-3 py-1.5 rounded-lg cursor-pointer hover:bg-border-base transition-colors">
          <div className="w-6 h-6 bg-mai-accent rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AM</span>
          </div>
          <span className="text-sm font-medium text-text-primary">Andrew Miller</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
