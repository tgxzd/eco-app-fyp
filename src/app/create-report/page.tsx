"use client";

import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";
import Background from "@/components/Background";
import { useState, useTransition, useRef, useCallback } from "react";
import { createReport } from "./action";
import Webcam from "react-webcam";
import { queryFlowiseAI } from '@/lib/flowiseAI';

export default function CreateReport() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [location, setLocation] = useState<{latitude: number; longitude: number; address: string} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);

  const categoryMap = {
    'AIR-POLLUTION': 'air-pollution',
    'WATER-POLLUTION': 'water-pollution',
    'WILDFIRE': 'wildfire'
  };

  const categoryDisplayNames = {
    'air-pollution': 'Air Pollution',
    'water-pollution': 'Water Pollution',
    'wildfire': 'Wildfire'
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'air-pollution':
        return '🌫️';
      case 'water-pollution':
        return '💧';
      case 'wildfire':
        return '🔥';
      default:
        return '❓';
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use Google Maps Geocoding API instead of OpenCage
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
          const data = await response.json();
          
          let address = `${latitude}, ${longitude}`; // Default fallback
          
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            address = data.results[0].formatted_address;
          } else {
            console.error('Google Maps API error:', data.status, data.error_message);
          }
          
          setLocation({
            latitude,
            longitude,
            address: address
          });
        } catch (error) {
          console.error('Error fetching address:', error);
          setLocation({
            latitude,
            longitude,
            address: `${latitude}, ${longitude}`
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Unable to retrieve your location:", error);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim() || isProcessingAI) return;

    setIsProcessingAI(true);
    setMessage("");
    
    try {
      const response = await queryFlowiseAI({ question: userPrompt.trim() });
      
      if (response.route === 'REASK') {
        setMessageType("error");
        setMessage("Please provide more specific details about the environmental issue.");
        return;
      }
      
      const mappedCategory = categoryMap[response.route as keyof typeof categoryMap];
      if (mappedCategory) {
        setSelectedCategory(mappedCategory);
        setShowReportForm(true);
      } else {
        setMessageType("error");
        setMessage("Unable to categorize the environmental issue. Please try again with more specific details.");
      }
    } catch {
      setMessageType("error");
      setMessage("An error occurred while processing your description. Please try again.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setShowReportForm(false);
    setImage(null);
    setShowWebcam(false);
    setUserPrompt("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          setShowWebcam(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setShowWebcam(false);
    }
  }, [webcamRef]);

  const handleSubmit = async (formData: FormData) => {
    setMessage("");
    
    if (!selectedCategory) return;
    
    // Add the selected category and description to the form data
    formData.append("category", selectedCategory);
    formData.append("description", userPrompt); // Use the AI prompt as description
    
    // Add location data if available
    if (location) {
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("address", location.address);
    }
    
    // Add the image if available
    if (image) {
      // Convert base64 to blob
      const blob = await fetch(image).then(res => res.blob());
      formData.append("image", blob, "report-image.jpg");
    }
    
    startTransition(async () => {
      try {
        const result = await createReport(formData);
        
        if (result.success) {
          setMessageType("success");
          setMessage(result.message);
          // Reset the form and selection
          handleBack();
        } else {
          setMessageType("error");
          setMessage(result.message);
        }
      } catch {
        setMessageType("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <>
      <Background variant="web3-emerald" />
      <div className="min-h-screen relative z-10">
        <NavHeader />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-500/30">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 lg:mb-8 tracking-tight">
              Create Report
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed px-4">
              Document environmental issues and contribute to our understanding of environmental challenges
            </p>
          </div>

          {/* Alert Messages */}
          {message && (
            <div className={`mb-8 lg:mb-16 mx-4 sm:mx-0 p-6 lg:p-8 rounded-2xl backdrop-blur-sm border ${
              messageType === "error" 
                ? "bg-red-500/10 border-red-500/30 text-red-300" 
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  {messageType === "error" ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="font-medium text-sm sm:text-base">{message}</p>
              </div>
            </div>
          )}

          {/* Category Detection Banner */}
          {selectedCategory && (
            <div className="mb-8 lg:mb-16 mx-4 sm:mx-0">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 px-6 sm:px-8 lg:px-12 py-8 lg:py-12 text-center">
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 lg:mb-6">{getCategoryIcon(selectedCategory)}</div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 lg:mb-4">
                    {categoryDisplayNames[selectedCategory as keyof typeof categoryDisplayNames]}
                  </h2>
                  <p className="text-white/60 font-light text-sm sm:text-base lg:text-lg">Category detected from your description</p>
                </div>
                {!showReportForm && (
                  <div className="p-6 sm:p-8 lg:p-12 text-center">
                    <button
                      onClick={() => setShowReportForm(true)}
                      className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                    >
                      Continue with this category
                      <svg className="ml-2 sm:ml-3 h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 mx-4 sm:mx-0">
            {!showReportForm ? (
              /* Description Form */
              <div className="p-6 sm:p-8 lg:p-16">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 lg:mb-6">
                      Describe the Environmental Issue
                    </h2>
                    <p className="text-white/60 font-light text-base sm:text-lg lg:text-xl leading-relaxed px-4">
                      Provide a detailed description of what you&apos;ve observed
                    </p>
                  </div>
                  
                  <form onSubmit={handleAISubmit} className="space-y-6 lg:space-y-10">
                    <div>
                      <label className="block text-base sm:text-lg lg:text-xl font-light text-white/80 mb-4 lg:mb-6">
                        Issue Description
                      </label>
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        rows={6}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 lg:py-5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 resize-none text-white placeholder-white/40 font-light text-sm sm:text-base"
                        placeholder="Describe what you observe about the environmental issue..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isProcessingAI || !userPrompt.trim()}
                      className="w-full flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 lg:py-5 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 disabled:border-white/10 text-sm sm:text-base lg:text-lg"
                    >
                      {isProcessingAI ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Analyze Description
                          <svg className="ml-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Report Details Form */
              <div className="p-6 sm:p-8 lg:p-16">
                <div className="flex items-center justify-between mb-8 lg:mb-16">
                  <button 
                    onClick={handleBack}
                    className="inline-flex items-center text-white/60 hover:text-white transition-colors font-light text-sm sm:text-base"
                  >
                    <svg className="mr-2 h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to description
                  </button>
                  <span className="text-white/40 font-light text-xs sm:text-sm">Step 2 of 2</span>
                </div>

                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 lg:mb-6">
                      Complete Your Report
                    </h2>
                    <p className="text-white/60 font-light text-base sm:text-lg lg:text-xl leading-relaxed px-4">
                      Add location details and photographic evidence
                    </p>
                  </div>

                  <form action={handleSubmit} className="space-y-8 lg:space-y-12">
                    {/* Location Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white flex items-center">
                          <svg className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Location Information
                        </h3>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isLoadingLocation}
                          className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 disabled:border-white/10 font-light whitespace-nowrap"
                        >
                          {isLoadingLocation ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Getting...
                            </>
                          ) : (
                            <>
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Refresh
                            </>
                          )}
                        </button>
                      </div>
                      
                      {location ? (
                        <div className="space-y-3 text-white/70 font-light">
                          <div className="flex justify-between py-2">
                            <span>Latitude:</span>
                            <span className="text-white">{location.latitude.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span>Longitude:</span>
                            <span className="text-white">{location.longitude.toFixed(6)}</span>
                          </div>
                          <div className="pt-4 border-t border-white/10">
                            <span className="block mb-2">Address:</span>
                            <p className="text-white leading-relaxed">{location.address}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-white/50 font-light">
                            {isLoadingLocation ? "Fetching location..." : "Click &apos;Refresh&apos; to get your current location"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-lg sm:text-xl lg:text-2xl font-light text-white mb-4 lg:mb-8">
                        <svg className="inline mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Photo Evidence
                      </label>
                      
                      {showWebcam ? (
                        <div className="bg-black rounded-2xl overflow-hidden border border-white/20">
                          <Webcam
                            audio={false}
                            height={400}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{
                              width: 640,
                              height: 480,
                              facingMode: "environment"
                            }}
                            ref={webcamRef}
                            className="w-full"
                          />
                          <div className="flex justify-between p-6 bg-black/50 backdrop-blur-sm">
                            <button
                              type="button"
                              onClick={() => setShowWebcam(false)}
                              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 font-light"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCapture}
                              className="px-6 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 font-light"
                            >
                              Capture Photo
                            </button>
                          </div>
                        </div>
                      ) : image ? (
                        <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                          <Image 
                            src={image} 
                            alt="Report evidence" 
                            width={500} 
                            height={300}
                            className="w-full h-auto max-h-96 object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 sm:p-12 lg:p-16 text-center hover:border-emerald-500/50 transition-all duration-300 bg-white/5 backdrop-blur-sm">
                          <svg className="mx-auto h-12 sm:h-16 lg:h-20 w-12 sm:w-16 lg:w-20 text-white/30 mb-4 sm:mb-6 lg:mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-white/60 mb-6 lg:mb-8 font-light text-base sm:text-lg lg:text-xl px-4">Add a photo to support your report</p>
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button
                              type="button"
                              onClick={() => setShowWebcam(true)}
                              className="inline-flex items-center px-6 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 font-light"
                            >
                              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Take Photo
                            </button>
                            <label className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-white/20 hover:border-white/30 font-light">
                              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 lg:py-6 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 disabled:border-white/10 text-base sm:text-lg lg:text-xl"
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Report...
                        </>
                      ) : (
                        <>
                          <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Report
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
