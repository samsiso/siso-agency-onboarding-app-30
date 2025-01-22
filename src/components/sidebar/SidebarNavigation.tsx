import { useLocation } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { 
  Home, 
  Newspaper, 
  Wrench, 
  GraduationCap, 
  Bot, 
  Network
} from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  visible: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const location = useLocation();

  if (!visible) return null;

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/ai-news', icon: Newspaper, label: 'AI News' },
    { href: '/tools', icon: Wrench, label: 'Tools' },
    { href: '/siso-education', icon: GraduationCap, label: 'Education' },
    { href: '/automations', icon: Bot, label: 'Automations' },
    { href: '/networking', icon: Network, label: 'Networking' },
  ];

  return (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={location.pathname === item.href}
          collapsed={collapsed}
          onClick={(e) => onItemClick(e, item.href)}
        />
      ))}
    </nav>
  );
};