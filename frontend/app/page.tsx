"use client";

import { useState } from "react";
import { FaMobileAlt, FaShieldAlt, FaExclamationCircle, FaArrowRight, FaUserShield } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
          "http://127.0.0.1:8000/api/login/",
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
        <div className="h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Decorative background accents */}
            <div className="absolute -top-28 -right-28 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 relative">

                <div className="text-center mb-5">

                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-200 mb-3">
                        <FaShieldAlt size={9} />
                        Official Government Portal
                    </span>

                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 ring-4 ring-blue-50 shadow-sm">
                        <span className="text-2xl">🏛️</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">
                        Collector Office
                    </h1>

                    <h2 className="text-xl font-bold text-slate-700 mt-0.5">
                        Ahilyanagar
                    </h2>

                    <p className="mt-2 text-gray-600 text-sm">
                        Land Acquisition Certificate Portal
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Search Land Acquisition Records and Generate Certificates Online
                    </p>

                </div>

                <div className="space-y-3">

                    <div>
                        <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                            Mobile Number
                        </label>

                        <div className="relative">
                            <FaMobileAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                            <input
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
                                className="w-full border-2 border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-medium">
                        <FaExclamationCircle className="shrink-0" size={12} />
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
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
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Or</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="text-center">

                      <p className="text-xs text-gray-500 mb-2">
                        Government Officers
                      </p>

                      <Link
                        href="/officer/login"
                        className="inline-flex items-center gap-2 px-5 py-1.5 border-2 border-blue-700 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:text-white transition"
                      >
                        <FaUserShield size={12} />
                        Officer Login
                      </Link>

                    </div>
                </div>

            </div>

        </div>
    );
}