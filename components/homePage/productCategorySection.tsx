import {
    Shirt,
    ShoppingBag,
    Watch,
    Laptop,
    Sparkles,
    Car,
    Gamepad2,
    Footprints,
} from "lucide-react";

const categories = [
    {
        name: "Sepatu",
        icon: Footprints,
    },
    {
        name: "Tas",
        icon: ShoppingBag,
    },
    {
        name: "Aksesoris",
        icon: Watch,
    },
    {
        name: "Elektronik",
        icon: Laptop,
    },
    {
        name: "Fashion",
        icon: Shirt,
    },
    {
        name: "Beauty",
        icon: Sparkles,
    },
    {
        name: "Otomotif",
        icon: Car,
    },
    {
        name: "Hobi & Koleksi",
        icon: Gamepad2,
    },
];

export default function ProductCategorySection() {
    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Kategori Produk
                    </h2>
                    <p className="text-sm text-slate-500">
                        Pilih kategori sesuai kebutuhanmu
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <button
                            key={category.name}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md cursor-pointer"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                                <Icon size={24} />
                            </div>

                            <span className="text-sm font-medium text-slate-700">
                                {category.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}