import ProductCard from "@/components/resultPage/productCard";

const recommendedProducts = [
    {
        id: 1,
        name: "Sneakers Casual Pria",
        category: "Fashion",
        price: 349000,
        imageUrl: "/images/sneakers.jpg",
    },
    {
        id: 2,
        name: "Tas Selempang Wanita",
        category: "Fashion",
        price: 189000,
        imageUrl: "/images/tas_selempang_perempuan.jpg",
    },
    {
        id: 3,
        name: "Smartwatch Sport",
        category: "Elektronik",
        price: 499000,
        imageUrl: "/images/smartwatch_sport.jpg",
    },
    {
        id: 4,
        name: "Headphone Wireless",
        category: "Elektronik",
        price: 299000,
        imageUrl: "/images/headphone_wireless.jpg",
    },
    {
        id: 5,
        name: "Jaket Denim Unisex",
        category: "Fashion",
        price: 259000,
        imageUrl: "/images/jaket_denim.jpg",
    },
    {
        id: 6,
        name: "Keyboard Mechanical",
        category: "Elektronik",
        price: 699000,
        imageUrl: "/images/mechanical_keyboard.jpg",
    },
    {
        id: 7,
        name: "Parfum Premium",
        category: "Kecantikan",
        price: 159000,
        imageUrl: "/images/parfum.jpg",
    },
    {
        id: 8,
        name: "Mini Diecast Collection",
        category: "Hobi",
        price: 89000,
        imageUrl: "/images/diecast.jpg",
    },
];

export default function RecommendedProductSection() {
    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Rekomendasi Produk
                    </h2>
                    <p className="text-sm text-slate-500">
                        Produk yang mungkin kamu suka
                    </p>
                </div>

                <button className="text-sm font-semibold text-orange-500 hover:text-orange-600 cursor-pointer">
                    Lihat Semua
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {recommendedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        imageUrl={product.imageUrl}
                        imageAlt={product.name}
                    />
                ))}
            </div>
        </section>
    );
}