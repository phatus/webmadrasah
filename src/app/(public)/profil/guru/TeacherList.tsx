
'use client';

import { useState } from 'react';
import { Search, BookOpen, User } from 'lucide-react';
import Image from 'next/image';

interface Teacher {
    id: number;
    name: string;
    nip: string | null;
    position: string;
    subject: string | null;
    image: string | null;
}

export default function TeacherList({ initialTeachers }: { initialTeachers: Teacher[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeachers = initialTeachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.subject && teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm shadow-sm transition-all"
                    placeholder="Cari nama, mapel, atau jabatan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                        {/* Image Container */}
                        <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                            {teacher.image ? (
                                <Image
                                    src={teacher.image}
                                    alt={teacher.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                                    <User className="h-24 w-24 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">No Photo</span>
                                </div>
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>

                            {/* Overlay Text (Role) */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <p className="text-xs font-semibold uppercase tracking-wider bg-emerald-600 inline-block px-2 py-1 rounded-md mb-1">
                                    {teacher.position}
                                </p>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={teacher.name}>
                                {teacher.name}
                            </h3>

                            <div className="space-y-2 mt-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <BookOpen className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                                    <span className="line-clamp-1">{teacher.subject || '-'}</span>
                                </div>
                                {teacher.nip && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                                            NIP: {teacher.nip}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTeachers.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Tidak ditemukan</h3>
                    <p className="mt-1 text-gray-500">Coba kata kunci lain untuk mencari guru atau staf.</p>
                </div>
            )}
        </>
    );
}
