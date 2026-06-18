import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const username = body.username?.trim();
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();

        // Validasi input
        if (!username || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username, email, dan password wajib diisi",
                },
                { status: 400 }
            );
        }

        // Cek apakah username sudah dipakai
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username sudah digunakan",
                },
                { status: 409 }
            );
        }

        // Cek apakah email sudah dipakai
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email sudah digunakan",
                },
                { status: 409 }
            );
        }

        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: "user",
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Register berhasil",
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/users/register error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal melakukan register",
            },
            { status: 500 }
        );
    }
}