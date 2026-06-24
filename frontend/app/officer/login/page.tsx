"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Select from "react-select";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaExclamationCircle,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";

export default function OfficerLogin() {

  const router = useRouter();

  const [designationId, setDesignationId] = useState("");
  const [designations, setDesignations] = useState<any[]>([]);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Presentational only — toggles password field visibility, does not affect login logic.
  const [showPassword, setShowPassword] = useState(false);

  const loadDesignations = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/designations/"
      );

      setDesignations(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    loadDesignations();

  }, []);

  const handleLogin = async () => {

    setError("");

    if (!designationId || !password) {

      setError(
        "Please select designation and enter password"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/officer/login/",
        {
          designation_id: designationId,
          password
        }
      );

      localStorage.setItem(
        "officer",
        JSON.stringify(response.data)
      );

      router.push(
        "/officer/dashboard"
      );

    } catch (err) {

      setError(
        "Invalid Designation or Password"
      );

    } finally {

      setLoading(false);

    }
  };
  
  const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "50px",
    borderRadius: "12px",
    border: state.isFocused
      ? "2px solid #3b82f6"
      : "2px solid #e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
    "&:hover": {
      border: "2px solid #3b82f6",
    },
    transition: "all 0.15s ease",
  }),

  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? "white" : "black",
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    cursor: "pointer",
    padding: "10px 14px",
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: "black",
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative background accents */}
      <div className="absolute -top-28 -right-28 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 relative">

        <div className="text-center mb-5">

          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 mb-4">
            <FaShieldAlt size={10} />
            Official Government Portal
          </span>

          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 ring-4 ring-blue-50 shadow-sm">
            <span className="text-4xl">🏛️</span>
          </div>

          <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide">
            Collector Office
          </h1>

          <h2 className="text-2xl font-bold text-slate-700 mt-1">
            Ahilyanagar
          </h2>

          <p className="mt-2 text-gray-600 text-base">
            Land Acquisition Certificate Portal
          </p>

          <p className="mt-1 text-sm text-gray-500 font-medium">
            Officer Login
          </p>

        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            <FaExclamationCircle className="shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-3">

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Designation
            </label>

            <Select
              styles={customSelectStyles}
              placeholder="Select Designation"
              isSearchable
              isClearable
              options={designations.map((d: any) => ({
                value: d.designation_id,
                label: d.designation,
              }))}
              value={
                designationId
                  ? {
                      value: designationId,
                      label:
                        designations.find(
                          (d: any) =>
                            String(d.designation_id) ===
                            String(designationId)
                        )?.designation || "",
                    }
                  : null
              }
              onChange={(selectedOption: any) =>
                setDesignationId(
                  selectedOption?.value?.toString() || ""
                )
              }
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                className="w-full border-2 border-gray-200 rounded-xl p-3 pl-11 pr-11 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>

            </div>

          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 text-base rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Logging In...
              </>
            ) : (
              <>
                Login
                <FaArrowRight size={13} />
              </>
            )}
          </button>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="text-center">

            <p className="text-sm text-gray-500 mb-3">
              Public Users
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2 border-2 border-blue-700 text-blue-700 rounded-xl font-semibold hover:bg-blue-700 hover:text-white transition"
            >
              <FaUser size={13} />
              User Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}