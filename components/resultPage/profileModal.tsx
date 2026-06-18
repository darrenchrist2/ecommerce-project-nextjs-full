// components/profile/ProfileButton.tsx
"use client";

import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    CalendarDays,
    Edit3,
    Save,
    X,
} from "lucide-react";

type UserData = {
    id?: number;
    username?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
};

export default function ProfileButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [userData, setUserData] = useState<UserData>({
        username: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");

        if (!storedUser) return;

        try {
            const parsedUser: UserData = JSON.parse(storedUser);

            setUserData({
                id: parsedUser.id,
                username: parsedUser.username || "",
                email: parsedUser.email || "",
                phoneNumber: parsedUser.phoneNumber || "",
                dateOfBirth: parsedUser.dateOfBirth || "",
            });
        } catch (error) {
            console.error("Gagal membaca data user:", error);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const closeModal = () => {
        setIsOpen(false);
        setIsEditing(false);
    };

    const handleChange = (field: keyof UserData, value: string) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        try {
            localStorage.setItem("userData", JSON.stringify(userData));
            setIsEditing(false);
        } catch (error) {
            console.error("Gagal menyimpan data user:", error);
        }
    };

    const profileFields = [
        {
            label: "Username",
            value: userData.username,
            field: "username" as keyof UserData,
            icon: UserRound,
            type: "text",
            placeholder: "Masukkan username",
        },
        {
            label: "Email",
            value: userData.email,
            field: "email" as keyof UserData,
            icon: Mail,
            type: "email",
            placeholder: "Masukkan email",
        },
        {
            label: "Phone Number",
            value: userData.phoneNumber,
            field: "phoneNumber" as keyof UserData,
            icon: Phone,
            type: "tel",
            placeholder: "Masukkan nomor telepon",
        },
        {
            label: "Date of Birth",
            value: userData.dateOfBirth,
            field: "dateOfBirth" as keyof UserData,
            icon: CalendarDays,
            type: "date",
            placeholder: "Masukkan tanggal lahir",
        },
    ];

    return (
        <>
            {/* Profile Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Buka profile"
                className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-95 sm:h-12 sm:w-12"
            >
                <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[999] flex min-h-screen items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={closeModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-modal-title"
                        onMouseDown={(event) => event.stopPropagation()}
                        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* Header Modal */}
                        <div className="relative bg-slate-900 px-5 py-6 text-white sm:px-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Tutup modal"
                                className="cursor-pointer absolute right-4 top-4 rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/10">
                                    <UserRound className="h-7 w-7" />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="profile-modal-title"
                                        className="truncate text-lg font-semibold sm:text-xl"
                                    >
                                        {userData.username || "Guest User"}
                                    </h2>
                                    <p className="mt-1 truncate text-sm text-slate-300">
                                        {userData.email || "Email belum tersedia"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Modal */}
                        <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-6 sm:px-6">
                            {profileFields.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.field}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                            <Icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </div>

                                        {isEditing ? (
                                            <input
                                                type={item.type}
                                                value={item.value || ""}
                                                onChange={(event) =>
                                                    handleChange(item.field, event.target.value)
                                                }
                                                placeholder={item.placeholder}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                            />
                                        ) : (
                                            <p className="break-words text-sm font-semibold text-slate-800">
                                                {item.value || "Belum diisi"}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Button */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="cursor-pointer w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95 sm:w-auto"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-95 sm:w-auto"
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="h-4 w-4" />
                                        Edit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}