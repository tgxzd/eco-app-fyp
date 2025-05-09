"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import NavHeader from "@/components/ui/nav-header";
import { useState, useTransition } from "react";
import { createReport } from "./action";

export default function CreateReport() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const handleSubmit = async (formData: FormData) => {
    setMessage("");
    
    startTransition(async () => {
      try {
        const result = await createReport(formData);
        
        if (result.success) {
          setMessageType("success");
          setMessage(result.message);
          // Reset the form
          const form = document.getElementById("report-form") as HTMLFormElement;
          form?.reset();
        } else {
          setMessageType("error");
          setMessage(result.message);
        }
      } catch (error) {
        setMessageType("error");
        setMessage("An error occurred while creating the report.");
        console.error(error);
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper4.jpg"
          alt="Background"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen p-8">
        <NavHeader />
        
        <div className="max-w-md mx-auto mt-12 bg-white/90 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Environmental Report</h1>
          
          {message && (
            <div className={`p-3 mb-4 rounded ${messageType === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message}
            </div>
          )}
          
          <form action={handleSubmit} id="report-form">
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the environmental issue..."
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue="environmental"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="environmental">Environmental</option>
                <option value="pollution">Pollution</option>
                <option value="wildlife">Wildlife</option>
                <option value="deforestation">Deforestation</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              {isPending ? "Creating Report..." : "Create Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
