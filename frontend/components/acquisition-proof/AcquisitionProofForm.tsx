
export default function AcquisitionProofPage() {
  return null;
}




// "use client";

// import {
//     ChangeEvent,
//     FormEvent,
//     useEffect,
//     useState,
// } from "react";

// import Select from "react-select";

// import {
//     AcquisitionProofFormData,
//     submitAcquisitionProof,
// } from "@/lib/acquisition-proof";

// const initialFormData: AcquisitionProofFormData = {
//     taluka: "",
//     village: "",
//     survey_number: "",
//     gat_number: "",
//     mobile_number: "",
//     email: "",
//     description: "",
// };

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// if (!API_BASE_URL) {
//     throw new Error("NEXT_PUBLIC_API_URL is not configured.");
// }

// const inputClassName =
//     "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

// const labelClassName =
//     "mb-2 block text-sm font-semibold text-slate-700";

// const selectClassNames = {
//     control: (state: { isFocused: boolean }) =>
//         `!min-h-[48px] !rounded-xl !border !bg-white !shadow-sm ${
//             state.isFocused
//                 ? "!border-blue-500 !ring-4 !ring-blue-100"
//                 : "!border-slate-300 hover:!border-slate-400"
//         }`,

//     valueContainer: () => "!px-4 !py-1",

//     singleValue: () => "!font-medium !text-slate-900",

//     input: () => "!text-slate-900",

//     placeholder: () => "!text-slate-400",

//     menu: () =>
//         "!z-50 !mt-2 !overflow-hidden !rounded-xl !border !border-slate-200 !bg-white !shadow-xl",

//     menuList: () => "!space-y-1 !p-2",

//     option: (state: {
//         isSelected: boolean;
//         isFocused: boolean;
//     }) =>
//         `!cursor-pointer !rounded-lg !px-3 !py-3 !text-sm !font-medium ${
//             state.isSelected
//                 ? "!bg-blue-600 !text-white"
//                 : state.isFocused
//                   ? "!bg-blue-50 !text-blue-900"
//                   : "!text-slate-700"
//         }`,

//     indicatorsContainer: () => "!text-slate-400",

//     clearIndicator: () =>
//         "!cursor-pointer !text-slate-400 hover:!text-red-500",

//     dropdownIndicator: () =>
//         "!cursor-pointer !text-slate-400 hover:!text-blue-600",

//     indicatorSeparator: () => "!bg-slate-200",
// };

// export default function AcquisitionProofForm() {
//     const [formData, setFormData] =
//         useState<AcquisitionProofFormData>(initialFormData);

//     const [districts, setDistricts] = useState<string[]>([]);
//     const [talukas, setTalukas] = useState<string[]>([]);
//     const [villages, setVillages] = useState<string[]>([]);

//     const [district, setDistrict] = useState("");

//     const [isLoadingLocations, setIsLoadingLocations] =
//         useState(false);

//     const [proofDocument, setProofDocument] =
//         useState<File | null>(null);

//     const [isSubmitting, setIsSubmitting] =
//         useState(false);

//     const [successMessage, setSuccessMessage] =
//         useState("");

//     const [errorMessage, setErrorMessage] =
//         useState("");

//     useEffect(() => {
//         const loadDistricts = async () => {
//             try {
//                 setIsLoadingLocations(true);

//                 const response = await fetch(
//                     `${API_BASE_URL}/districts/`
//                 );

//                 if (!response.ok) {
//                     throw new Error("Unable to load districts.");
//                 }

//                 const data = await response.json();

//                 const districtList = Array.isArray(data)
//                     ? data
//                     : data.results || [];

//                 setDistricts(districtList);
//             } catch (error) {
//                 console.error(
//                     "District loading error:",
//                     error
//                 );

//                 setErrorMessage(
//                     "Unable to load districts."
//                 );
//             } finally {
//                 setIsLoadingLocations(false);
//             }
//         };

//         loadDistricts();
//     }, []);

//     useEffect(() => {
//         if (!district) {
//             setTalukas([]);
//             return;
//         }

//         const loadTalukas = async () => {
//             try {
//                 setIsLoadingLocations(true);

//                 const response = await fetch(
//                     `${API_BASE_URL}/talukas/?district=${encodeURIComponent(
//                         district
//                     )}`
//                 );

