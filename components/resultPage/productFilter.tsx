"use client";

import { useEffect, useMemo, useState } from "react";

type FilterSectionKey =
    | "locations"
    | "sellerTypes"
    | "paymentMethods"
    | "shippingOptions"
    | "promoPrograms"
    | "categories";

export type ProductFilterValue = {
    locations: string[];
    sellerTypes: string[];
    paymentMethods: string[];
    shippingOptions: string[];
    promoPrograms: string[];
    categories: string[];
};

type ProductFilterProps = {
    value?: ProductFilterValue;
    defaultValue?: ProductFilterValue;
    onChange?: (value: ProductFilterValue) => void;
    className?: string;
};

type FilterOption = {
    label: string;
    value: string;
};

type FilterSection = {
    key: FilterSectionKey;
    title: string;
    options: FilterOption[];
};

const FILTER_SECTIONS: FilterSection[] = [
    {
        key: "locations",
        title: "Lokasi",
        options: [
            { label: "Jabodetabek", value: "jabodetabek" },
            { label: "DKI Jakarta", value: "dki-jakarta" },
            { label: "Jakarta Selatan", value: "jakarta-selatan" },
            { label: "Jakarta Utara", value: "jakarta-utara" },
            { label: "Jakarta Barat", value: "jakarta-barat" },
            { label: "Jakarta Pusat", value: "jakarta-pusat" },
            { label: "Jakarta Timur", value: "jakarta-timur" },
            { label: "Banten", value: "banten" },
            { label: "Jawa Barat", value: "jawa-barat" },
            { label: "Jawa Timur", value: "jawa-timur" },
            { label: "Jawa Tengah", value: "jawa-tengah" },
        ],
    },
    {
        key: "sellerTypes",
        title: "Tipe Penjual",
        options: [
            { label: "Star+", value: "star-plus" },
            { label: "Star", value: "star" },
            { label: "Reguler", value: "reguler" },
        ],
    },
    {
        key: "paymentMethods",
        title: "Metode Pembayaran",
        options: [
            { label: "COD", value: "cod" },
            { label: "Cicilan", value: "cicilan" },
        ],
    },
    {
        key: "shippingOptions",
        title: "Opsi Pengiriman",
        options: [
            { label: "Instant", value: "instant" },
            { label: "Same Day", value: "same-day" },
            { label: "Reguler", value: "reguler" },
            { label: "Hemat Kargo", value: "hemat-kargo" },
            { label: "Next Day", value: "next-day" },
            { label: "Instant Car", value: "instant-car" },
            { label: "Ambil di Tempat", value: "ambil-di-tempat" },
        ],
    },
    {
        key: "promoPrograms",
        title: "Program Promo",
        options: [
            { label: "Promo XTRA", value: "promo-xtra" },
            { label: "Bebas Pengembalian", value: "bebas-pengembalian" },
            { label: "Dengan Diskon", value: "dengan-diskon" },
            { label: "Ready Stock", value: "ready-stock" },
            { label: "Grosir", value: "grosir" },
        ],
    },
    {
        key: "categories",
        title: "Kategori",
        options: [
            { label: "Sepatu", value: "sepatu" },
            { label: "Tas", value: "tas" },
            { label: "Aksesoris", value: "aksesoris" },
            { label: "Elektronik", value: "elektronik" },
            { label: "Fashion", value: "fashion" },
            { label: "Beauty", value: "beauty" },
        ],
    },
];

const EMPTY_FILTER: ProductFilterValue = {
    locations: [],
    sellerTypes: [],
    paymentMethods: [],
    shippingOptions: [],
    promoPrograms: [],
    categories: [],
};

function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
}

function isFilterEqual(a: ProductFilterValue, b: ProductFilterValue) {
    return (
        arraysEqual(a.locations, b.locations) &&
        arraysEqual(a.sellerTypes, b.sellerTypes) &&
        arraysEqual(a.paymentMethods, b.paymentMethods) &&
        arraysEqual(a.shippingOptions, b.shippingOptions) &&
        arraysEqual(a.promoPrograms, b.promoPrograms) &&
        arraysEqual(a.categories, b.categories)
    );
}

