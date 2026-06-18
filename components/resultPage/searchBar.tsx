"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProductSuggestion = {
    id: number;
    name: string;
    category: string;
    price: string;
};

function formatRupiah(price: string | number) {
    const numericPrice =
        typeof price === "string"
            ? Number(price.replace(/[^0-9.-]+/g, ""))
            : price;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
        .format(numericPrice)
        .replace("IDR", "Rp");
}

export default function SearchBar() {
    const router = useRouter();

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const [products, setProducts] = useState<ProductSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = async (searchQuery: string = "") => {
        try {
            setIsLoading(true);

            const endpoint = searchQuery.trim()
                ? `/api/products?q=${encodeURIComponent(searchQuery)}`
                : "/api/products";

            const response = await fetch(endpoint);
            const result = await response.json();

            if (result.success) {
                setProducts(result.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter rekomendasi berdasarkan kata kunci yang diketik user.
    const filteredProducts = useMemo(() => {
        return products.slice(0, 8);
    }, [products]);

    const showDropdown = isOpen && (filteredProducts.length > 0 || query.trim().length > 0);

    const handleSelect = (productName: string) => {
        setQuery(productName);
        setIsOpen(false);
        setActiveIndex(-1);
        pushQueryToUrl(productName);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (activeIndex < 0 || !listRef.current) return;

        const activeItem = listRef.current.querySelector<HTMLElement>(
            `[data-suggestion-index="${activeIndex}"]`
        );

        activeItem?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
        });
    }, [activeIndex]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) =>
                prev < filteredProducts.length - 1 ? prev + 1 : 0
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : filteredProducts.length - 1
            );
        }

        if (event.key === "Enter") {
            event.preventDefault();

            if (activeIndex >= 0 && filteredProducts[activeIndex]) {
                handleSelect(filteredProducts[activeIndex].name);
                return;
            }

            pushQueryToUrl(query);
            setIsOpen(false);
            setActiveIndex(-1);
        }

        if (event.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    useEffect(() => {
        // Reset active item saat hasil filter berubah.
        setActiveIndex(-1);
    }, [query]);

    const pushQueryToUrl = (searchValue: string) => {
        const trimmedValue = searchValue.trim();

        if (!trimmedValue) {
            router.push("/");
            return;
        }

        router.push(`/result?q=${encodeURIComponent(trimmedValue)}`);
    };

    return (
        <div ref={wrapperRef}  className="relative w-full flex-1 max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            {/* Search input */}
            <div
                className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all duration-300 ${
                isOpen
                    ? "border-slate-300 shadow-lg ring-4 ring-slate-100"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-slate-400 transition-colors duration-300 group-focus-within:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(event) => {
                        const value = event.target.value;
                        setQuery(value);
                        setIsOpen(true);
                        fetchProducts(value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Cari produk, kategori, atau brand..."
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-controls="product-suggestion-list"
                    aria-autocomplete="list"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setIsOpen(true);
                            fetchProducts();
                            inputRef.current?.focus();
                        }}
                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Hapus pencarian"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown recommendation */}
            <div
                className={`absolute left-0 right-0 top-[calc(100%+12px)] z-50 origin-top overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
                showDropdown
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                }`}
            >
                <div className="border-b border-slate-100 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Rekomendasi produk
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        {query.trim()
                            ? `Hasil pencarian untuk "${query}"`
                            : "Produk populer untuk pencarian cepat"}
                    </p>
                </div>

                <ul
                    ref={listRef}
                    id="product-suggestion-list"
                    role="listbox"
                    className="max-h-90 overflow-y-auto p-3"
                >
                    {isLoading ? (
                        <li className="px-4 py-10 text-center">
                            <p className="text-sm text-slate-500">Memuat data produk...</p>
                        </li>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <li key={product.id} role="option" aria-selected={isActive}>
                                    <button
                                        type="button"
                                        data-suggestion-index={index}
                                        onMouseDown={(event) => {
                                            // Mencegah input blur sebelum click selesai.
                                            event.preventDefault();
                                        }}
                                        onClick={() => handleSelect(product.name)}
                                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                                            isActive
                                            ? "bg-slate-100"
                                            : "hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                {product.name}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {product.category}
                                            </p>
                                        </div>

                                        <span className="ml-4 shrink-0 text-xs font-medium text-slate-600">
                                            {formatRupiah(product.price)}
                                        </span>
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                            <li className="px-4 py-10 text-center">
                                <p className="text-sm font-medium text-slate-700">
                                    Produk tidak ditemukan
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Coba gunakan kata kunci lain.
                                </p>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
}