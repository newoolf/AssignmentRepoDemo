"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { useMedication } from "@Lib/api/MedicationService";
import { usePatient } from "@Lib/api/PatientService";
import { subtitle } from "@/components/primitives";
import Image from 'next/image';
import { Link } from "@heroui/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="bg-gray-50">
      {/* Navigate bar*/}
      <nav className="flex items-center justify-between px-20 py-3 shadow bg-white sticky top-0 z-10 w-full">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-gray-800">COMPLIANCE</span>
        </div>
        <div className="text-sm text-gray-700 font-medium">
          <Link href="/user">
            <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition">
              Medication Profile
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <motion.section
          className="flex flex-col-reverse md:flex-row items-center justify-between w-full px-4 sm:px-10 lg:px-20 py-16 gap-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Welcome Back!
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Stay on top of your prescriptions with personalized medication reminders!
            </p>
          </div>
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Image
              src="/medicationsPic.jpg"
              alt="pic of pills"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full max-w-lg"
              priority
            />
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="w-full px-4 sm:px-10 lg:px-20 py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-6xl mx-auto">
            {[{ icon: "💊", title: "Track Every Dose", desc: "Never miss a medication with smart reminders and alerts." },
              { icon: "📈", title: "Monitor Progress", desc: "Visualize your adherence and stay on track effortlessly." }].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <div className="text-gray-600 text-4xl mb-2">{item.icon}</div>
                <h3 className="text-gray-900 font-bold text-lg">{item.title}</h3>
                <p className="text-gray-900 text-sm mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonial Section*/}
        <motion.section
          className="w-full text-center mt-10 px-4 sm:px-10 lg:px-20 pb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <blockquote className="italic text-gray-600 text-lg max-w-4xl mx-auto">
            "This has helped me never miss a dose again. The reminders are spot on and it makes managing my meds so easy!"
          </blockquote>
          <p className="mt-2 text-sm text-gray-500">– A Real Patient</p>
        </motion.section>
      </main>
    </div>
  );
}