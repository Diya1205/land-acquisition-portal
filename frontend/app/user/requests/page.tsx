"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowLeft,
  FaFileAlt,
  FaLandmark,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ------------------------------------------------------------------
   UI-only style tokens (same system as the rest of the portal)
------------------------------------------------------------------ */
const btnBase =
  "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";
const btnSecondary = `${btnBase} border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-500`;
const thCls =
  "whitespace-nowrap border-b-2 border-[#12285a] bg-white px-4 py-3 text-left text-sm font-bold text-[#12285a]";
const tdCls =
  "border-b border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-900";

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
        `${API_BASE}/request-status/`,
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

    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f3f5f9] p-3 text-slate-900 lg:h-screen lg:overflow-hidden">

      {/* HEADER */}
      <header className="relative mb-3 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#eef3fa] shadow-sm [background-image:linear-gradient(rgba(18,40,90,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(18,40,90,0.06)_1px,transparent_1px)] [background-size:26px_26px]">

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-[#12285a]" />

        <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">

          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#12285a] text-amber-400 shadow-sm">
              <FaLandmark size={19} />
            </span>
            <div className="min-w-0 leading-snug">
              <h1 className="text-lg font-bold text-[#12285a] sm:text-xl">
                Certificate Requests
              </h1>
              <p className="text-sm font-medium text-slate-700">
                Land Acquisition Certificate Portal
                <span className="hidden text-slate-500 md:inline">
                  {" "}— Track Submitted Certificate Requests
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/user")}
            className={`${btnSecondary} shrink-0`}
          >
            <FaArrowLeft size={12} />
            Back
          </button>

        </div>

      </header>

      {/* MAIN CARD */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">

          <h2 className="text-lg font-bold text-[#12285a]">
            Request History
          </h2>

          {!loading && (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-800">
              {requests.length} request
              {requests.length !== 1 ? "s" : ""}
            </span>
          )}

        </div>

        <div className="max-h-[75vh] min-h-[240px] flex-1 overflow-auto lg:max-h-none lg:min-h-0">

          {loading ? (

            <div className="flex h-64 flex-col items-center justify-center gap-2 text-base text-slate-600">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-[#12285a]" />
              <span className="font-medium">Loading Requests...</span>
            </div>

          ) : requests.length === 0 ? (

            <div className="flex h-64 flex-col items-center justify-center px-4 text-center">

              <FaFileAlt
                size={40}
                className="mb-3 text-slate-300"
              />

              <p className="text-lg font-semibold text-slate-800">
                No Requests Found
              </p>

              <p className="mt-1 text-sm text-slate-600">
                You have not submitted any certificate requests yet.
              </p>

            </div>

          ) : (

            <table className="w-full border-collapse bg-white">

              <thead className="sticky top-0 z-10">

                <tr>

                  <th className={thCls}>
                    Request ID
                  </th>

                  <th className={thCls}>
                    Status
                  </th>

                  <th className={thCls}>
                    Project
                  </th>

                  <th className={thCls}>
                    Nivada Name
                  </th>

                  <th className={thCls}>
                    Taluka
                  </th>

                  <th className={thCls}>
                    Village
                  </th>

                  <th className={thCls}>
                    Requested Date
                  </th>

                  <th className={thCls}>
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
                        ? "bg-white transition-colors hover:bg-slate-50"
                        : "bg-slate-50/70 transition-colors hover:bg-slate-100"
                    }
                  >

                    <td className={`${tdCls} whitespace-nowrap`}>
                      {r.id}
                    </td>

                    <td className={`${tdCls} whitespace-nowrap`}>

                      {r.status === "Approved" ? (

                        <span className="inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          Approved
                        </span>

                      ) : (

                        <span className="inline-block rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">
                          Pending
                        </span>

                      )}

                    </td>

                    <td className={tdCls}>
                      {r.project_name || "-"}
                    </td>

                    <td className={tdCls}>
                      {r.nivada_name || "-"}
                    </td>

                    <td className={`${tdCls} whitespace-nowrap`}>
                      {r.taluka}
                    </td>

                    <td className={`${tdCls} whitespace-nowrap`}>
                      {r.village}
                    </td>

                    <td className={`${tdCls} whitespace-nowrap`}>
                      {new Date(
                        r.requested_at
                      ).toLocaleDateString()}
                    </td>

                    <td className={`${tdCls} whitespace-nowrap`}>
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

          )}

        </div>

      </div>

    </div>

  );

}