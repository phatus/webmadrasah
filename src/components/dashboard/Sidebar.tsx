'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Users,
    FolderTree,
    Calendar,
    Download,
    Image,
    School,
    History,
    User,
    Settings,
    ChevronDown,
    Target,
    MessageSquareQuote,
    Trophy,
    MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    className?: string;
}

const MENU_GROUPS = [
    {
        name: 'MENU',
        menuItems: [
            {
                icon: LayoutDashboard,
                label: 'Dashboard',
                route: '/dashboard',
            },
            {
                icon: FileText,
                label: 'Manajemen Konten',
                route: '#',
                children: [
                    { label: 'Halaman Depan', route: '/dashboard/home' },
                    { label: 'Berita & Artikel', route: '/dashboard/posts' },
                    { label: 'Kategori', route: '/dashboard/categories' },
                    { label: 'Agenda', route: '/dashboard/agendas' },
                    { label: 'Download Area', route: '/dashboard/downloads' },
                    { label: 'Galeri Foto', route: '/dashboard/galleries' },
                    { label: 'Galeri Video', route: '/dashboard/videos' },
                    { label: 'Kotak Masuk', route: '/dashboard/inbox' },
                    { label: 'Pengumuman', route: '/dashboard/announcements' }, // Added Announcements
                ],
            },
            {
                icon: School,
                label: 'Profil Madrasah',
                route: '#',
                children: [
                    { label: 'Sambutan Kepala', route: '/dashboard/profil/sambutan', icon: MessageSquareQuote },
                    { label: 'Visi & Misi', route: '/dashboard/profil/visi-misi', icon: Target },
                    { label: 'Sejarah', route: '/dashboard/profil/sejarah', icon: History },
                    { label: 'Sarana Prasarana', route: '/dashboard/sarana-prasarana', icon: MapPin }, // Added MapPin import
                ],
            },
            {
                icon: Trophy,
                label: 'Kesiswaan',
                route: '#',
                children: [
                    { label: 'OSIS & MPK', route: '/dashboard/kesiswaan/osis', icon: Users },
                    { label: 'Ekstrakurikuler', route: '/dashboard/ekstrakurikuler', icon: Target },
                    { label: 'Program Unggulan', route: '/dashboard/kesiswaan/program', icon: Target },
                    { label: 'Prestasi', route: '/dashboard/kesiswaan/prestasi', icon: Trophy },
                    { label: 'Data Alumni', route: '/dashboard/alumni', icon: Users }, // Added Alumni
                ],
            },
            {
                icon: Users,
                label: 'Kepegawaian',
                route: '#',
                children: [
                    { label: 'Data Guru & Staf', route: '/dashboard/gtk' },
                ]
            },
            {
                icon: Settings,
                label: 'Sistem',
                route: '#',
                children: [
                    { label: 'Manajemen User', route: '/dashboard/users' },
                    { label: 'Pengaturan Website', route: '/dashboard/settings' },
                ]
            },
        ],
    },
];

export default function Sidebar({ className, userRole = "EDITOR" }: SidebarProps & { userRole?: string }) {
    const pathname = usePathname();

    // Filter menu groups based on role
    const filteredMenuGroups = MENU_GROUPS.map(group => {
        const filteredItems = group.menuItems.map(item => {
            // Check children recursively if needed, but for now simple filter
            if (item.children) {
                const filteredChildren = item.children.filter(child => {
                    // Restrict specific routes
                    if (child.route === '/dashboard/users') return userRole === 'ADMIN';
                    return true;
                });
                return { ...item, children: filteredChildren };
            }
            return item;
        }).filter(item => {
            // Remove empty parents if all children were removed (optional, but good UX)
            // Or remove specific parent categories
            if (item.label === 'Sistem' && (!item.children || item.children.length === 0)) return false;
            return true;
        });

        return { ...group, menuItems: filteredItems };
    });

    return (
        <aside className={cn("absolute left-0 top-0 z-9999 h-screen w-72.5 flex flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0", className)}>
            {/* ... header ... */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                        M
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-black">
                            Web Madrasah
                        </span>
                        <span className="text-xs text-gray-500">Role: {userRole}</span>
                    </div>
                </Link>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {filteredMenuGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 uppercase">
                                {group.name}
                            </h3>

                            <ul className="mb-6 flex flex-col gap-1.5">
                                {group.menuItems.map((menuItem, menuIndex) => (
                                    <SidebarItem
                                        key={menuIndex}
                                        item={menuItem}
                                        pathname={pathname}
                                    />
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

const SidebarItem = ({ item, pathname }: { item: any; pathname: string }) => {
    const [pageName, setPageName] = useState("");

    const handleClick = () => {
        const updatedPageName = pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
        return setPageName(updatedPageName);
    };

    const isActive = (url: string) => {
        return pathname === url || pathname.startsWith(url);
    }

    // Check if any child is active to open accordion by default
    useEffect(() => {
        if (item.children) {
            if (item.children.some((child: any) => isActive(child.route))) {
                setPageName(item.label.toLowerCase());
            }
        }
    }, [pathname, item]);

    const isItemActive = item.route === '#' ? false : isActive(item.route);

    return (
        <li>
            <Link
                href={item.route}
                onClick={handleClick}
                className={cn(
                    "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 hover:text-black",
                    (isItemActive || pageName === item.label.toLowerCase()) && "bg-blue-50 text-blue-600"
                )}
            >
                <item.icon className={cn("h-5 w-5", (isItemActive || pageName === item.label.toLowerCase()) ? "text-blue-600" : "")} />
                {item.label}
                {item.children && (
                    <ChevronDown
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 fill-current h-5 w-5 transition-transform duration-200",
                            pageName === item.label.toLowerCase() && "rotate-180"
                        )}
                    />
                )}
            </Link>

            {/* Dropdown Menu */}
            {item.children && (
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        pageName === item.label.toLowerCase() ? "max-h-96 mt-2" : "max-h-0"
                    )}
                >
                    <ul className="flex flex-col gap-2.5 pl-6">
                        {item.children.map((child: any, index: number) => (
                            <li key={index}>
                                <Link
                                    href={child.route}
                                    className={cn(
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-500 duration-300 ease-in-out hover:text-black",
                                        pathname === child.route && "text-blue-600"
                                    )}
                                >
                                    {child.icon ? (
                                        <child.icon className={cn("h-4 w-4", pathname === child.route ? "text-blue-600" : "text-gray-500 group-hover:text-black")} />
                                    ) : (
                                        // Indent if no icon to align text
                                        <span className="w-4 h-4" />
                                    )}
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
};
