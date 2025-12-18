import { useState } from 'react';
import {
    LayoutDashboard,
    Target,
    FolderKanban,
    BarChart3,
    HelpCircle,
    Settings,
    LogOut
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Target, label: 'Track', id: 'track' },
    { icon: FolderKanban, label: 'Projects', id: 'projects', badge: 2 },
    { icon: BarChart3, label: 'Reports', id: 'reports' },
];

const bottomNavItems = [
    { icon: HelpCircle, label: 'Support', id: 'support' },
    { icon: Settings, label: 'Settings', id: 'settings' },
];

const Sidebar = ({ activePage, setActivePage }) => {
    return (
        <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Taskify</span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActivePage(item.id)}
                                className={`nav-item w-full ${activePage === item.id ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                    <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 pb-6">
                <ul className="space-y-1">
                    {bottomNavItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActivePage(item.id)}
                                className={`nav-item w-full ${activePage === item.id ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
