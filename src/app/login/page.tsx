'use client'

import { authenticate } from '@/actions/auth'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

function LoginButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full cursor-pointer rounded-lg border border-green-600 bg-green-600 p-4 text-white transition hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed font-medium"
        >
            {pending ? 'Masuk...' : 'Masuk / Sign In'}
        </button>
    )
}

export default function LoginPage() {
    // @ts-ignore
    const [errorMessage, dispatch] = useActionState(authenticate, undefined)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-boxdark-2">
            <div className="flex w-full h-screen overflow-hidden">
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-boxdark border-r border-stroke dark:border-strokedark">
                    <div className="w-full max-w-[550px] p-4 sm:p-12.5 xl:p-17.5">
                        <div className="mb-8">
                            <span className="mb-1.5 block font-medium text-black dark:text-white">Selamat Datang</span>
                            <h2 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                Login Admin Madrasah
                            </h2>
                        </div>

                        <form action={dispatch}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Masukkan username anda"
                                        required
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-green-600 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-green-600"
                                    />
                                    <span className="absolute right-4 top-4">
                                        <svg
                                            className="fill-current"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 22 22"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                className="fill-current opacity-50"
                                                d="M11 10.9062C12.9297 10.9062 14.5078 9.32812 14.5078 7.39844C14.5078 5.46875 12.9297 3.89062 11 3.89062C9.07031 3.89062 7.49219 5.46875 7.49219 7.39844C7.49219 9.32812 9.07031 10.9062 11 10.9062Z"
                                                fill=""
                                            />
                                            <path
                                                className="fill-current opacity-50"
                                                d="M19.9375 18.2578C19.8984 18.2188 19.8594 18.1797 19.8203 18.1406L19.4297 18.5703L19.8203 18.1406C18.9609 15.6016 16.2266 13.6094 13.0625 13.0234C13.8438 12.3984 14.3516 11.4219 14.3516 10.3281C14.3516 8.33594 12.8672 6.75781 11.0312 6.75781C9.19531 6.75781 7.71094 8.375 7.71094 10.3672C7.71094 11.4609 8.21875 12.4375 9 13.0625C5.83594 13.6484 3.10156 15.6797 2.24219 18.1797C2.20312 18.2188 2.16406 18.2578 2.125 18.2969C1.96875 18.4531 1.89062 18.6484 2.00781 18.8828C2.125 19.1172 2.39844 19.2344 2.67188 19.2344H19.3906C19.6641 19.2344 19.9375 19.1172 20.0547 18.8828C20.1719 18.6484 20.0938 18.4531 19.9375 18.2578Z"
                                                fill=""
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Masukkan password anda"
                                        required
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-green-600 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-green-600"
                                    />
                                    <span
                                        className="absolute right-4 top-4 cursor-pointer opacity-50 hover:opacity-100"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </span>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="mb-5">
                                <LoginButton />
                            </div>

                            <div className="mt-6 text-center">
                                <p>
                                    Lupa password?{' '}
                                    <Link href="#" className="text-green-600 hover:underline">
                                        Hubungi Administrator
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side - Branding/Hero */}
                <div className="hidden w-1/2 bg-[#1C2434] lg:flex flex-col items-center justify-center p-12 text-center text-white">
                    <div className="mb-10 text-center">
                        <Link className="inline-block mb-5" href="/">
                            <div className="h-20 w-20 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl mx-auto">
                                M
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold mb-4">Web Madrasah</h2>
                        <p className="max-w-md mx-auto text-gray-300">
                            Sistem Manajemen Konten & Informasi Madrasah Digital
                        </p>
                    </div>

                    <div className="grid grid-cols-6 gap-2 opacity-10 p-10 max-w-lg mx-auto transform rotate-12 scale-110 pointer-events-none select-none">
                        {/* Decorative grid pattern */}
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className={`h-16 w-16 bg-white rounded-lg ${i % 3 === 0 ? 'opacity-40' : 'opacity-20'}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
