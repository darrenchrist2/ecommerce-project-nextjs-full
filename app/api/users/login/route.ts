import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const username = body.username?.trim();
        const password = body.password?.trim();

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username dan password wajib diisi",
                },
                { status: 400 }
            );
        }

        // Cari user berdasarkan username
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username atau password salah",
                },
                { status: 401 }
            );
        }

        // Bandingkan password input dengan password hash di database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username atau password salah",
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Login berhasil",
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST /api/users/login error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal melakukan login",
            },
            { status: 500 }
        );
    }
}