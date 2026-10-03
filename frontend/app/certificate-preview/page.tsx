"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFileInvoice, FaLandmark } from "react-icons/fa";

/* ------------------------------------------------------------------
   UI-only style tokens (same system as the rest of the portal)
------------------------------------------------------------------ */
const btnBase =
  "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";
const btnPrimary = `${btnBase} bg-[#12285a] text-white shadow-sm hover:bg-[#0a1f44] focus-visible:ring-blue-700`;

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
    <div className="min-h-screen overflow-x-hidden bg-[#e9edf4] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">

        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-[#12285a]" />

        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#12285a] text-amber-400 shadow-sm">
              <FaLandmark size={18} />
            </span>
            <div className="min-w-0 leading-snug">
              <h1 className="truncate text-lg font-bold text-[#12285a] sm:text-xl">
                Certificate Preview
              </h1>
              <p className="truncate text-sm text-slate-600">
                Collector Office, Ahilyanagar
              </p>
            </div>
          </div>

          <button
            onClick={() => {

              router.push("/user");

            }}
            className={`${btnPrimary} shrink-0`}
          >
            <FaArrowLeft size={12} />
            Back to Portal
          </button>

        </div>

      </header>

      {/* DOCUMENT AREA */}
      <main className="flex justify-center px-3 py-6 sm:px-6 sm:py-8">

        {image ? (
          <img
            src={`data:image/png;base64,${image}`}
            alt="Certificate Preview"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            className="w-[850px] max-w-full select-none rounded-sm border border-slate-300 bg-white shadow-2xl ring-1 ring-slate-900/5"
          />
        ) : (
          <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <FaFileInvoice size={36} className="mb-3 text-slate-300" />
            <p className="text-lg font-semibold text-slate-800">
              No preview image found
            </p>
          </div>
        )}

      </main>

    </div>
  );
}