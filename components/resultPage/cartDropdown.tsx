"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";

type Product = {
    id: number;
    name: string;
    category: string;
    price: string;
};

export default function CartDropdown() {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false); 
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function loadCartItems() {
        const storedCart = localStorage.getItem("cartItems");

        if (!storedCart) {
            setCartItems([]);
            return;
        }

        try {
            const parsedCart = JSON.parse(storedCart);

            if (Array.isArray(parsedCart)) {
                setCartItems(parsedCart);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Gagal membaca data keranjang:", error);
            setCartItems([]);
        }
    }

    useEffect(() => {
        loadCartItems();

        window.addEventListener("cartUpdated", loadCartItems);

        return () => {
            window.removeEventListener("cartUpdated", loadCartItems);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            {/* Cart Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
                <ShoppingCart size={22} />

                {cartItems.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                        {cartItems.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <div
                className={`absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl transition-all duration-300 ${
                    isOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible translate-y-2 opacity-0"
                }`}
            >
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                        Keranjang Saya
                    </h3>

                    <span className="text-xs text-slate-500">
                        {cartItems.length} produk
                    </span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="py-6 text-center">
                        <ShoppingCart
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                        />

                        <p className="text-sm text-slate-500">
                            Keranjang masih kosong.
                        </p>
                    </div>
                ) : (
                    <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                        {cartItems.map((product, index) => (
                            <div
                                key={`${product.id}-${index}`}
                                className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
                            >
                                <h4 className="line-clamp-1 text-sm font-semibold text-slate-800">
                                    {product.name}
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                    {product.category}
                                </p>

                                <p className="mt-2 text-sm font-bold text-slate-900">
                                    {product.price}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <button
                        type="button"
                        className="cursor-pointer mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
                    >
                        Lihat Keranjang
                    </button>
                )}
            </div>
        </div>
    );
}