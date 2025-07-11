"use client";

import { useEffect, useState } from "react";
import { apiCore } from "@/api/ApiCore";
import { useAppSelector } from "@/store/hooks/hooks";
import { selectToken } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import Image from "next/image";

const countryStateMap: Record<string, string[]> = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  USA: ["California", "Florida", "New York", "Texas", "Washington"],
  UK: ["England", "Scotland", "Wales", "Northern Ireland"],
};

export default function ContactFormSection() {
  const token = useAppSelector(selectToken);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    city: "",
    state: "",
    country: "",
    subject: "",
    message: "",
  });

  const [availableStates, setAvailableStates] = useState<string[]>([]);

  useEffect(() => {
    if (formData.country) {
      setAvailableStates(countryStateMap[formData.country] || []);
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to submit the form.");
      return;
    }

    try {
      setLoading(true);
      await apiCore("/connect/contact_form", "POST", formData, token);
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        city: "",
        state: "",
        country: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-8 py-16 relative">
      {/* Fallback Background for mobile */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <Image
          src="/BG2.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>

      {/* ✅ Wrapped both left & right parts inside a container */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl border border-pink-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Contact Us
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-pink-300 rounded-md px-4 py-2 focus:outline-pink-500 bg-white"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-pink-300 rounded-md px-4 py-2 focus:outline-pink-500 bg-white"
            />
            <input
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="border border-pink-300 rounded-md px-4 py-2 focus:outline-pink-500 bg-white"
            />
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="border border-pink-300 rounded-md px-4 py-2 focus:outline-pink-500 bg-white"
            />

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="border border-pink-300 rounded-md px-4 py-2 text-gray-600 bg-white w-full"
            >
              <option value="">Select Country</option>
              {Object.keys(countryStateMap).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={!formData.country}
              className="border border-pink-300 rounded-md px-4 py-2 text-gray-600 bg-white w-full"
            >
              <option value="">Select State</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <input
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="col-span-1 sm:col-span-2 border border-pink-300 rounded-md px-4 py-2 bg-white"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="col-span-1 sm:col-span-2 border border-pink-300 rounded-md px-4 py-2 bg-white"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="col-span-1 sm:col-span-2 mt-2 bg-[#213E5A] text-white font-semibold py-2 rounded hover:bg-[#1A314A] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="w-full lg:w-1/2 h-[550px] relative">
          <Image
            src="/BG2.jpg"
            alt="Contact Visual"
            fill
            className="object-cover rounded-2xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
