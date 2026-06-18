"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const carouselItems = [
    {
        title: "Big Sale Fashion Week",
        description: "Diskon hingga 70% untuk produk fashion pilihan.",
        image: "https://picsum.photos/seed/fashion-sale/1200/420",
    },
    {
        title: "Electronic Deals",
        description: "Temukan gadget dan elektronik terbaik untuk kebutuhanmu.",
        image: "https://picsum.photos/seed/electronic-deals/1200/420",
    },
    {
        title: "New Arrival Collection",
        description: "Produk terbaru dari berbagai kategori favorit.",
        image: "https://picsum.photos/seed/new-arrival/1200/420",
    },
];

export default function CarouselSection() {
    return (
        <section className="mt-6">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="rounded-3xl"
            >
                {carouselItems.map((item) => (
                    <SwiperSlide key={item.title}>
                        <article className="relative h-55 overflow-hidden rounded-3xl bg-slate-900 shadow-sm md:h-80">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover opacity-70"
                            />

                            <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-950/40 to-transparent" />

                            <div className="absolute inset-0 flex max-w-xl flex-col justify-center px-6 text-white md:px-10">
                                <p className="mb-2 text-sm font-medium text-orange-300">
                                    Special Promo
                                </p>

                                <h1 className="text-2xl font-bold md:text-4xl">
                                    {item.title}
                                </h1>

                                <p className="mt-3 max-w-md text-sm text-slate-100 md:text-base">
                                    {item.description}
                                </p>

                                <button className="cursor-pointer mt-5 w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                                    Belanja Sekarang
                                </button>
                            </div>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}