import AcquisitionProofForm from "@/components/acquisition-proof/AcquisitionProofForm";

export default function AcquisitionProofPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-md md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Submit Acquisition Proof
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            If your land was acquired but the official record shows
            &quot;Not Acquired&quot;, submit supporting proof for
            officer review.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Submitting proof does not automatically change the
            official land record.
          </p>
        </div>

        <AcquisitionProofForm />
      </div>
    </main>
  );
}