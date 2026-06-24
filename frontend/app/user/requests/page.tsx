"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function RequestsPage() {

  const router = useRouter();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const mobile =
      localStorage.getItem("mobile_number");

    if (!mobile) {

      router.push("/");
      return;

    }

    axios
      .post(
        "http://127.0.0.1:8000/api/request-status/",
        {
          mobile_number: mobile,
        }
      )
      .then((res) => {

        setRequests(res.data);

      })
      .catch((err) => {

        console.error(err);

        alert(
          "Unable to load requests"
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [router]);

  return (

    <div className="h-screen bg-slate-100 p-3 overflow-hidden flex flex-col">

      {/* HEADER */}
      <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-3.5 text-center text-white shadow-lg shrink-0">

        <h1 className="text-2xl md:text-3xl font-bold">
          Certificate Requests
        </h1>

        <p className="mt-1 text-sm">
          Land Acquisition Certificate Portal
        </p>

        <p className="text-xs opacity-90">
          Track Submitted Certificate Requests
        </p>

        <button
          onClick={() => router.push("/user")}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
        >
          <FaArrowLeft size={12} />
          Back
        </button>

      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0">

        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between shrink-0">

          <h2 className="text-lg font-semibold text-slate-800">
            Request History
          </h2>

          {!loading && (
            <span className="text-xs text-gray-500 font-medium">
              {requests.length} request
              {requests.length !== 1 ? "s" : ""}
            </span>
          )}

        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-3 min-h-0">

          {loading ? (

            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Loading Requests...
            </div>

          ) : requests.length === 0 ? (

            <div className="flex flex-col items-center justify-center h-64 text-gray-500">

              <FaFileAlt
                size={50}
                className="text-gray-300 mb-3"
              />

              <p className="text-lg font-medium">
                No Requests Found
              </p>

              <p className="text-sm">
                You have not submitted any certificate requests yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">

              <table className="w-full border-collapse bg-white">

                <thead className="sticky top-0 z-10">

                  <tr>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Request ID
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Status
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Project
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Nivada Name
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Taluka
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Village
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Requested Date
                    </th>

                    <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                      Approved Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {requests.map((r, index) => (

                    <tr
                      key={r.id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-slate-50 hover:bg-gray-50"
                      }
                    >

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {r.id}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 whitespace-nowrap">

                        {r.status === "Approved" ? (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Approved
                          </span>

                        ) : (

                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Pending
                          </span>

                        )}

                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium">
                        {r.project_name || "-"}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium">
                        {r.nivada_name || "-"}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {r.taluka}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {r.village}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {new Date(
                          r.requested_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                        {r.approved_at
                          ? new Date(
                              r.approved_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}