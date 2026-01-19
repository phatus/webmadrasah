
import { getSettings } from "@/actions/settings"
import Link from 'next/link';
import { Menu, ChevronDown, Search } from 'lucide-react';
import NavbarClient from "@/components/ui/NavbarClient" // We will extract client logic
import Image from "next/image"

export default async function Navbar() {
    const settings = await getSettings()

    // Default values if settings are missing
    const siteName = settings['site_name'] || "MTsN 1 Pacitan"
    const logoUrl = settings['site_logo'] || null

    return (
        <NavbarClient
            siteName={siteName}
            logoUrl={logoUrl}
        />
    )
}
