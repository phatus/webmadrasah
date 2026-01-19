
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardShell({ children, user }: { children: React.ReactNode, user: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-black flex">
            {/* Sidebar Desktop & Mobile */}
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-[#1C2434]/90 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar Container */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
                    }`}
            >
                <Sidebar className="h-full w-72 border-r border-gray-200" userRole={user?.role} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    user={user}
                />
                <main className="mx-auto w-full p-4 md:p-6 2xl:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
