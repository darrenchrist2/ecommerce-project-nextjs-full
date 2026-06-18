"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    // State untuk menyimpan nilai input username.
    const [username, setUsername] = useState("");

    // State untuk menyimpan nilai input password.
    const [password, setPassword] = useState("");

    // State untuk menyimpan nilai input email.
    const [email, setEmail] = useState("");

    // State untuk menyimpan status checkbox "I agree to Terms".
    const [isAgree, setIsAgree] = useState(false);

    // State untuk simulasi loading saat tombol register ditekan.
    const [isLoading, setIsLoading] = useState(false);

    // State untuk menampilkan atau menyembunyikan password.
    const [showPassword, setShowPassword] = useState(false);

    // State untuk feedback sederhana setelah submit.
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    // Validasi sederhana agar tombol register hanya aktif jika kedua field terisi.
    const isFormValid = useMemo(() => {
        return username.trim().length > 0 && password.trim().length > 0 && email.trim().length > 0 && isAgree;
    }, [username, password, email, isAgree]);

    const router = useRouter(); //router digunakan untuk navigasi setelah register berhasil

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isFormValid || isLoading) return;

        try {
            setIsLoading(true);
            setMessage("");

            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setMessageType("error");
                setMessage(result.message || "Register gagal");
                return;
            }

            setMessageType("success");
            setMessage(result.message || "Register berhasil");

            setTimeout(() => {
                router.push("/home");
            }, 1200);
        } catch (error) {
            console.error("Register form error:", error);
            setMessageType("error");
            setMessage("Terjadi kesalahan saat menghubungkan ke server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Wrapper utama dibuat full screen agar card benar-benar center secara vertikal dan horizontal.
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
            {/* Background dekoratif dibuat soft agar tetap modern, cerah, dan tidak terlalu mencolok. */}
            <div className="absolute inset-0">
                <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
                <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(248,250,252,0.85),rgba(241,245,249,1))]" />
            </div>

            {/* Card register diberi animasi fade-up saat pertama kali muncul. */}
            <section className="relative w-full max-w-md animate-[fadeUp_.8s_ease-out] rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:rounded-3xl sm:p-8 lg:p-10">
                <div className="mb-6 text-center sm:mb-8">
                    {/* logo */}
                    <div className="mx-auto mb-4 flex items-center justify-center">
                        <Image
                            src="/logo_ecommerce1.png"
                            alt="Logo Ecommerce"
                            width={60}
                            height={60}
                            className="object-contain transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95"
                        />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Welcome back!
                    </h1>
                    <p className="mt-2 text-sm leading-5 text-slate-500 sm:leading-6">
                        Please sign up to continue
                    </p>
                </div>

                {/* Feedback message diberi animasi transisi agar tampil lebih smooth. */}
                <div
                    className={`mb-4 grid transition-all duration-300 ${
                        message ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        <div
                            className={`flex items-start justify-between gap-2 rounded-2xl px-3 py-3 text-sm sm:gap-3 sm:px-4 ${
                                messageType === "success"
                                    ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                                    : "border border-red-100 bg-red-50 text-red-700"
                            }`}
                        >
                        
                            {/* Text message */}
                            <span className="leading-relaxed">{message}</span>

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setMessage("")}
                                className={`mt-0.5 rounded-md p-1 transition ${
                                    messageType === "success"
                                        ? "text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                                        : "text-red-500 hover:bg-red-100 hover:text-red-700"
                                }`}
                                aria-label="Close message"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="text-sm font-medium text-slate-700"
                        >
                            Username
                        </label>

                        {/* Input dibuat dengan focus ring halus agar terasa interaktif dan profesional. */}
                        <div className="group rounded-2xl border border-slate-200 bg-white transition-all duration-300 focus-within:border-sky-300 focus-within:shadow-[0_0_0_4px_rgba(186,230,253,0.45)] hover:border-slate-300">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (message) setMessage("");
                                }}
                                placeholder="Enter your username"
                                autoComplete="username"
                                className="h-11 w-full rounded-2xl bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-slate-700"
                        >
                            Email
                        </label>

                        {/* Input dibuat dengan focus ring halus agar terasa interaktif dan profesional. */}
                        <div className="group rounded-2xl border border-slate-200 bg-white transition-all duration-300 focus-within:border-sky-300 focus-within:shadow-[0_0_0_4px_rgba(186,230,253,0.45)] hover:border-slate-300">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (message) setMessage("");
                                }}
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="h-11 w-full rounded-2xl bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        {/* Wrapper jadi relative supaya icon bisa absolute */}
                        <div className="group relative rounded-2xl border border-slate-200 bg-white transition-all duration-300 focus-within:border-sky-300 focus-within:shadow-[0_0_0_4px_rgba(186,230,253,0.45)] hover:border-slate-300">
                            
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (message) setMessage("");
                                }}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="h-11 w-full rounded-2xl bg-transparent px-4 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:h-12"
                            />

                            {/* Icon mata di dalam input */}
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors duration-200 hover:text-slate-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <i className="ri-eye-off-fill pointer-events-none text-lg"></i>
                                ) : (
                                    <i className="ri-eye-fill pointer-events-none text-lg"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="pt-1">
                        <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-500">
                            <input
                                type="checkbox"
                                checked={isAgree}
                                onChange={(e) => setIsAgree(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-700 cursor-pointer"
                            />
                            <span>
                                I agree to the{" "}
                                <Link
                                    href="#"
                                    className="font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
                                >
                                    Terms of Use
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="#"
                                    className="font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        // Tombol punya state hover, active, disabled, dan loading agar pengalaman terasa hidup.
                        className="group relative flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-12"
                    >
                        <span
                            className={`absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 ${
                            isLoading ? "translate-x-full" : "-translate-x-full group-hover:translate-x-full"
                            }`}
                        />

                        <span className="relative flex items-center gap-2">
                            {isLoading && (
                                // Loader sederhana memakai border spinner agar tidak perlu library tambahan.
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            )}
                            {isLoading ? "Signing up..." : "Sign up"}
                        </span>
                    </button>
                </form>

                <p className="mt-5 text-center text-[11px] text-slate-500 sm:mt-6 sm:text-xs">
                    Already have an account?{" "} 
                    <Link
                        href="/login"
                        className="font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900"
                    >
                        Sign in
                    </Link>
                </p>
            </section>

            {/* Style keyframes ditaruh langsung di file agar sesuai permintaan single file page.tsx. */}
            <style jsx>
                {`
                    @keyframes fadeUp {
                        from {
                        opacity: 0;
                        transform: translateY(24px) scale(0.98);
                        }
                        to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
        </main>
    );
}
