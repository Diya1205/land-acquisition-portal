"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function CertificatePreview() {
  const router = useRouter();
  const [image, setImage] =
    useState("");


  useEffect(() => {
  const disableRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  document.addEventListener(
    "contextmenu",
    disableRightClick
  );

  return () => {
    document.removeEventListener(
      "contextmenu",
      disableRightClick
    );
  };
}, []);

  useEffect(() => {

    const img =
      sessionStorage.getItem(
        "previewImage"
      );

    if (img) {
      setImage(img);
    }

  }, []);

  return (
      <div className="min-h-screen bg-gray-100">
    
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
    
          <h1 className="text-xl font-semibold text-gray-800">
            Certificate Preview
          </h1>
    
          <button 
            onClick={() => {
            
              router.push("/user");
            
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            Back to Portal
          </button>
    
        </div>
    
        <div className="flex justify-center p-8">
    
          {image ? (
            <img
              src={`data:image/png;base64,${image}`}
              alt="Certificate Preview"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              className="w-[850px] max-w-full shadow-2xl border border-gray-300 rounded-lg select-none"
            />
          ) : (
            <div>No preview image found</div>
          )}
    
        </div>
      
      </div>
    );
}