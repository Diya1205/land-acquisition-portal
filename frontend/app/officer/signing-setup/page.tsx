
import Link from "next/link";

export default function SigningSetupPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="relative mb-8 text-center">

                    {/* Back to Dashboard - Top Left */}
                    <Link
                        href="/officer/dashboard"
                        className="absolute left-0 top-0 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                        ← Back to Dashboard
                    </Link>

                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                        Land Acquisition Portal
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        PDF Signing Setup
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                        Install the required software to sign documents using your DSC
                        token.
                    </p>

                </div>
                
                {/* Notice */}
                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <h2 className="mb-2 font-semibold text-blue-900">
                        Important Information
                    </h2>

                    <p className="text-sm leading-6 text-blue-800">
                        This setup is intended for authorized Officer users. A compatible
                        ProxKey USB DSC token and its Windows driver are required for PDF
                        signing.
                    </p>
                </div>

                {/* Download cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* ProxKey Driver */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                            🔐
                        </div>

                        <p className="mb-2 text-sm font-semibold text-blue-600">
                            STEP 1
                        </p>

                        <h2 className="text-xl font-bold text-slate-900">
                            ProxKey Driver
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Install the WatchData PROXKey middleware to connect your DSC
                            USB token with the signing application.
                        </p>

                        <div className="mt-4 rounded-lg bg-slate-100 p-3">
                            <p className="break-all text-xs text-slate-700">
                                WD_PROXKey_new.exe
                            </p>
                        </div>

                        <a
                            href="/installers/WD_PROXKey_new.exe"
                            download
                            className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Download ProxKey Driver
                        </a>

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                            Install the driver first, then connect your ProxKey USB token.
                        </p>
                    </section>

                    {/* Signer */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                            ✍️
                        </div>

                        <p className="mb-2 text-sm font-semibold text-green-600">
                            STEP 2
                        </p>

                        <h2 className="text-xl font-bold text-slate-900">
                            Land Acquisition Signer
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Install the signing application that opens when you click the
                            Sign PDF button on the portal.
                        </p>

                        <div className="mt-4 rounded-lg bg-slate-100 p-3">
                            <p className="break-all text-xs text-slate-700">
                                LandAcquisitionSignerSetup_v1.0.0.exe
                            </p>
                        </div>

                        <a
                            href="/installers/LandAcquisitionSignerSetup_v1.0.0.exe"
                            download
                            className="mt-5 flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Download Land Acquisition Signer
                        </a>

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                            Run the downloaded installer and complete the Windows
                            installation.
                        </p>
                    </section>
                </div>

                {/* Installation steps */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Installation Instructions
                    </h2>

                    <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
                        <li>Download and install the ProxKey Driver.</li>
                        <li>Connect your ProxKey USB DSC token.</li>
                        <li>Download and install the Land Acquisition Signer.</li>
                        <li>Restart the browser if necessary.</li>
                        <li>Return to the Officer Dashboard.</li>
                        <li>Click Sign PDF to start signing.</li>
                    </ol>
                </section>

                {/* Troubleshooting */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Troubleshooting
                    </h2>

                    <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                        <div>
                            <p className="font-semibold text-slate-900">
                                ProxKey driver is missing
                            </p>
                            <p>
                                Download and install the ProxKey Driver from Step 1.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900">
                                DSC token is not detected
                            </p>
                            <p>
                                Check that the USB token is connected and the ProxKey
                                middleware is installed.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900">
                                Signer application does not open
                            </p>
                            <p>
                                Install the Land Acquisition Signer and try the Sign PDF
                                button again.
                            </p>
                        </div>
                    </div>
                </section>


            </div>
        </main>
    );
}