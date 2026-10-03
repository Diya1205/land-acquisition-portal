"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaEye,
  FaFilePdf,
  FaDownload,
  FaSignOutAlt,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaLandmark,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ------------------------------------------------------------------
   UI-only style tokens (same system as the user portal page)
------------------------------------------------------------------ */
const btnBase =
  "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
const btnPrimary = `${btnBase} bg-[#12285a] text-white shadow-sm hover:bg-[#0a1f44] focus-visible:ring-blue-700`;
const btnSecondary = `${btnBase} border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-500`;
const thCls =
  "whitespace-nowrap border-b-2 border-[#12285a] bg-white px-4 py-3 text-left text-sm font-bold text-[#12285a]";
const tdCls =
  "whitespace-nowrap border-b border-slate-100 px-4 py-3 text-sm leading-6 text-slate-900";
const detailLabel = "text-xs font-semibold text-slate-600";
const detailValue = "mt-0.5 text-sm font-semibold leading-6 text-slate-900";

export default function OfficerDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState<any>(null);

  useEffect(() => {

    const officer =
      localStorage.getItem("officer");

    if (!officer) {

      router.push("/officer/login");

      return;
    }

    const officerData =
      JSON.parse(officer);

    axios
      .get(
        `${API_BASE}/officer/requests/${officerData.officer_id}/`
      )
      .then((response) => {

        setRequests(response.data);

      })
      .catch((error) => {

        console.error(error);

      })
      .finally(() => {

        setLoading(false);

      });

  }, [router]);

  // Presentational helper only — maps the existing status string to a badge style.
  const getStatusBadgeClasses = (status: string) => {
    const s = (status || "").toLowerCase();

    if (s.includes("approved") || s.includes("complete") || s.includes("signed")) {
      return "inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800";
    }

    if (s.includes("reject") || s.includes("denied")) {
      return "inline-block rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800";
    }

    return "inline-block rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900";
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
            background: "#fff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
            lineHeight: 1.5,
          },
        }}
      />
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f3f5f9] p-3 text-slate-900 lg:h-screen lg:overflow-hidden">

        {/* HEADER */}
        <header className="relative mb-3 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#eef3fa] shadow-sm [background-image:linear-gradient(rgba(18,40,90,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(18,40,90,0.06)_1px,transparent_1px)] [background-size:26px_26px]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-[#12285a]" />
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">

            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#12285a] text-amber-400 shadow-sm">
                <FaLandmark size={19} />
              </span>
              <div className="min-w-0 leading-snug">
                <h1 className="text-lg font-bold text-[#12285a] sm:text-xl">
                  Officer Dashboard
                </h1>
                <p className="text-sm font-medium text-slate-700">
                  Land Acquisition Certificate Portal
                  <span className="hidden text-slate-500 md:inline">
                    {" "}— Review, Approve and Process Certificate Requests
                  </span>
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex shrink-0 items-center gap-2">

              {/* SIGNING SETUP BUTTON */}
              <button
                onClick={() => router.push("/officer/signing-setup")}
                className={`${btnSecondary} bg-white`}
              >
                <FaDownload size={12} />
                Signing Setup
              </button>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => {
                  localStorage.removeItem("officer");
                  window.location.href = "/officer/login";
                }}
                className={`${btnSecondary} bg-white`}
              >
                <FaSignOutAlt size={12} />
                Logout
              </button>

            </div>

          </div>
        </header>

        {/* MAIN CARD */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">

            <h2 className="text-lg font-bold text-[#12285a]">
              Pending Requests
            </h2>

            {!loading && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-800">
                {requests.length} request{requests.length === 1 ? "" : "s"}
              </span>
            )}

          </div>

          <div className="max-h-[75vh] min-h-[240px] flex-1 overflow-auto lg:max-h-none lg:min-h-0">

            {loading ? (

              <div className="flex h-48 flex-col items-center justify-center gap-2 px-4 text-center text-base text-slate-600">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-[#12285a]" />
                <span className="font-medium">Loading Requests...</span>
              </div>

            ) : requests.length === 0 ? (

              <div className="flex h-48 flex-col items-center justify-center gap-2 px-4 text-center text-base text-slate-600">
                <FaFilePdf size={22} className="text-slate-400" />
                <span className="font-medium">No Requests Found</span>
              </div>

            ) : (

              <table className="w-full border-collapse bg-white">

                <thead className="sticky top-0 z-10">

                  <tr>

                    <th className={thCls}>
                      Request ID
                    </th>

                    <th className={thCls}>
                      Applicant
                    </th>

                    <th className={thCls}>
                      Taluka
                    </th>

                    <th className={thCls}>
                      Village
                    </th>

                    <th className={thCls}>
                      Mobile
                    </th>

                    <th className={thCls}>
                      Status
                    </th>

                    <th className={`${thCls} text-center`}>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {requests.map((request) => (

                    <tr
                      key={request.id}
                      className="bg-white transition-colors hover:bg-slate-50"
                    >

                      <td className={tdCls}>
                        {request.id}
                      </td>

                      <td className={`${tdCls} font-medium`}>
                        {request.applicant_name}
                      </td>

                      <td className={`${tdCls} font-medium`}>
                        {request.taluka}
                      </td>

                      <td className={`${tdCls} font-medium`}>
                        {request.village}
                      </td>

                      <td className={`${tdCls} font-medium`}>
                        {request.mobile_number}
                      </td>

                      <td className={tdCls}>

                        <span className={getStatusBadgeClasses(request.status)}>
                          {request.status}
                        </span>

                      </td>

                      <td className={`${tdCls} text-center`}>

                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                          }}
                          className={btnPrimary}
                        >
                          <FaEye size={11} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

        {selectedRequest && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

              {/* Modal Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-l-4 border-slate-200 border-l-amber-500 px-5 py-4">

                <div>
                  <h2 className="text-lg font-bold text-[#12285a]">
                    Certificate Request Details
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-600">
                    Request #{selectedRequest.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  aria-label="Close"
                  className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  <FaTimes size={16} />
                </button>

              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">

                {/* Summary strip */}
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 border-l-4 border-l-[#12285a] bg-slate-50 px-4 py-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#12285a] text-sm font-bold text-amber-400">
                    {selectedRequest.applicant_name
                      ? selectedRequest.applicant_name.charAt(0).toUpperCase()
                      : "?"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-6 text-slate-900">
                      {selectedRequest.applicant_name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-700">
                      <FaPhone size={11} className="text-slate-500" />
                      {selectedRequest.mobile_number}
                    </p>
                  </div>

                  <div className="ml-auto">
                    <span className={getStatusBadgeClasses(selectedRequest.status)}>
                      {selectedRequest.status}
                    </span>
                  </div>

                </div>

                {/* Land & Survey Details */}
                <div className="overflow-hidden rounded-lg border border-slate-200">

                  <h3 className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-[#12285a]">
                    <FaMapMarkerAlt size={12} className="text-amber-600" />
                    Land &amp; Survey Details
                  </h3>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 sm:grid-cols-3">

                    <div>
                      <p className={detailLabel}>District</p>
                      <p className={detailValue}>{selectedRequest.district}</p>
                    </div>

                    <div>
                      <p className={detailLabel}>Taluka</p>
                      <p className={detailValue}>{selectedRequest.taluka}</p>
                    </div>

                    <div>
                      <p className={detailLabel}>Village</p>
                      <p className={detailValue}>{selectedRequest.village}</p>
                    </div>

                    <div>
                      <p className={detailLabel}>Project</p>
                      <p className={detailValue}>{selectedRequest.project_name}</p>
                    </div>

                    <div>
                      <p className={detailLabel}>Nivada Name</p>
                      <p className={detailValue}>{selectedRequest.nivada_name}</p>
                    </div>

                    {
                      selectedRequest.survey_number &&
                      selectedRequest.survey_number !== "-" && (
                        <div>
                          <p className={detailLabel}>
                            Survey Number
                          </p>

                          <p className={detailValue}>
                            {selectedRequest.survey_number}
                          </p>
                        </div>
                      )
                    }

                    {
                      selectedRequest.gat_number &&
                      selectedRequest.gat_number !== "-" && (
                        <div>
                          <p className={detailLabel}>
                            Gat Number
                          </p>

                          <p className={detailValue}>
                            {selectedRequest.gat_number}
                          </p>
                        </div>
                      )
                    }

                  </div>

                </div>

                {/* Applicant Address */}
                <div className="overflow-hidden rounded-lg border border-slate-200">

                  <h3 className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-[#12285a]">
                    <FaHome size={12} className="text-amber-600" />
                    Applicant Address
                  </h3>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 sm:grid-cols-3">

                    <div>
                      <p className={detailLabel}>District</p>
                      <p className={detailValue}>{selectedRequest.address_district}</p>
                    </div>

                    <div>
                      <p className={detailLabel}>Taluka</p>
                      <p className={detailValue}>{selectedRequest.address_taluka}</p>
                    </div>

                    <div>
                      <p className={detailLabel}>Village</p>
                      <p className={detailValue}>{selectedRequest.address_village}</p>
                    </div>

                  </div>

                </div>

              </div>

              {/* Footer Actions */}
              <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">

                <button
                  onClick={() => setSelectedRequest(null)}
                  className={`${btnSecondary} bg-white`}
                >
                  Close
                </button>

                <div className="flex gap-2">

                  <button
                    onClick={() => {

                      axios
                        .post(
                          `${API_BASE}/officer/request/generate-pdf/${selectedRequest.id}/`
                        )
                        .then(async (response) => {

                          console.log(response.data);

                          const pdfUrl = response.data.pdf_file;

                          const fullPdfUrl = new URL(pdfUrl, API_BASE).toString();

                          const protocolUrl =
                            `landsigner://sign?pdf=${encodeURIComponent(fullPdfUrl)}&request_id=${selectedRequest.id}`;

                          window.location.href = protocolUrl;
                          const currentRequestId = selectedRequest.id;
                          const interval = setInterval(async () => {

                            try {

                              const officer = JSON.parse(localStorage.getItem("officer")!);

                              const response = await axios.get(
                                `${API_BASE}/officer/requests/${officer.officer_id}/`
                              );

                              setRequests(response.data);

                              const stillPending = response.data.some(
                                (r: any) => r.id === currentRequestId
                              );

                              if (!stillPending) {

                                clearInterval(interval);

                                setSelectedRequest(null);


                                toast.success("Certificate signed successfully.");

                              }

                            } catch (error) {

                              console.error(error);

                            }

                          }, 2000);

                        })
                        .catch((error) => {

                          console.error(error);

                          toast.error("Unable to generate PDF");

                        });
                    }}
                    className={btnPrimary}
                  >
                    <FaFilePdf size={13} />
                    Download PDF
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );

}