//                 if (!response.ok) {
//                     throw new Error("Unable to load talukas.");
//                 }

//                 const data = await response.json();

//                 const talukaList = Array.isArray(data)
//                     ? data
//                     : data.results || [];

//                 setTalukas(talukaList);
//             } catch (error) {
//                 console.error(
//                     "Taluka loading error:",
//                     error
//                 );

//                 setErrorMessage(
//                     "Unable to load talukas."
//                 );
//             } finally {
//                 setIsLoadingLocations(false);
//             }
//         };

//         loadTalukas();
//     }, [district]);

//     useEffect(() => {
//         if (!district || !formData.taluka) {
//             setVillages([]);
//             return;
//         }

//         const loadVillages = async () => {
//             try {
//                 setIsLoadingLocations(true);

//                 const response = await fetch(
//                     `${API_BASE_URL}/villages/?district=${encodeURIComponent(
//                         district
//                     )}&taluka=${encodeURIComponent(
//                         formData.taluka
//                     )}`
//                 );

//                 if (!response.ok) {
//                     throw new Error("Unable to load villages.");
//                 }

//                 const data = await response.json();

//                 const villageList = Array.isArray(data)
//                     ? data
//                     : data.results || [];

//                 setVillages(villageList);
//             } catch (error) {
//                 console.error(
//                     "Village loading error:",
//                     error
//                 );

//                 setErrorMessage(
//                     "Unable to load villages."
//                 );
//             } finally {
//                 setIsLoadingLocations(false);
//             }
//         };

//         loadVillages();
//     }, [district, formData.taluka]);

//     const handleInputChange = (
//         event: ChangeEvent<
//             HTMLInputElement | HTMLTextAreaElement
//         >
//     ) => {
//         const { name, value } = event.target;

//         setFormData((previous) => ({
//             ...previous,
//             [name]: value,
//         }));

//         setErrorMessage("");
//         setSuccessMessage("");
//     };

//     const handleFileChange = (
//         event: ChangeEvent<HTMLInputElement>
//     ) => {
//         const file = event.target.files?.[0] || null;

//         setProofDocument(file);
//         setErrorMessage("");
//         setSuccessMessage("");
//     };

//     const handleSubmit = async (
//         event: FormEvent<HTMLFormElement>
//     ) => {
//         event.preventDefault();

//         setSuccessMessage("");
//         setErrorMessage("");

//         if (!district) {
//             setErrorMessage(
//                 "Please select a District."
//             );
//             return;
//         }

//         if (!formData.taluka.trim()) {
//             setErrorMessage(
//                 "Please select a Taluka."
//             );
//             return;
//         }

//         if (!formData.village.trim()) {
//             setErrorMessage(
//                 "Please select a Village."
//             );
//             return;
//         }

//         if (
//             !formData.survey_number.trim() &&
//             !formData.gat_number.trim()
//         ) {
//             setErrorMessage(
//                 "Please enter either Survey Number or Gat Number."
//             );
//             return;
//         }

//         if (
//             !formData.mobile_number.trim() &&
//             !formData.email.trim()
//         ) {
//             setErrorMessage(
//                 "Please enter either Mobile Number or Email."
//             );
//             return;
//         }