function mergeInitialValue(
    defaultValue?: ProductFilterValue,
    value?: ProductFilterValue
): ProductFilterValue {
    return {
        locations: value?.locations ?? defaultValue?.locations ?? [],
        sellerTypes: value?.sellerTypes ?? defaultValue?.sellerTypes ?? [],
        paymentMethods: value?.paymentMethods ?? defaultValue?.paymentMethods ?? [],
        shippingOptions: value?.shippingOptions ?? defaultValue?.shippingOptions ?? [],
        promoPrograms: value?.promoPrograms ?? defaultValue?.promoPrograms ?? [],
        categories: value?.categories ?? defaultValue?.categories ?? [],
    };
}

export default function ProductFilter({
    value,
    defaultValue,
    onChange,
    className = "",
}: ProductFilterProps) {
    const isControlled = typeof value !== "undefined";

    const [internalValue, setInternalValue] = useState<ProductFilterValue>(
        mergeInitialValue(defaultValue, value)
    );
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSections, setOpenSections] = useState<Record<FilterSectionKey, boolean>>({
        locations: true,
        sellerTypes: true,
        paymentMethods: true,
        shippingOptions: true,
        promoPrograms: true,
        categories: true,
    });

    const selectedValue = isControlled ? (value as ProductFilterValue) : internalValue;

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileOpen]);

    useEffect(() => {
        if (!isControlled && value && !isFilterEqual(value, internalValue)) {
            setInternalValue(value);
        }
    }, [value, isControlled, internalValue]);

    const totalSelected = useMemo(() => {
        return (
            selectedValue.locations.length +
            selectedValue.sellerTypes.length +
            selectedValue.paymentMethods.length +
            selectedValue.shippingOptions.length +
            selectedValue.promoPrograms.length +
            selectedValue.categories.length
        );
    }, [selectedValue]);

    function updateValue(nextValue: ProductFilterValue) {
        if (!isControlled) {
            setInternalValue(nextValue);
        }
        onChange?.(nextValue);
    }

    function toggleOption(sectionKey: FilterSectionKey, optionValue: string) {
        const currentItems = selectedValue[sectionKey];
        const exists = currentItems.includes(optionValue);

        const nextItems = exists
            ? currentItems.filter((item) => item !== optionValue)
            : [...currentItems, optionValue];

        updateValue({
            ...selectedValue,
            [sectionKey]: nextItems,
        });
    }

    function clearAllFilters() {
        updateValue(EMPTY_FILTER);
    }

    function toggleSection(sectionKey: FilterSectionKey) {
        setOpenSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    }

    const FilterContent = (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                        <i className="ri-filter-line text-base" /> Filter Produk
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Sesuaikan pencarian sesuai kebutuhan
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {totalSelected > 0 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 lg:min-w-18 lg:px-3 lg:text-center">
                            {totalSelected} dipilih
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
                        aria-label="Tutup filter"
                    >
                        <i className="ri-close-line text-lg" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                    {FILTER_SECTIONS.map((section) => {
                        const isOpen = openSections[section.key];
                        const selectedCount = selectedValue[section.key].length;

                        return (
                            <section
                                key={section.key}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.key)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-800">
                                            {section.title}
                                        </span>

                                        {selectedCount > 0 && (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                                {selectedCount}
                                            </span>
                                        )}
                                    </div>

                                    <i
                                        className={`ri-arrow-down-s-line text-lg text-slate-500 transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-out ${
                                        isOpen
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                                            <div className="flex flex-wrap gap-2">
                                                {section.options.map((option) => {
                                                    const isSelected = selectedValue[
                                                        section.key
                                                    ].includes(option.value);

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleOption(
                                                                    section.key,
                                                                    option.value
                                                                )
                                                            }
                                                            className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                                                                isSelected
                                                                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-4 py-4">
                <button
                    type="button"
                    onClick={clearAllFilters}
                    className="cursor-pointer w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
                >
                    Hapus Semua
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile trigger button */}
            <div className={`lg:hidden ${className}`}>
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                    aria-label="Buka filter"
                >
                    <i className="ri-filter-line text-base" />
                    <span>Filter</span>

                    {totalSelected > 0 && (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                            {totalSelected}
                        </span>
                    )}
                </button>
            </div>

            {/* Desktop sidebar */}
            <aside
                className={`hidden h-fit rounded-3xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:block lg:w-70 ${className}`}
            >
                {FilterContent}
            </aside>

            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${
                    isMobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm transform bg-slate-50 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-hidden={!isMobileOpen}
            >
                {FilterContent}
            </aside>
        </>
    );
}