"use client";

import Image from "next/image";
import { useState } from "react";

type ProductCardProps = {
    id: number;
    name: string;
    category: string;
    price: number | string;
    imageUrl?: string;
    imageAlt?: string;
    onViewDetail?: () => void;
    onAddToCart?: () => void;
    className?: string;
};

type Product = {
    id: number;
    name: string;
    category: string;
    price: string;
};

function formatRupiah(price: number | string) {
    const numericPrice =
        typeof price === "string" ? Number(price.replace(/,/g, "")) : price;

    if (Number.isNaN(numericPrice)) {
        return "Rp 0.00";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numericPrice);
}

export default function ProductCard({
    id,
    name,
    category,
    price,
    imageUrl,
    imageAlt,
    onViewDetail,
    onAddToCart,
    className = "",
}: ProductCardProps) {
    function handleAddToCart() {
        const newProduct: Product = {
            id,
            name,
            category,
            price: formatRupiah(price),
        };

        const storedCart = localStorage.getItem("cartItems");
        const cartItems: Product[] = storedCart ? JSON.parse(storedCart) : [];

        const existingProduct = cartItems.find((item) => item.id === id);

        if (existingProduct) {
            alert("Produk sudah ada di keranjang.");
            return;
        }

        const updatedCart = [...cartItems, newProduct];

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));

        window.dispatchEvent(new Event("cartUpdated"));

        if (onAddToCart) {
            onAddToCart();
        }

        alert("Produk berhasil ditambahkan ke keranjang.");
    }

    const [imageError, setImageError] = useState(false);

    const hasValidImage = Boolean(imageUrl?.trim()) && !imageError;

    return (
        <article
            className={[
                "group w-full overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 sm:p-2.5",
                "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.10)]",
                className,
            ].join(" ")}
        >
            {/* Section 1: image */}
            <div className="relative overflow-hidden rounded-xl bg-slate-100">
                <div className="relative aspect-4/3 w-full">
                    {hasValidImage ? (
                        <Image
                            src={imageUrl!}
                            alt={imageAlt || name}
                            fill
                            onError={() => setImageError(true)}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <i className="ri-image-line text-3xl sm:text-4xl" />
                            <span className="mt-1 text-[10px] font-medium sm:text-xs">
                                No Image
                            </span>
                        </div>
                    )}
                </div>
                
                {hasValidImage && (
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/10 via-transparent to-white/20 opacity-80" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/10 via-transparent to-white/20 opacity-80" />
            </div>

            {/* Section 2: nama + harga */}
            <div className="px-1 pt-3">
                <h3 className="line-clamp-2 min-h-9 text-xs font-medium leading-4 text-slate-800 sm:min-h-10 sm:text-sm sm:leading-5">
                    {name}
                </h3>

                <p className="mt-1 text-xs font-bold tracking-tight text-slate-900 sm:mt-1.5 sm:text-base">
                    {formatRupiah(price)}
                </p>
            </div>

            {/* Section 3: actions */}
            <div className="mt-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={onViewDetail}
                    className="flex h-8 w-3/4 cursor-pointer items-center justify-center rounded-xl border border-sky-100 bg-sky-50 px-2 text-[11px] font-medium text-slate-700 transition-all duration-300 hover:border-sky-200 hover:bg-sky-100/70 hover:text-slate-900 active:scale-[0.98] sm:h-9 sm:px-3 sm:text-sm"
                >
                    View Detail
                </button>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    aria-label={`Add ${name} to cart`}
                    className="flex h-8 w-1/4 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.96] sm:h-9"
                >
                    <i className="ri-shopping-cart-2-line text-base" />
                </button>
            </div>
        </article>
    );
}