//         if (!proofDocument) {
//             setErrorMessage(
//                 "Please upload a proof document."
//             );
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             const result = await submitAcquisitionProof(
//                 formData,
//                 proofDocument
//             );

//             setSuccessMessage(
//                 result.message ||
//                     "Your acquisition proof was submitted successfully."
//             );

//             setFormData(initialFormData);
//             setProofDocument(null);

//             const fileInput = document.getElementById(
//                 "proof_document"
//             ) as HTMLInputElement | null;

//             if (fileInput) {
//                 fileInput.value = "";
//             }
//         } catch (error) {
//             setErrorMessage(
//                 error instanceof Error
//                     ? error.message
//                     : "Something went wrong while submitting proof."
//             );
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
//             <div className="mx-auto w-full max-w-6xl">
//                 <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
//                     {/* Header */}
//                     <div className="bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-800 px-6 py-8 sm:px-10 sm:py-10">
//                         <div className="flex items-start gap-4">
//                             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="1.8"
//                                     className="h-6 w-6"
//                                 >
//                                     <path d="M3 21h18" />
//                                     <path d="M5 21V7l7-4 7 4v14" />
//                                     <path d="M9 21v-8h6v8" />
//                                     <path d="M9 9h.01" />
//                                     <path d="M15 9h.01" />
//                                 </svg>
//                             </div>

//                             <div>
//                                 <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
//                                     Submit Acquisition Proof
//                                 </h1>

//                                 <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100 sm:text-base">
//                                     If your land was acquired but the
//                                     official record shows
//                                     <span className="mx-1 font-semibold text-white">
//                                         "Not Acquired"
//                                     </span>
//                                     , submit supporting proof for officer
//                                     review.
//                                 </p>

//                                 <p className="mt-2 text-sm leading-6 text-blue-100">
//                                     Submitting proof does not automatically
//                                     change the official land record.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Form Content */}
//                     <div className="px-6 py-8 sm:px-10 sm:py-10">
//                         <form
//                             onSubmit={handleSubmit}
//                             className="space-y-8"
//                         >
//                             {/* Status Messages */}
//                             {successMessage && (
//                                 <div
//                                     role="status"
//                                     className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         className="mt-0.5 h-5 w-5 shrink-0"
//                                     >
//                                         <path d="m9 12 2 2 4-4" />
//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="9"
//                                         />
//                                     </svg>

//                                     <p>{successMessage}</p>
//                                 </div>
//                             )}

//                             {errorMessage && (
//                                 <div
//                                     role="alert"
//                                     className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         className="mt-0.5 h-5 w-5 shrink-0"
//                                     >
//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="9"
//                                         />
//                                         <path d="M12 8v4" />
//                                         <path d="M12 16h.01" />
//                                     </svg>

//                                     <p className="whitespace-pre-line">
//                                         {errorMessage}
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Land Details */}
//                             <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7">
//                                 <div className="mb-6 flex items-center gap-3">
//                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="1.8"
//                                             className="h-5 w-5"
//                                         >
//                                             <path d="M3 21h18" />
//                                             <path d="M5 21V7l7-4 7 4v14" />
//                                             <path d="M9 21v-8h6v8" />
//                                         </svg>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold text-slate-900">
//                                             Land Details
//                                         </h2>

//                                         <p className="mt-1 text-sm text-slate-500">
//                                             Select the location and enter
//                                             your land details.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-5 md:grid-cols-2">
//                                     {/* District */}
//                                     <div>
//                                         <label
//                                             htmlFor="district"
//                                             className={labelClassName}
//                                         >
//                                             District
//                                             <span className="ml-1 text-red-500">
//                                                 *
//                                             </span>
//                                         </label>

//                                         <Select
//                                             inputId="district"
//                                             options={districts.map(
//                                                 (districtName) => ({
//                                                     value: districtName,
//                                                     label: districtName,
//                                                 })
//                                             )}
//                                             value={
//                                                 district
//                                                     ? {
//                                                           value: district,
//                                                           label: district,
//                                                       }
//                                                     : null
//                                             }
//                                             onChange={(selectedOption) => {
//                                                 const selectedDistrict =
//                                                     selectedOption?.value ||
//                                                     "";

//                                                 setDistrict(
//                                                     selectedDistrict
//                                                 );

//                                                 setFormData((previous) => ({
//                                                     ...previous,
//                                                     taluka: "",
//                                                     village: "",
//                                                 }));

//                                                 setTalukas([]);
//                                                 setVillages([]);
//                                                 setErrorMessage("");
//                                                 setSuccessMessage("");
//                                             }}
//                                             placeholder="Select District"
//                                             isSearchable
//                                             isClearable
//                                             isDisabled={
//                                                 isLoadingLocations
//                                             }
//                                             noOptionsMessage={() =>
//                                                 "No District found"
//                                             }
//                                             classNames={
//                                                 selectClassNames
//                                             }
//                                         />
//                                     </div>

//                                     {/* Taluka */}
//                                     <div>
//                                         <label
//                                             htmlFor="taluka"
//                                             className={labelClassName}
//                                         >
//                                             Taluka
//                                             <span className="ml-1 text-red-500">
//                                                 *
//                                             </span>
//                                         </label>

