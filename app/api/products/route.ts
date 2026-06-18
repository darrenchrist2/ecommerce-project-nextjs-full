import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProductWithScore = {
    id: number;
    name: string;
    price: unknown;
    category: string | null;
    createdAt: Date;
    updatedAt: Date;
    score: number;
};

function normalizeText(value: string | null | undefined) {
    return (value ?? "").trim().toLowerCase();
}

function calculateScore(product: {
    name: string;
    category: string | null;
}, q: string) {
    const keyword = normalizeText(q);
    const productName = normalizeText(product.name);
    const productCategory = normalizeText(product.category);

    if (!keyword) return 0;

    let score = 0;

    // Pecah query menjadi kata-kata agar scoring lebih fleksibel
    const queryWords = keyword.split(/\s+/).filter(Boolean);
    const nameWords = productName.split(/\s+/).filter(Boolean);
    const categoryWords = productCategory.split(/\s+/).filter(Boolean);

    // ===== scoring utama untuk name =====
    if (productName === keyword) {
        score += 100;
    }

    if (productName.startsWith(keyword)) {
        score += 60;
    }

    if (productName.includes(keyword)) {
        score += 40;
    }

    // Bonus jika tiap kata query muncul di name
    for (const word of queryWords) {
        if (nameWords.includes(word)) {
            score += 20;
        } else if (productName.includes(word)) {
            score += 10;
        }
    }

    // ===== scoring tambahan untuk category =====
    if (productCategory === keyword) {
        score += 35;
    }

    if (productCategory.startsWith(keyword)) {
        score += 20;
    }

    if (productCategory.includes(keyword)) {
        score += 15;
    }

    for (const word of queryWords) {
        if (categoryWords.includes(word)) {
            score += 8;
        } else if (productCategory.includes(word)) {
            score += 4;
        }
    }

    return score;
}

function calculateRelatedCategoryScore(
    product: {
        name: string;
        category: string | null;
    },
    q: string,
    anchorCategory: string | null
) {
    const baseScore = calculateScore(product, q);
    const productCategory = normalizeText(product.category);
    const normalizedAnchorCategory = normalizeText(anchorCategory);

    let relatedBonus = 0;

    if (
        normalizedAnchorCategory &&
        productCategory &&
        productCategory === normalizedAnchorCategory
    ) {
        relatedBonus += 50;
    }

    return baseScore + relatedBonus;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q")?.trim() || "";

        // Jika tidak ada query, kembalikan semua produk dengan score = 0
        if (!q) {
            const products = await prisma.product.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });

            const dataWithScore: ProductWithScore[] = products.map((product) => ({
                ...product,
                score: 0,
            }));

            return NextResponse.json(
                {
                    success: true,
                    message: "Semua data product berhasil diambil",
                    data: dataWithScore,
                },
                { status: 200 }
            );
        }

        // 1) Cari kandidat awal yang relevan terhadap query
        const matchedProducts = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        category: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Kalau tidak ada hasil sama sekali
        if (matchedProducts.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: `Data product berdasarkan query "${q}" tidak ditemukan`,
                    data: [],
                },
                { status: 200 }
            );
        }

        // 2) Hitung score kandidat awal
        const matchedWithScore: ProductWithScore[] = matchedProducts
            .map((product) => ({
                ...product,
                score: calculateScore(product, q),
            }))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.id - a.id;
            });

        // 3) Ambil produk paling relevan sebagai anchor
        const topProduct = matchedWithScore[0];
        const anchorCategory = topProduct.category;

        // 4) Cari produk related berdasarkan category dari produk terbaik
        let relatedProducts: ProductWithScore[] = [];

        if (anchorCategory) {
            const sameCategoryProducts = await prisma.product.findMany({
                where: {
                    category: {
                        equals: anchorCategory,
                        mode: "insensitive",
                    },
                    NOT: {
                        id: topProduct.id,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            relatedProducts = sameCategoryProducts
                .map((product) => ({
                    ...product,
                    score: calculateRelatedCategoryScore(product, q, anchorCategory),
                }))
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.id - a.id;
                });
        }

        // 5) Ambil sisa kandidat awal selain topProduct, dan yang belum masuk relatedProducts
        const relatedIds = new Set(relatedProducts.map((product) => product.id));

        const remainingMatchedProducts = matchedWithScore.filter(
            (product) => product.id !== topProduct.id && !relatedIds.has(product.id)
        );

        // 6) Gabungkan urutan:
        //    [top product, related category products, sisa matched lainnya]
        const finalData: ProductWithScore[] = [
            topProduct,
            ...relatedProducts,
            ...remainingMatchedProducts,
        ];

        return NextResponse.json(
            {
                success: true,
                message: `Data product berdasarkan query "${q}" berhasil diambil dengan related search category`,
                data: finalData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/products error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal mengambil data product",
            },
            { status: 500 }
        );
    }
}