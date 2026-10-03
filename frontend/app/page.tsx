"use client";

import { useState } from "react";
import { FaMobileAlt, FaShieldAlt, FaExclamationCircle, FaArrowRight, FaUserShield, FaLandmark } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ------------------------------------------------------------------
   UI-only style tokens (same system as the rest of the portal)
------------------------------------------------------------------ */
const btnBase =
  "inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
const btnPrimary = `${btnBase} bg-[#12285a] text-white shadow-sm hover:bg-[#0a1f44] focus-visible:ring-blue-700`;
const btnOutline = `${btnBase} border border-[#12285a] bg-white text-[#12285a] hover:bg-blue-50 focus-visible:ring-blue-700`;
const fieldLabel = "mb-1 block text-sm font-semibold text-slate-700";
const inputCls =
  "h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 transition focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/25";

export default function LoginPage() {
    const [mobileNumber, setMobileNumber] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {

      setError("");

      if (!mobileNumber.trim()) {
        setError("Please enter mobile number");
        return;
      }

      try {

        setLoading(true);

        const response = await axios.post(
          `${API_URL}/login/`,
          {
            mobile_number: mobileNumber
          }
        );

        if (response.data.success) {

        localStorage.setItem(
          "mobile_number",
          mobileNumber
        );
      
        if (response.data.last_request) {
        
          localStorage.setItem(
            "last_request",
            JSON.stringify(
              response.data.last_request
            )
          );
        
        } else {
        
          localStorage.removeItem(
            "last_request"
          );
        
        }
      
        router.push("/user");
      }

      } catch (err) {

        setError(
          "Unable to login"
        );

      } finally {

        setLoading(false);
      }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#eef3fa] px-4 py-6 [background-image:linear-gradient(rgba(18,40,90,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(18,40,90,0.06)_1px,transparent_1px)] [background-size:26px_26px]">

            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">

                <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-[#12285a]" />

                <div className="p-6 sm:p-7">

                    <div className="mb-5 text-center">

                        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#12285a] text-amber-400 shadow-sm">
                            <FaLandmark size={26} />
                        </span>

                        <h1 className="text-2xl font-bold text-[#12285a]">
                            Collector Office, Ahilyanagar
                        </h1>

                        <p className="mt-1 text-base font-medium text-slate-700">
                            Land Acquisition Certificate Portal
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                            Search Land Acquisition Records and Generate Certificates Online
                        </p>

                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            <FaShieldAlt size={10} className="text-amber-600" />
                            Official Government Portal
                        </span>

                    </div>

                    <div className="space-y-4">

                        <div>
                            <label htmlFor="user-mobile" className={fieldLabel}>
                                Mobile Number
                            </label>

                            <div className="relative">
                                <FaMobileAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={13} />

                                <input
                                    id="user-mobile"
                                    type="text"
                                    value={mobileNumber}
                                    onChange={(e) =>
                                        setMobileNumber(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleLogin();
                                        }
                                    }}
                                    placeholder="Enter Mobile Number"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {error && (
                          <div
                            role="alert"
                            className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800"
                          >
                            <FaExclamationCircle className="shrink-0" size={13} />
                            {error}
                          </div>
                        )}

                        <button
                          onClick={handleLogin}
                          disabled={loading}
                          className={btnPrimary}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Login
                              <FaArrowRight size={12} />
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-3 pt-1">
                          <div className="h-px flex-1 bg-slate-200" />
                          <span className="text-xs font-semibold text-slate-500">Government Officers</span>
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <Link
                          href="/officer/login"
                          className={btnOutline}
                        >
                          <FaUserShield size={13} />
                          Officer Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}