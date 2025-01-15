import { Home, Search, Bot, Database, Users, Download, MessageSquare } from 'lucide-react';
import { SidebarMenuItem } from './SidebarMenuItem';

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    href: '/',
  },
  {
    title: 'Core Tools & Platforms',
    icon: Database,
    href: '/tools',
  },
  {
    title: 'The AI Community',
    icon: Users,
    href: '/community',
  },
  {
    title: 'SISO Automations',
    icon: Download,
    href: '/automations',
  },
  {
    title: 'ChatGPT Assistants',
    icon: Bot,
    href: '/assistants',
  },
  {
    title: 'SISO AI',
    icon: MessageSquare,
    href: '/siso-ai',
  },
  {
    title: 'Additional Resources',
    icon: Search,
    href: '#resources',
  },
];

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const SidebarNavigation = ({ collapsed, onItemClick }: SidebarNavigationProps) => {
  return (
    <nav className="p-2">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.title}
          {...item}
          collapsed={collapsed}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};