//                                         <Select
//                                             inputId="taluka"
//                                             options={talukas.map(
//                                                 (taluka) => ({
//                                                     value: taluka,
//                                                     label: taluka,
//                                                 })
//                                             )}
//                                             value={
//                                                 formData.taluka
//                                                     ? {
//                                                           value: formData.taluka,
//                                                           label: formData.taluka,
//                                                       }
//                                                     : null
//                                             }
//                                             onChange={(selectedOption) => {
//                                                 setFormData((previous) => ({
//                                                     ...previous,
//                                                     taluka:
//                                                         selectedOption?.value ||
//                                                         "",
//                                                     village: "",
//                                                 }));

//                                                 setVillages([]);
//                                                 setErrorMessage("");
//                                                 setSuccessMessage("");
//                                             }}
//                                             placeholder="Select Taluka"
//                                             isSearchable
//                                             isClearable
//                                             isDisabled={
//                                                 !district ||
//                                                 isLoadingLocations
//                                             }
//                                             noOptionsMessage={() =>
//                                                 "No Taluka found"
//                                             }
//                                             classNames={
//                                                 selectClassNames
//                                             }
//                                         />
//                                     </div>

//                                     {/* Village */}
//                                     <div>
//                                         <label
//                                             htmlFor="village"
//                                             className={labelClassName}
//                                         >
//                                             Village
//                                             <span className="ml-1 text-red-500">
//                                                 *
//                                             </span>
//                                         </label>

//                                         <Select
//                                             inputId="village"
//                                             options={villages.map(
//                                                 (village) => ({
//                                                     value: village,
//                                                     label: village,
//                                                 })
//                                             )}
//                                             value={
//                                                 formData.village
//                                                     ? {
//                                                           value: formData.village,
//                                                           label: formData.village,
//                                                       }
//                                                     : null
//                                             }
//                                             onChange={(selectedOption) => {
//                                                 setFormData((previous) => ({
//                                                     ...previous,
//                                                     village:
//                                                         selectedOption?.value ||
//                                                         "",
//                                                 }));

//                                                 setErrorMessage("");
//                                                 setSuccessMessage("");
//                                             }}
//                                             placeholder="Select Village"
//                                             isSearchable
//                                             isClearable
//                                             isDisabled={
//                                                 !formData.taluka ||
//                                                 isLoadingLocations
//                                             }
//                                             noOptionsMessage={() =>
//                                                 "No Village found"
//                                             }
//                                             classNames={
//                                                 selectClassNames
//                                             }
//                                         />
//                                     </div>

//                                     {/* Survey Number */}
//                                     <div>
//                                         <label
//                                             htmlFor="survey_number"
//                                             className={labelClassName}
//                                         >
//                                             Survey Number
//                                         </label>

//                                         <input
//                                             id="survey_number"
//                                             name="survey_number"
//                                             type="text"
//                                             value={
//                                                 formData.survey_number
//                                             }
//                                             onChange={handleInputChange}
//                                             className={inputClassName}
//                                             placeholder="Enter Survey Number"
//                                         />
//                                     </div>

//                                     {/* Gat Number */}
//                                     <div>
//                                         <label
//                                             htmlFor="gat_number"
//                                             className={labelClassName}
//                                         >
//                                             Gat Number
//                                         </label>

//                                         <input
//                                             id="gat_number"
//                                             name="gat_number"
//                                             type="text"
//                                             value={formData.gat_number}
//                                             onChange={handleInputChange}
//                                             className={inputClassName}
//                                             placeholder="Enter Gat Number"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
//                                     >
//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="9"
//                                         />
//                                         <path d="M12 11v5" />
//                                         <path d="M12 8h.01" />
//                                     </svg>

//                                     <p className="text-xs font-medium leading-5 text-blue-700">
//                                         Enter at least one: Survey Number or
//                                         Gat Number.
//                                     </p>
//                                 </div>
//                             </section>

//                             {/* Contact Details */}
//                             <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7">
//                                 <div className="mb-6 flex items-center gap-3">
//                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="1.8"
//                                             className="h-5 w-5"
//                                         >
//                                             <path d="M20 21a8 8 0 0 0-16 0" />
//                                             <circle
//                                                 cx="12"
//                                                 cy="7"
//                                                 r="4"
//                                             />
//                                         </svg>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold text-slate-900">
//                                             Contact Details
//                                         </h2>

//                                         <p className="mt-1 text-sm text-slate-500">
//                                             Provide at least one contact
//                                             method.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-5 md:grid-cols-2">
//                                     {/* Mobile Number */}
//                                     <div>
//                                         <label
//                                             htmlFor="mobile_number"
//                                             className={labelClassName}
//                                         >
//                                             Mobile Number
//                                         </label>

