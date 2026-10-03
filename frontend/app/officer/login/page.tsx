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
  FaLandmark,
} from "react-icons/fa";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ------------------------------------------------------------------
   UI-only style tokens (same system as the rest of the portal)
------------------------------------------------------------------ */
const btnBase =
  "inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
const btnPrimary = `${btnBase} bg-[#12285a] text-white shadow-sm hover:bg-[#0a1f44] focus-visible:ring-blue-700`;
const btnOutline = `${btnBase} border border-[#12285a] bg-white text-[#12285a] hover:bg-blue-50 focus-visible:ring-blue-700`;
const fieldLabel = "mb-1 block text-sm font-semibold text-slate-700";
const inputCls =
  "h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-500 transition focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/25";

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
         `${API_BASE}/designations/`
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
        `${API_BASE}/officer/login/`,
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

  // Presentation-only react-select theme
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "40px",
      borderRadius: "6px",
      backgroundColor: "#ffffff",
      border: state.isFocused
        ? "1px solid #1d4ed8"
        : "1px solid #cbd5e1",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.2)" : "none",
      "&:hover": {
        border: "1px solid #1d4ed8",
      },
      fontSize: "14px",
      transition: "all 0.15s ease",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 10px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "40px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "10px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow: "0 12px 28px -8px rgba(10,31,68,0.25)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? "white" : "#0f172a",
      backgroundColor: state.isSelected
        ? "#0f2a5f"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      cursor: "pointer",
      padding: "9px 12px",
      fontSize: "14px",
      lineHeight: 1.5,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#0f172a",
      fontWeight: 500,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#64748b",
      fontSize: "14px",
    }),
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

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <FaShieldAlt size={10} className="text-amber-600" />
                Official Government Portal
              </span>
              <span className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-[#12285a]">
                Officer Login
              </span>
            </div>

          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800"
            >
              <FaExclamationCircle className="shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">

            <div>

              <label className={fieldLabel}>
                Designation
              </label>

              <Select
                aria-label="Designation"
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

              <label htmlFor="officer-password" className={fieldLabel}>
                Password
              </label>

              <div className="relative">

                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={13} />

                <input
                  id="officer-password"
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
                  className={inputCls}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>

              </div>

            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={btnPrimary}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Logging In...
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
              <span className="text-xs font-semibold text-slate-500">Public Users</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              href="/"
              className={btnOutline}
            >
              <FaUser size={12} />
              User Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}