import HeaderSection from "@/components/resultPage/headerSection";
import CarouselSection from "@/components/homePage/carouselSection";
import ProductCategorySection from "@/components/homePage/productCategorySection";
import RecommendedProductSection from "@/components/homePage/recommendedProduct";

export default function Page() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                {/* header section */}
                <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <HeaderSection />
                </section>

                {/* section 1 - carousel */}
                <CarouselSection />

                {/* section 2 - categories */}
                <ProductCategorySection />

                {/* section 3 - recommended products */}
                <RecommendedProductSection />
            </div>
        </main>
    );
}