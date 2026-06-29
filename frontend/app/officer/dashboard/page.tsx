"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaEye,
  FaFilePdf,
  FaCloudUploadAlt,
  FaSignOutAlt,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
export default function OfficerDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedPdf, setSignedPdf] = useState<File | null>(null);
  const [uploading, setUploading] =
  useState(false);
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
      return "bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold";
    }

    if (s.includes("reject") || s.includes("denied")) {
      return "bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold";
    }

    return "bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-semibold";
  };

  return (
     <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
      }}
    />
    <div className="h-screen bg-slate-100 p-3 overflow-hidden flex flex-col">

      {/* HEADER */}
      <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-center text-white shadow-lg shrink-0">

        <h1 className="text-3xl font-bold">
          Officer Dashboard
        </h1>

        <p className="mt-1 text-sm">
          Land Acquisition Certificate Portal
        </p>

        <p className="text-xs opacity-90">
          Review, Approve and Process Certificate Requests
        </p>

        <button
          onClick={() => {

            localStorage.removeItem("officer");

            window.location.href =
              "/officer/login";

          }}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
        >
          <FaSignOutAlt size={12} />
          Logout
        </button>

      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0">

        <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">

          <h2 className="text-lg font-semibold text-slate-800">
            Pending Requests
          </h2>

          {!loading && (
            <span className="text-xs text-gray-500 font-medium">
              {requests.length} request{requests.length === 1 ? "" : "s"}
            </span>
          )}

        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">

          {loading ? (

            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              Loading Requests...
            </div>

          ) : requests.length === 0 ? (

            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No Requests Found
            </div>

          ) : (

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">

              <table className="w-full border-collapse bg-white">

                <thead className="sticky top-0 z-10">

                  <tr className="bg-gray-200">

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-left whitespace-nowrap">
                      Request ID
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-left whitespace-nowrap">
                      Applicant
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-left whitespace-nowrap">
                      Taluka
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-left whitespace-nowrap">
                      Village
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-left whitespace-nowrap">
                      Mobile
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-left whitespace-nowrap">
                      Status
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-sm font-semibold text-center whitespace-nowrap">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {requests.map((request) => (

                    <tr
                      key={request.id}
                      className="bg-white hover:bg-gray-50"
                    >

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {request.id}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {request.applicant_name}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {request.taluka}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {request.village}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {request.mobile_number}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm whitespace-nowrap">

                        <span className={getStatusBadgeClasses(request.status)}>
                          {request.status}
                        </span>

                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-center whitespace-nowrap">

                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                        >
                          <FaEye size={11} />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {selectedRequest && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl shrink-0">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Certificate Request Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Request #{selectedRequest.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <FaTimes size={16} />
              </button>

            </div>

            <div className="p-5 space-y-4">

              {/* Summary strip */}
              <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                  {selectedRequest.applicant_name
                    ? selectedRequest.applicant_name.charAt(0).toUpperCase()
                    : "?"}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedRequest.applicant_name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <FaPhone size={10} />
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
              <div>

                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <FaMapMarkerAlt size={11} className="text-blue-500" />
                  Land &amp; Survey Details
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 border border-gray-200 rounded-xl p-4">

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">District</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.district}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Taluka</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.taluka}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Village</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.village}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Project</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.project_name}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Nivada Name</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.nivada_name}</p>
                  </div>

                  {
                    selectedRequest.survey_number &&
                    selectedRequest.survey_number !== "-" && (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                          Survey Number
                        </p>
                    
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">
                          {selectedRequest.survey_number}
                        </p>
                      </div>
                    )
                  }
                  
                  {
                    selectedRequest.gat_number &&
                    selectedRequest.gat_number !== "-" && (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                          Gat Number
                        </p>
                    
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">
                          {selectedRequest.gat_number}
                        </p>
                      </div>
                    )
                  }

                </div>

              </div>

              {/* Applicant Address */}
              <div>

                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <FaHome size={11} className="text-indigo-500" />
                  Applicant Address
                </h3>

                <div className="grid grid-cols-3 gap-3 border border-gray-200 rounded-xl p-4">

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">District</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.address_district}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Taluka</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.address_taluka}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Village</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedRequest.address_village}</p>
                  </div>

                </div>

              </div>

              {/* Upload Section */}
              <div>

                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <FaCloudUploadAlt size={12} className="text-emerald-500" />
                  Upload Signed Certificate (PDF)
                </h3>

                <div className="border-2 border-dashed border-gray-300 hover:border-blue-300 rounded-xl p-4 bg-gray-50 transition-colors">

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                    
                      if (
                        e.target.files &&
                        e.target.files[0]
                      ) {
                      
                        setSignedPdf(
                          e.target.files[0]
                        );
                      
                      }
                    
                    }}
                    className="
                      w-full
                      text-sm
                      text-black
                      file:bg-blue-600
                      file:text-white
                      file:border-0
                      file:px-3
                      file:py-1.5
                      file:rounded-lg
                      file:text-sm
                      file:font-medium
                      file:cursor-pointer
                      file:mr-4
                      cursor-pointer
                    "
                  />

                  {signedPdf && (
                  
                    <div className="mt-3 flex items-center gap-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">

                      <FaFilePdf className="text-emerald-600 shrink-0" size={18} />

                      <div className="min-w-0">
                        <p className="text-sm text-black font-medium break-all">
                          {signedPdf.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {(signedPdf.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                  
                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl shrink-0">

              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"
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
                      .then((response) => {

                        const backendOrigin = new URL(API_BASE).origin;

                        const pdfUrl =
                          `${backendOrigin}${response.data.pdf_file}`;
                                              
                        fetch(pdfUrl)
                          .then((res) => res.blob())
                          .then((blob) => {
                          
                            const url =
                              window.URL.createObjectURL(blob);
                          
                            const a =
                              document.createElement("a");
                          
                            a.href = url;
                          
                            a.download =
                              `certificate_${selectedRequest.id}.pdf`;
                          
                            document.body.appendChild(a);
                          
                            a.click();
                          
                            document.body.removeChild(a);
                          
                            window.URL.revokeObjectURL(url);
                          
                            setTimeout(() => {
                            
                              fetch(
                                "http://127.0.0.1:5000/open-signer",
                                {
                                  method: "POST"
                                }
                              )
                              .then((res) => {
                              
                                console.log(
                                  "Signer API Status:",
                                  res.status
                                );
                              
                                return res.json();
                              
                              })
                              .then((data) => {
                              
                                console.log(
                                  "Signer API Response:",
                                  data
                                );
                              
                              })
                              .catch((err) => {
                              
                                console.error(
                                  "Signer Error:",
                                  err
                                );
                              
                              });
                            
                            }, 2000);
                          
                          });

                        
                      
                      })
                      .catch((error) => {
                      
                        console.error(error);
                      
                        toast.error(
                          "Unable to generate PDF"
                        );
                      
                      });
                    
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-1.5"
                >
                  <FaFilePdf size={13} />
                  Download PDF
                </button>
                
                <button
                disabled={uploading}
                onClick={async () => {
                
                  if (uploading) {
                    return;
                  }
                
                  if (!signedPdf) {
                  
                    toast.error(
                      "Please select signed PDF first"
                    );
                  
                    return;
                  }
                
                  try {
                  
                    setUploading(true);
                  
                    const formData =
                      new FormData();
                  
                    formData.append(
                      "signed_pdf",
                      signedPdf
                    );
                  
                    await axios.post(
                      `${API_BASE}/officer/request/upload-signed/${selectedRequest.id}/`,
                      formData
                    );
                  
                    toast.success(
                      "Signed PDF uploaded successfully"
                    );
                  
                    setRequests(
                      requests.filter(
                        (r) =>
                          r.id !== selectedRequest.id
                      )
                    );
                  
                    setSelectedRequest(null);
                  
                    setSignedPdf(null);
                  
                  } catch (error: any) {
                  
                    console.error(error);
                  
                    toast.error(
                      error?.response?.data?.error ||
                      "Upload failed"
                    );
                  
                  } finally {
                  
                    setUploading(false);
                  
                  }
                
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 text-white ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <FaCloudUploadAlt size={13} />
              
                {uploading
                  ? "Uploading..."
                  : "Upload Signed PDF"}
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