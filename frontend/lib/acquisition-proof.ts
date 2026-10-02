
export type AcquisitionProofFormData = {
  taluka: string;
  village: string;
  survey_number: string;
  gat_number: string;
  mobile_number: string;
  email: string;
  description: string;
};

export type AcquisitionProofResponse = {
  success?: boolean;
  message?: string;
  request_id?: number;
  status?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

export async function submitAcquisitionProof(
  formData: AcquisitionProofFormData,
  proofDocument: File
): Promise<AcquisitionProofResponse> {
  const uploadData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value.trim() !== "") {
      uploadData.append(key, value);
    }
  });

  uploadData.append("proof_document", proofDocument);

  const response = await fetch(
    `${API_BASE_URL}/acquisition-proof/submit/`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  let result: AcquisitionProofResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    let errorMessage =
      result.error ||
      "Unable to submit acquisition proof.";

    if (result.errors) {
      errorMessage = Object.entries(result.errors)
        .map(([field, errors]) => {
          const message = Array.isArray(errors)
            ? errors.join(", ")
            : errors;

          return `${field}: ${message}`;
        })
        .join("\n");
    }

    throw new Error(errorMessage);
  }

  return result;
}