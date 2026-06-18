import ProductCardSection from "@/components/resultPage/productCardSection";
import ProductFilter from "@/components/resultPage/productFilter";
import HeaderSection from "@/components/resultPage/headerSection";

export default function Page() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                
                {/* header section (logo, searchbar, cart) */}
                <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <HeaderSection />
                </section>

                {/* content section */}
                <section className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    {/* sidebar desktop */}
                    <ProductFilter 
                        defaultValue={{
                            locations: [],
                            sellerTypes: [],
                            paymentMethods: [],
                            shippingOptions: [],
                            promoPrograms: [],
                            categories: [],
                        }} 
                    />

                    {/* product list */}
                    <div className="min-w-0">
                        <ProductCardSection />
                    </div>
                </section>
            </div>
        </main>
    );
}