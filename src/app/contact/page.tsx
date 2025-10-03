"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";
import { ParticlesBackground } from "~/components/ui/particles-background";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    organization: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Create mailto link
      const subject = encodeURIComponent(`Contact Form: ${formData.name} from ${formData.organization}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Position: ${formData.position}\n` +
        `Organization: ${formData.organization}\n\n` +
        `Message:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:nirmalhaldar1545@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", position: "", organization: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 relative">
      <ParticlesBackground />
      <Navbar />
      
      <section className="px-4 py-24 pt-32 relative z-10">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
              Contact Us
            </h1>
            <p className="text-lg text-gray-400">
              Get in touch with our team to start your free trial
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-[#13FFAA] focus:outline-none focus:ring-2 focus:ring-[#13FFAA]/20"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-[#13FFAA] focus:outline-none focus:ring-2 focus:ring-[#13FFAA]/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="position" className="mb-2 block text-sm font-medium text-gray-300">
                  Position *
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g., Manager, Officer, Director"
                />
              </div>

              <div>
                <label htmlFor="organization" className="mb-2 block text-sm font-medium text-gray-300">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Your Government Office"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              {submitStatus === "success" && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-400">
                  Your email client will open shortly. Please send the email to complete your message.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
                  Something went wrong. Please try again or email us directly at nirmalhaldar1545@gmail.com
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="mt-12 grid gap-6 border-t border-gray-800 pt-12 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <FiMail className="text-xl text-blue-400" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Email</h3>
                  <p className="text-sm text-gray-400">contact@karya-mitra.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <FiPhone className="text-xl text-blue-400" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Phone</h3>
                  <p className="text-sm text-gray-400">+91 1234567890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <FiMapPin className="text-xl text-blue-400" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">Location</h3>
                  <p className="text-sm text-gray-400">New Delhi, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
