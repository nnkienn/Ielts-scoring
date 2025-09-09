'use client'

import Image from "next/image"
import Link from "next/link"
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="bg-[#edf6f6] text-white py-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                {/* Cột 1: Logo + mô tả */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex items-center gap-2">
                        <img src="/images/imageLogoNavbar.png" alt="" width={32} height={32} className="rounded-lg" />
                        <span className="font-bold text-xl text-gray-600">
                            Scoring<span className="text-teal-600"> Ielts</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 max-w-xs">
                        ScoringIetls is a versatile AI-powered service helping people learn & write in a second language.
                    </p>
                </div>

                {/* Cột 2: Links + social */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-6 font-semibold">
                        <Link href="/privacy" className="hover:text-teal-400 border-b border-gray-400 text-teal-400">Privacy Policy</Link>
                    </div>
                    <div className="flex gap-4">
                        <Link href="https://facebook.com" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-teal-400 hover:text-white">
                            <FaFacebookF size={18} />
                        </Link>
                        <Link href="https://youtube.com" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-teal-400 hover:text-white">
                            <FaYoutube size={18} />
                        </Link>
                        <Link href="https://instagram.com" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-teal-400 hover:text-white">
                            <FaInstagram size={18} />
                        </Link>
                        <Link href="https://tiktok.com" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-teal-400 hover:text-white">
                            <FaTiktok size={18} />
                        </Link>
                    </div>
                </div>

                {/* Cột 3: Support + bản quyền */}
                <div className="flex flex-col items-center justify-center md:items-end gap-2">
                    <p className="text-sm">
                        <span className="font-bold text-teal-600">Support</span>{" "}
                        <Link href="mailto:support@nnkienn.me" className="text-teal-400 hover:underline">
                            support@nnkienn.me
                        </Link>
                    </p>
                 
                    <p className="text-xs text-gray-400">8:00 AM – 11:00 PM (GMT +7)</p>
                    <p className="text-xs text-gray-400">© Scoring Ielts made by Nnkienn 2025</p>
                </div>

            </div>
        </footer>
    )
}