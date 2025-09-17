"use client";

import Link from "next/link";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/layout/Testimonials";
import { useAppSelector } from "@/hook/useAppSelector";
import { Globe2, PencilLine, History } from "lucide-react";

export default function Homepage() {
  const user = useAppSelector((state) => state.auth.user);

  const features = [
    {
      href: "/translate",
      title: "Translate Tool",
      desc: "Translate text between multiple languages quickly and accurately.",
      Icon: Globe2,
      badgeClass: "bg-blue-50 text-blue-600 ring-blue-200",
    },
    {
      href: "/grade",
      title: "Grade Writing",
      desc: "Get instant feedback on your IELTS Writing tasks with AI grading.",
      Icon: PencilLine,
      badgeClass: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    },
    {
      href: "/grade-list",
      title: "Grade History",
      desc: "Review your graded essays and track your progress over time.",
      Icon: History,
      badgeClass: "bg-amber-50 text-amber-600 ring-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      {/* Hero */}
      <section className="py-16 px-6 text-center mt-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Hi{user?.name ? `, ${user.name}` : ""}! 🚀
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          What do you want to work on today?
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-4">
          Choose a tool below to start improving your IELTS skills with AI.
        </p>
      </section>

      {/* Features: 1 hàng ở desktop (md:3 cols) */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          {features.map(({ href, title, desc, Icon, badgeClass }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg hover:border-teal-200 transition"
            >
              <div
                className={`h-12 w-12 rounded-full grid place-items-center ring-8 ${badgeClass} shrink-0`}
                aria-hidden
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-700">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <Testimonials />
      </section>

      <Footer />
    </div>
  );
}
