
'use client';

import { Menu, Bell, User, ChevronDown, Settings, LogOut, Moon, Sun, UserCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg0: boolean) => void;
    user: any;
}

export default function Header({ sidebarOpen, setSidebarOpen, user }: HeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const [darkMode, setDarkMode] = useState(false); // Placeholder for now

    const trigger = useRef<any>(null);
    const dropdown = useRef<any>(null);

    // Close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [dropdownOpen]);

    return (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* Hamburger Toggle BTN */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    {/* Hamburger Toggle BTN */}

                    <Link className="block flex-shrink-0 lg:hidden" href="/">
                        <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            M
                        </div>
                    </Link>
                </div>

                <div className="hidden sm:block">
                    {/* Search placeholder or breadcrumb could go here */}
                </div>

                <div className="flex items-center gap-3 2xl:gap-7">
                    <ul className="flex items-center gap-2 2xl:gap-4">
                        {/* Dark Mode Toggler */}
                        <li>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white ${darkMode ? 'bg-primary text-white' : ''}`}
                            >
                                <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
                                    <Moon size={18} />
                                </span>
                                <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
                                    <Sun size={18} />
                                </span>
                            </button>
                        </li>
                        {/* Dark Mode Toggler */}

                        {/* Notification Menu Area */}
                        <li className="relative">
                            <button
                                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                            >
                                <span
                                    className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${notifying === false ? 'hidden' : 'inline'
                                        }`}
                                >
                                    <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                                </span>
                                <Bell size={18} />
                            </button>
                        </li>
                        {/* Notification Menu Area */}
                    </ul>

                    {/* User Area */}
                    <div className="relative">
                        <Link
                            ref={trigger}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-4"
                            href="#"
                        >
                            <span className="hidden text-right lg:block">
                                <span className="block text-sm font-medium text-black dark:text-white">
                                    {user?.name || 'Admin User'}
                                </span>
                                <span className="block text-xs text-gray-500">
                                    {user?.role || 'Administrator'}
                                </span>
                            </span>

                            <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                                {user?.image ? (
                                    <img src={user.image} alt="User" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white">
                                        <span className="text-xl font-bold">{user?.name?.charAt(0) || 'A'}</span>
                                    </div>
                                )}
                            </span>
                            <ChevronDown className="hidden fill-current sm:block" size={18} />
                        </Link>

                        {/* Dropdown Start */}
                        {dropdownOpen && (
                            <div
                                ref={dropdown}
                                className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                            >
                                <div className="px-6 py-4 border-b border-stroke dark:border-strokedark">
                                    <span className="block text-sm font-medium text-black dark:text-white">
                                        {user?.name || 'Admin User'}
                                    </span>
                                    <span className="block text-xs text-gray-500">
                                        {user?.email || 'admin@madrasah.id'}
                                    </span>
                                </div>
                                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                                    <li>
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                        >
                                            <UserCircle size={22} />
                                            Edit profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/dashboard/settings"
                                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                        >
                                            <Settings size={22} />
                                            Account settings
                                        </Link>
                                    </li>
                                </ul>
                                <button
                                    onClick={async () => {
                                        await signOut({ redirect: false })
                                        window.location.href = "/"
                                    }}
                                    className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                >
                                    <LogOut size={22} />
                                    Sign out
                                </button>
                            </div>
                        )}
                        {/* Dropdown End */}
                    </div>
                </div>
            </div>
        </header>
    );
}
