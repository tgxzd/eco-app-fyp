"use client";

import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";
import { useState, useTransition, useRef, useCallback, useEffect } from "react";
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

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'air-pollution':
        return 'from-red-500 to-orange-500';
      case 'water-pollution':
        return 'from-blue-500 to-cyan-500';
      case 'wildfire':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
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

  // Function to get user's location
  const getUserLocation = useCallback(() => {
    setIsLoadingLocation(true);
    setMessage("");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Attempt to get address using reverse geocoding
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = data.results[0]?.formatted_address || "Unknown location";
              
              setLocation({
                latitude,
                longitude,
                address
              });
            } else {
              setLocation({
                latitude,
                longitude,
                address: "Unknown location"
              });
            }
          } catch {
            // If geocoding fails, just use coordinates
            setLocation({
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            });
          }
          
          setIsLoadingLocation(false);
        },
        (error) => {
          setIsLoadingLocation(false);
          setMessageType("error");
          
          let errorMsg = "Unable to retrieve your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Location access denied. Please enable location services to continue.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "Location request timed out.";
              break;
          }
          
          setMessage(errorMsg);
        }
      );
    } else {
      setIsLoadingLocation(false);
      setMessageType("error");
      setMessage("Geolocation is not supported by your browser");
    }
  }, []);

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
    } catch (error) {
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
        setMessage("An error occurred while creating the report.");
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper2.jpg"
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
        
        <div className="max-w-3xl mx-auto mt-12">
          <div className="text-center mb-8">
            <div className="mb-2 w-24 h-1 bg-amber-700 mx-auto"></div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wider uppercase text-amber-100">
              Create Environmental Report
            </h1>
            <div className="mt-2 w-24 h-1 bg-amber-700 mx-auto"></div>
          </div>
          
          {message && (
            <div className={`border-l-2 border-amber-700 bg-black/40 p-4 mb-6 text-amber-100 font-serif text-center ${
              messageType === "error" ? "border-red-600" : "border-amber-700"
            }`}>
              <p>{message}</p>
            </div>
          )}

          {/* Show category banner if selected */}
          {selectedCategory && (
            <div className="mb-6">
              <div className="w-full overflow-hidden rounded-lg border-2 border-amber-700/50">
                <div className="bg-black/40 p-8 text-center">
                  <div className="text-[100px] mb-4 animate-fade-in">
                    {getCategoryIcon(selectedCategory)}
                  </div>
                  <div className="font-serif text-amber-100">
                    <p className="text-lg uppercase tracking-widest mb-2">Detected Category</p>
                    <h2 className="text-4xl font-bold mb-4 text-amber-500">
                      {categoryDisplayNames[selectedCategory as keyof typeof categoryDisplayNames]}
                    </h2>
                    <div className="w-24 h-1 bg-amber-700 mx-auto mb-4"></div>
                    {!showReportForm && (
                      <button
                        onClick={() => setShowReportForm(true)}
                        className="mt-2 px-8 py-3 border-2 border-amber-700 text-amber-100 hover:bg-amber-700/20 transition-all duration-300 uppercase tracking-widest font-serif"
                      >
                        Continue with this category
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!showReportForm ? (
            <div className="bg-black/40 border-t-2 border-b-2 border-amber-700/50 p-6 md:p-8">
              <h2 className="font-serif text-xl text-amber-100 mb-6 text-center">
                Describe the Environmental Issue
              </h2>
              
              <form onSubmit={handleAISubmit}>
                <div className="mb-6">
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-black/30 border-0 border-b-2 border-amber-700/70 text-amber-100 placeholder-amber-100/50 focus:border-amber-700 focus:outline-none focus:ring-0 font-serif"
                    placeholder="Describe what you observe about the environmental issue..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessingAI}
                  className="w-full px-8 py-3 bg-transparent text-amber-100 font-serif border-2 border-amber-700 hover:bg-amber-700/20 transition-colors duration-300 uppercase tracking-widest"
                >
                  {isProcessingAI ? "Processing..." : "Analyze Description"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-black/40 border-t-2 border-b-2 border-amber-700/50 p-6 md:p-8">
              <button 
                onClick={handleBack}
                className="mb-4 text-amber-700 font-serif flex items-center hover:text-amber-500 transition-colors"
              >
                ← Back
              </button>
              
              <h2 className="font-serif text-xl text-amber-100 mb-6">
                Add Details to Your Report
              </h2>
              
              <form action={handleSubmit} id="report-form">
                {/* Location Information Section */}
                <div className="mb-6">
                  <div className="bg-black/30 border border-amber-700/50 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-amber-100 font-serif">Location Information</h3>
                      <button
                        type="button"
                        onClick={getUserLocation}
                        className="px-3 py-1 bg-amber-700/70 text-amber-100 font-serif text-sm hover:bg-amber-700 transition-colors"
                        disabled={isLoadingLocation}
                      >
                        {isLoadingLocation ? "Getting location..." : "Refresh Location"}
                      </button>
                    </div>
                    
                    {location ? (
                      <div className="text-amber-100 font-serif text-sm">
                        <p>Latitude: {location.latitude}</p>
                        <p>Longitude: {location.longitude}</p>
                        <p>Address: {location.address}</p>
                      </div>
                    ) : (
                      <p className="text-amber-100/70 font-serif text-sm">
                        {isLoadingLocation ? "Fetching location..." : "No location data available"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-amber-100 font-serif mb-2">
                    Add Image Evidence
                  </label>
                  
                  {showWebcam ? (
                    <div className="border-2 border-amber-700/50">
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
                      <div className="flex justify-between p-4 bg-black/70">
                        <button
                          type="button"
                          onClick={() => setShowWebcam(false)}
                          className="px-4 py-2 bg-gray-800 text-amber-100 font-serif"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCapture}
                          className="px-4 py-2 bg-amber-700 text-amber-100 font-serif"
                        >
                          Capture
                        </button>
                      </div>
                    </div>
                  ) : image ? (
                    <div className="relative border-2 border-amber-700/50">
                      <Image 
                        src={image} 
                        alt="Report evidence" 
                        width={500} 
                        height={300}
                        className="w-full h-auto max-h-[400px] object-contain bg-black/50"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-amber-100 flex items-center justify-center hover:bg-black/80"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mb-4">
                      <div className="border-2 border-dashed border-amber-700/50 p-8 w-full flex flex-col items-center">
                        <p className="text-amber-100 font-serif mb-4">Upload an image or take a photo</p>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setShowWebcam(true)}
                            className="px-4 py-2 bg-amber-700 text-amber-100 font-serif"
                          >
                            Open Camera
                          </button>
                          <label className="px-4 py-2 bg-amber-700 text-amber-100 font-serif cursor-pointer">
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
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full px-8 py-3 bg-transparent text-amber-100 font-serif border-2 border-amber-700 hover:bg-amber-700/20 transition-colors duration-300 uppercase tracking-widest"
                >
                  {isPending ? "Creating Report..." : "Create Report"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