//                                         <input
//                                             id="mobile_number"
//                                             name="mobile_number"
//                                             type="tel"
//                                             value={
//                                                 formData.mobile_number
//                                             }
//                                             onChange={handleInputChange}
//                                             className={inputClassName}
//                                             placeholder="Enter Mobile Number"
//                                         />
//                                     </div>

//                                     {/* Email */}
//                                     <div>
//                                         <label
//                                             htmlFor="email"
//                                             className={labelClassName}
//                                         >
//                                             Email Address
//                                         </label>

//                                         <input
//                                             id="email"
//                                             name="email"
//                                             type="email"
//                                             value={formData.email}
//                                             onChange={handleInputChange}
//                                             className={inputClassName}
//                                             placeholder="Enter Email Address"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="mt-5 flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600"
//                                     >
//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="9"
//                                         />
//                                         <path d="M12 11v5" />
//                                         <path d="M12 8h.01" />
//                                     </svg>

//                                     <p className="text-xs font-medium leading-5 text-indigo-700">
//                                         Enter at least one: Mobile Number or
//                                         Email.
//                                     </p>
//                                 </div>
//                             </section>

//                             {/* Supporting Document */}
//                             <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7">
//                                 <div className="mb-6 flex items-center gap-3">
//                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="1.8"
//                                             className="h-5 w-5"
//                                         >
//                                             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                                             <path d="M14 2v6h6" />
//                                             <path d="M8 13h8" />
//                                             <path d="M8 17h6" />
//                                         </svg>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold text-slate-900">
//                                             Supporting Document
//                                         </h2>

//                                         <p className="mt-1 text-sm text-slate-500">
//                                             Upload a document supporting your
//                                             acquisition claim.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* File Upload */}
//                                 <div>
//                                     <label
//                                         htmlFor="proof_document"
//                                         className={labelClassName}
//                                     >
//                                         Upload Proof Document
//                                         <span className="ml-1 text-red-500">
//                                             *
//                                         </span>
//                                     </label>

//                                     <input
//                                         id="proof_document"
//                                         name="proof_document"
//                                         type="file"
//                                         accept=".pdf,.jpg,.jpeg,.png"
//                                         onChange={handleFileChange}
//                                         className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 shadow-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-blue-700 hover:border-slate-400"
//                                         required
//                                     />

//                                     <p className="mt-2 text-xs leading-5 text-slate-500">
//                                         Accepted formats: PDF, JPG, JPEG, and
//                                         PNG.
//                                     </p>

//                                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                                         Upload your acquisition certificate,
//                                         order, or other supporting document.
//                                     </p>
//                                 </div>

//                                 {/* Description */}
//                                 <div className="mt-6">
//                                     <label
//                                         htmlFor="description"
//                                         className={labelClassName}
//                                     >
//                                         Description
//                                         <span className="ml-2 text-xs font-normal text-slate-400">
//                                             (Optional)
//                                         </span>
//                                     </label>

//                                     <textarea
//                                         id="description"
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleInputChange}
//                                         rows={5}
//                                         className={`${inputClassName} resize-y`}
//                                         placeholder="Explain why you believe the land was acquired."
//                                     />
//                                 </div>
//                             </section>

//                             {/* Submit Area */}
//                             <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
//                                 <p className="text-xs leading-5 text-slate-500">
//                                     Your submission will be reviewed by the
//                                     concerned officer.
//                                 </p>

//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
//                                 >
//                                     {isSubmitting ? (
//                                         <>
//                                             <svg
//                                                 className="h-4 w-4 animate-spin"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <circle
//                                                     className="opacity-25"
//                                                     cx="12"
//                                                     cy="12"
//                                                     r="10"
//                                                     stroke="currentColor"
//                                                     strokeWidth="4"
//                                                 />
//                                                 <path
//                                                     className="opacity-75"
//                                                     fill="currentColor"
//                                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                                 />
//                                             </svg>

//                                             Submitting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Submit Acquisition Proof

//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 strokeWidth="2"
//                                                 className="h-4 w-4"
//                                             >
//                                                 <path d="m5 12 14 0" />
//                                                 <path d="m13 6 6 6-6 6" />
//                                             </svg>
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }









 