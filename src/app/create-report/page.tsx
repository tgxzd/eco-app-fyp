"use client";

import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";
import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { createReport } from "./action";
import Webcam from "react-webcam";

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

  const categories = [
    { id: "air-pollution", name: "Air Pollution", image: "/images/air-pollution.png" },
    { id: "water-pollution", name: "Water Pollution", image: "/images/water-pollution.png" },
    { id: "global-warming", name: "Global Warming", image: "/images/global-warming.png" },
    { id: "wildfire", name: "Wildfire", image: "/images/wildfire.png" },
  ];

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

  // Get location when component mounts if browser supports geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      getUserLocation();
    }
  }, [getUserLocation]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setImage(null);
    setShowWebcam(false);
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
    
    // Add the selected category to the form data
    formData.append("category", selectedCategory);
    
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
          const form = document.getElementById("report-form") as HTMLFormElement;
          form?.reset();
          setSelectedCategory(null);
          setImage(null);
          setShowWebcam(false);
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
          
          {!selectedCategory ? (
            <div className="bg-black/40 border-t-2 border-b-2 border-amber-700/50 p-6 md:p-8">
              <h2 className="font-serif text-xl text-amber-100 mb-6 text-center">
                Select Environmental Issue Category
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <div className="border-2 border-amber-700/50 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-36"
                      />
                    </div>
                    <p className="font-serif text-amber-100 text-center mt-2">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-black/40 border-t-2 border-b-2 border-amber-700/50 p-6 md:p-8">
              <button 
                onClick={handleBack}
                className="mb-4 text-amber-700 font-serif flex items-center hover:text-amber-500 transition-colors"
              >
                ← Back to Categories
              </button>
              
              <h2 className="font-serif text-xl text-amber-100 mb-6">
                Describe the {categories.find(c => c.id === selectedCategory)?.name} Issue
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
                      <div className="text-amber-100 font-serif">
                        <p className="mb-1"><span className="text-amber-400">Address:</span> {location.address}</p>
                        <p className="text-xs">
                          <span className="text-amber-400">Coordinates:</span> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-amber-100/70 font-serif italic">
                        {isLoadingLocation ? "Getting your location..." : "Location information not available"}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Image Capture/Upload Section */}
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

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-amber-100 font-serif mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    className="w-full px-4 py-3 bg-black/30 border-0 border-b-2 border-amber-700/70 text-amber-100 placeholder-amber-100/50 focus:border-amber-700 focus:outline-none focus:ring-0 font-serif"
                    placeholder="Describe the environmental issue in detail..."
                    required
                  />
                </div>
                
                {/* Hidden fields for location data */}
                {location && (
                  <>
                    <input type="hidden" name="latitude" value={location.latitude} />
                    <input type="hidden" name="longitude" value={location.longitude} />
                    <input type="hidden" name="address" value={location.address} />
                  </>
                )}
                
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
