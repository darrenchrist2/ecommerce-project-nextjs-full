"use client";

import SearchBar from "@/components/resultPage/searchBar";
import CartDropdown from "@/components/resultPage/cartDropdown";
import ProfileModal from "@/components/resultPage/profileModal";
import Image from "next/image";
import Link from "next/link";

export default function HeaderSection() {

    return (
        <>
            {/* Logo */}
            <Link href="/home">
                <Image
                    src="/images/logo_ecommerce1.png"
                    alt="Logo Ecommerce"
                    width={44}
                    height={44}
                    className="mx-auto sm:mx-0 object-contain transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95"
                />
            </Link>
            {/* Search bar dan Cart */}
            <div className="flex flex-1 items-center gap-3">
                <div className="flex-1">
                    <SearchBar />
                </div>
                <ProfileModal />
                <CartDropdown />
            </div>
        </>
    );
}