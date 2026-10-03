"use client";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaImage,
  FaFileAlt,
  FaFileInvoice,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaFilter,
  FaPlus,
  FaMinus,
  FaLandmark,
  FaListAlt,
  FaUndo,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ------------------------------------------------------------------
   UI-only style tokens (presentation only, no logic)
------------------------------------------------------------------ */
const btnBase =
  "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
const btnPrimary = `${btnBase} bg-[#12285a] text-white shadow-sm hover:bg-[#0a1f44] focus-visible:ring-blue-700`;
const btnAccent = `${btnBase} bg-amber-500 text-[#0a1f44] shadow-sm hover:bg-amber-400 focus-visible:ring-amber-600`;
const btnOutline = `${btnBase} border border-[#12285a] bg-white text-[#12285a] hover:bg-blue-50 focus-visible:ring-blue-700 disabled:border-slate-300 disabled:text-slate-500 disabled:hover:bg-white`;
const btnSecondary = `${btnBase} border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-500`;
const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";
const fieldLabel = "mb-1 block text-sm font-semibold text-slate-700";
const inputCls =
  "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-500 transition focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/25";
const thCls =
  "whitespace-nowrap border-b-2 border-[#12285a] bg-white px-4 py-3 text-left text-sm font-bold text-[#12285a]";
const tdCls =
  "whitespace-nowrap border-b border-slate-100 px-4 py-3 text-sm leading-6 text-slate-900";

export default function Home() {
  const router = useRouter();

  const [districts, setDistricts] = useState<string[]>([]);
  const [talukas, setTalukas] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [addressTalukas, setAddressTalukas] =
    useState<string[]>([]);

  const [addressVillages, setAddressVillages] =
    useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [surveyNumbers, setSurveyNumbers] = useState<string[]>([]);
  const [gatNumbers, setGatNumbers] = useState<string[]>([]);

  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [project, setProject] = useState("");
  const [surveyNumber, setSurveyNumber] = useState("");
  const [gatNumber, setGatNumber] = useState("");

  const [records, setRecords] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [showReportForm, setShowReportForm] = useState(false);
  const [actionType, setActionType] = useState<"preview" | "request">("preview");
  const [applicantName, setApplicantName] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressVillage, setAddressVillage] =
    useState("");

  const [addressTaluka, setAddressTaluka] =
    useState("");

  const [addressDistrict, setAddressDistrict] =
    useState("");
  const [Nvd_Name, setNvd_Name] = useState("");
  const [Nvd_Names, setNvd_Names] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [showOriginalModal, setShowOriginalModal] =
    useState(false);

  const [originalImageUrl, setOriginalImageUrl] =
    useState("");
  const [zoom, setZoom] = useState(1);
  const [originalRecordId, setOriginalRecordId] =
    useState<number | null>(null);

  const [originalVolumeNo, setOriginalVolumeNo] =
    useState<number | null>(null);

  const [originalPageNo, setOriginalPageNo] =
    useState<number | null>(null);

  const [originalVolumePages, setOriginalVolumePages] =
    useState<number[]>([]);

  const [originalTotalPages, setOriginalTotalPages] =
    useState(0);
  useEffect(() => {

    const savedState =
      sessionStorage.getItem("searchState");

    if (!savedState) return;

    const state = JSON.parse(savedState);

    setDistrict(state.district || "");
    setTaluka(state.taluka || "");
    setVillage(state.village || "");
    setProject(state.project || "");
    setNvd_Name(state.Nvd_Name || "");
    setSurveyNumber(state.surveyNumber || "");
    setGatNumber(state.gatNumber || "");

    setPage(state.page || 1);

    setRecords(state.records || []);
    setSelectedRecord(
      state.selectedRecord || null
    );

    setApplicantName(
      state.applicantName || ""
    );

    setMobileNumber(
      state.mobileNumber || ""
    );

    setEmail(
      state.email || ""
    );

    setAddressDistrict(
      state.addressDistrict || ""
    );

    setAddressTaluka(
      state.addressTaluka || ""
    );

    setAddressVillage(
      state.addressVillage || ""
    );

    setHasSearched(true);

    sessionStorage.removeItem("searchState");
  }, []);


  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener(
      "contextmenu",
      disableRightClick
    );

    return () => {
      document.removeEventListener(
        "contextmenu",
        disableRightClick
      );
    };

  }, []);


  useEffect(() => {

    const mobile =
      localStorage.getItem("mobile_number");

    if (!mobile) {

      router.push("/");
      return;

    }

    setIsAuthenticated(true);

  }, [router]);


  useEffect(() => {

    const savedRequest =
      localStorage.getItem("last_request");

    if (!savedRequest) return;

    const data = JSON.parse(savedRequest);

    // Search filters
    if (data.district) {
      setDistrict(data.district);
    }

    if (data.taluka) {
      setTaluka(data.taluka);
    }

    if (data.village) {
      setVillage(data.village);
    }

    // Applicant Details
    if (data.applicant_name) {
      setApplicantName(data.applicant_name);
    }
    if (data.mobile_number) {
      setMobileNumber(data.mobile_number);
    }
    if (data.email) {
      setEmail(data.email);
    }

    if (data.address_district) {
      setAddressDistrict(data.address_district);
    }

    if (data.address_taluka) {
      setAddressTaluka(data.address_taluka);
    }

    if (data.address_village) {
      setAddressVillage(data.address_village);
    }

  }, []);


  // Load districts
  useEffect(() => {
    axios.get(`${API_BASE}/districts/`).then((res) => {
      setDistricts(res.data);

      if (res.data.length === 1) {
        setDistrict(res.data[0]);
      }
    });
  }, []);

  // Load talukas
  useEffect(() => {
    if (district) {
      axios.get(`${API_BASE}/talukas/`, {
        params: {
          district,

        },
      }).then((res) => {
        setTalukas(res.data);

        if (taluka && !res.data.includes(taluka)) {
          setTaluka("");
        }
      });
    }
  }, [district]);

  // Load villages
  useEffect(() => {
    if (district) {
      axios.get(`${API_BASE}/villages/`, {
        params: {
          district,
          taluka,

        },
      }).then((res) => {
        setVillages(res.data);

        if (village && !res.data.includes(village)) {
          setVillage("");
        }
      });
    }
  }, [district, taluka]);

  useEffect(() => {

    if (addressDistrict) {

      axios
        .get(
          `${API_BASE}/talukas/?district=${encodeURIComponent(addressDistrict)}`
        )
        .then((res) => {

          setAddressTalukas(res.data);

        });

    }

  }, [addressDistrict]);

  useEffect(() => {

    if (
      addressDistrict &&
      addressTaluka
    ) {

      axios
        .get(
          `${API_BASE}/villages/?district=${encodeURIComponent(addressDistrict)}&taluka=${encodeURIComponent(addressTaluka)}`
        )
        .then((res) => {

          setAddressVillages(res.data);

        });

    }

  }, [
    addressDistrict,
    addressTaluka
  ]);
  useEffect(() => {

    fetchNivadaNames();

  }, [district, taluka, village, project, surveyNumber, gatNumber]);


  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem("last_request") || "null"
      );

    if (!data) return;

    if (
      data.nivada_name &&
      Nvd_Names.includes(data.nivada_name)
    ) {
      setNvd_Name(data.nivada_name);
    }

  }, [Nvd_Names]);

  // Load projects
  useEffect(() => {
    if (district) {
      axios.get(`${API_BASE}/projects/`, {
        params: {
          district,
          taluka,
          village,
          nivada_name: Nvd_Name,
          survey_number: surveyNumber,
          gat_number: gatNumber,
        },
      }).then((res) => {
        setProjects(res.data);

        if (project && !res.data.includes(project)) {
          setProject("");
        }
      });
    }
  }, [district, taluka, village, Nvd_Name, surveyNumber, gatNumber]);


  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem("last_request") || "null"
      );

    if (!data) return;

    if (
      data.project_name &&
      projects.includes(data.project_name)
    ) {
      setProject(data.project_name);
    }

  }, [projects]);

  // Load survey numbers

  useEffect(() => {
    if (district) {
      axios.get(`${API_BASE}/survey-numbers/`, {
        params: {
          district,
          taluka,
          village,
          project_name: project,
          nivada_name: Nvd_Name,
          gat_number: gatNumber,
        },
      }).then((res) => {
        setSurveyNumbers(res.data);

        if (surveyNumber && !res.data.includes(surveyNumber)) {
          setSurveyNumber("");
        }
      });
    }
  }, [district, taluka, village, project, Nvd_Name, gatNumber]);

  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem("last_request") || "null"
      );

    if (!data) return;

    if (
      data.survey_number &&
      surveyNumbers.includes(data.survey_number)
    ) {
      setSurveyNumber(data.survey_number);
    }

  }, [surveyNumbers]);

  // Load gat numbers
  useEffect(() => {
    if (district) {
      axios.get(`${API_BASE}/gat-numbers/`, {
        params: {
          district,
          taluka,
          village,
          project_name: project,
          nivada_name: Nvd_Name,
          survey_number: surveyNumber,
        },
      }).then((res) => {
        setGatNumbers(res.data);

        if (gatNumber && !res.data.includes(gatNumber)) {
          setGatNumber("");
        }
      });
    }
  }, [district, taluka, village, project, Nvd_Name, surveyNumber]);

  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem("last_request") || "null"
      );

    if (!data) return;

    if (
      data.gat_number &&
      gatNumbers.includes(data.gat_number)
    ) {
      setGatNumber(data.gat_number);
    }

  }, [gatNumbers]);

  const searchRecords = async () => {
    setHasSearched(true);
    setSelectedRecord(null);
    setLoading(true);

    try {

      const response = await axios.get(`${API_BASE}/user/`, {
        params: {
          page,
          district,
          taluka,
          village,
          project_name: project,
          nivada_name: Nvd_Name,
          survey_number: surveyNumber,
          gat_number: gatNumber,
        },
      });

      setRecords(response.data.results);
      setTotalCount(response.data.count);
      setTotalPages(
        Math.ceil(response.data.count / 100)
      );
      setHasNext(!!response.data.next);
      setHasPrevious(!!response.data.previous);

      if (response.data.results.length === 1) {
        const r = response.data.results[0];

        if (!taluka && r.taluka) setTaluka(r.taluka);
        if (!village && r.village) setVillage(r.village);
        if (!Nvd_Name && r.Nvd_Name) setNvd_Name(r.Nvd_Name);
        if (!project && r.project_name) setProject(r.project_name);

        if (!surveyNumber && r.survey_number && r.survey_number !== "-") {
          setSurveyNumber(r.survey_number);
        }

        if (!gatNumber && r.gat_number && r.gat_number !== "-") {
          setGatNumber(r.gat_number);
        }
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };
  useEffect(() => {

    if (hasSearched) {

      searchRecords();

    }

  }, [page]);

  // Presentation-only react-select theme
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "40px",
      borderRadius: "6px",
      backgroundColor: state.isDisabled ? "#f1f5f9" : "#ffffff",
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
    singleValue: (provided: any) => ({
      ...provided,
      color: "#0f172a",
      fontWeight: 500,
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#0f172a",
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
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0f2a5f"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#0f172a",
      padding: "9px 12px",
      cursor: "pointer",
      fontSize: "14px",
      lineHeight: 1.5,
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "#64748b",
      fontSize: "14px",
    }),
  };
  const fetchNivadaNames = async () => {

    let url = `${API_BASE}/nivada-names/`;

    const params = new URLSearchParams();

    if (district) {
      params.append("district", district);
    }

    if (taluka) {
      params.append("taluka", taluka);
    }

    if (village) {
      params.append("village", village);
    }

    if (project) {
      params.append("project_name", project);
    }

    if (surveyNumber) {
      params.append("survey_number", surveyNumber);
    }

    if (gatNumber) {
      params.append("gat_number", gatNumber);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    setNvd_Names(data);

    if (Nvd_Name && !data.includes(Nvd_Name)) {
      setNvd_Name("");
    }
  };

  const handleViewOriginalRecord = async (
    recordId: number
  ) => {
    try {
      const res = await axios.get(
        `${API_BASE}/original-record/${recordId}/`
      );

      if (!res.data.image_available) {
        toast.error("Original record image not available");
        return;
      }

      const backendOrigin = new URL(API_BASE).origin;

      setOriginalImageUrl(
        `${backendOrigin}${res.data.image_url}`
      );

      // Store navigation information
      setOriginalRecordId(recordId);
      setOriginalVolumeNo(res.data.volume_no);
      setOriginalPageNo(res.data.page_no);
      setOriginalVolumePages(res.data.volume_pages || []);
      setOriginalTotalPages(res.data.total_pages || 0);

      setZoom(1);
      setShowOriginalModal(true);

    } catch (error) {
      console.error(error);
      toast.error("Unable to load original record");
    }
  };

  const loadOriginalRecordPage = async (
    pageNo: number
  ) => {
    if (
      originalRecordId === null ||
      originalVolumeNo === null
    ) {
      return;
    }

    if (!originalVolumePages.includes(pageNo)) {
      toast.error(
        `Page ${pageNo} is not available in this volume.`
      );
      return;
    }

    try {
      const backendOrigin = new URL(API_BASE).origin;

      const imageUrl =
        `${backendOrigin}/api/original-record-image/` +
        `${originalRecordId}/?page_no=${pageNo}`;

      setOriginalImageUrl(imageUrl);
      setOriginalPageNo(pageNo);
      setZoom(1);

    } catch (error) {
      console.error(error);
      toast.error("Unable to load the selected page.");
    }
  };

  const goToPreviousOriginalPage = () => {
    if (originalPageNo === null) {
      return;
    }

    const currentIndex =
      originalVolumePages.indexOf(originalPageNo);

    if (currentIndex > 0) {
      loadOriginalRecordPage(
        originalVolumePages[currentIndex - 1]
      );
    }
  };

  const goToNextOriginalPage = () => {
    if (originalPageNo === null) {
      return;
    }

    const currentIndex =
      originalVolumePages.indexOf(originalPageNo);

    if (
      currentIndex !== -1 &&
      currentIndex < originalVolumePages.length - 1
    ) {
      loadOriginalRecordPage(
        originalVolumePages[currentIndex + 1]
      );
    }
  };

  if (!isAuthenticated) {
    return null;
  }
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
          <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#12285a] text-amber-400 shadow-sm">
                <FaLandmark size={19} />
              </span>
              <div className="min-w-0 leading-snug">
                <h1 className="text-lg font-bold text-[#12285a] sm:text-xl">
                  Welcome to Collector Office, Ahilyanagar
                </h1>
                <p className="text-sm font-medium text-slate-700">
                  Land Acquisition Certificate Portal
                  <span className="hidden text-slate-500 md:inline">
                    {" "}— Search Land Acquisition Records and Generate Certificates Online
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {

                localStorage.removeItem(
                  "mobile_number"
                );

                router.push("/");

              }}
              className={`${btnSecondary} shrink-0 bg-white`}
            >
              <FaSignOutAlt size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* MAIN CARD */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-12">

          {/* LEFT FILTER SECTION */}
          <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-slate-50 lg:col-span-3 lg:border-b-0 lg:border-r">

            <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#12285a] text-white">
                <FaFilter size={11} />
              </span>
              <h2 className="text-base font-bold text-[#12285a]">
                Land Search
              </h2>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">

              <div>
                <label className={fieldLabel}>District</label>
                <Select
                  aria-label="District"
                  isClearable={false}
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}
                  options={districts.map((d) => ({
                    value: d,
                    label: d,
                  }))}
                  value={
                    district
                      ? { value: district, label: district }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setDistrict(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);

                    setTaluka("");
                    setVillage("");
                    setNvd_Name("");
                    setProject("");
                    setSurveyNumber("");
                    setGatNumber("");
                  }}
                  placeholder="Select District"
                  isSearchable={false}
                  className="text-slate-900"
                />
              </div>

              <div>
                <label className={fieldLabel}>Taluka</label>
                <Select
                  aria-label="Taluka"
                  isClearable
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}
                  options={talukas.map((t) => ({
                    value: t,
                    label: t,
                  }))}

                  value={
                    taluka
                      ? { value: taluka, label: taluka }
                      : null
                  }

                  onChange={(selectedOption) => {
                    setTaluka(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);
                    setVillage("");
                    setNvd_Name("");
                    setProject("");
                    setSurveyNumber("");
                    setGatNumber("");
                  }}

                  placeholder="Select Taluka"
                  isSearchable
                  isDisabled={!district}

                  className="text-slate-900"
                />
              </div>

              <div>
                <label className={fieldLabel}>Village</label>
                <Select
                  aria-label="Village"
                  isClearable
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}
                  options={villages.map((v) => ({
                    value: v,
                    label: v,
                  }))}

                  value={
                    village
                      ? { value: village, label: village }
                      : null
                  }

                  onChange={(selectedOption) => {
                    setVillage(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);

                    setNvd_Name("");
                    setProject("");
                    setSurveyNumber("");
                    setGatNumber("");

                  }}

                  placeholder="Select Village"
                  isSearchable
                  isDisabled={!taluka}

                  className="text-slate-900"
                />
              </div>

              <div>
                <label className={fieldLabel}>Name</label>
                <Select
                  aria-label="Name"
                  isClearable
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}

                  options={Nvd_Names.map((n) => ({
                    value: n,
                    label: n,
                  }))}

                  value={
                    Nvd_Name
                      ? {
                        value: Nvd_Name,

                        label: Nvd_Name,
                      }
                      : null
                  }

                  onChange={(selectedOption) => {
                    setNvd_Name(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);

                  }}

                  placeholder="Select Name"

                  isSearchable

                  isDisabled={!district}

                  className="text-slate-900"
                />
              </div>

              <div>
                <label className={fieldLabel}>Project</label>
                <Select
                  aria-label="Project"
                  isClearable
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}
                  options={projects.map((p) => ({
                    value: p,
                    label: p,
                  }))}

                  value={
                    project
                      ? { value: project, label: project }
                      : null
                  }

                  onChange={(selectedOption) => {
                    setProject(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);

                  }}

                  placeholder="Select Project"
                  isSearchable
                  isDisabled={!district}

                  className="text-slate-900"
                />
              </div>


              <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={fieldLabel}>Survey Number</label>
                <Select
                  aria-label="Survey Number"
                  isClearable
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}
                  options={surveyNumbers.map((s) => ({
                    value: s,
                    label: s,
                  }))}

                  value={
                    surveyNumber
                      ? { value: surveyNumber, label: surveyNumber }
                      : null
                  }

                  onChange={(selectedOption) => {
                    setSurveyNumber(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);

                  }}

                  placeholder="Select Survey Number"
                  isSearchable
                  isDisabled={!district}

                  className="text-slate-900"
                />
              </div>

              <div>
                <label className={fieldLabel}>Gat Number</label>
                <Select
                  aria-label="Gat Number"
                  isClearable
                  noOptionsMessage={() => "No results found"}
                  styles={customSelectStyles}
                  options={gatNumbers.map((g) => ({
                    value: g,
                    label: g,
                  }))}

                  value={
                    gatNumber
                      ? { value: gatNumber, label: gatNumber }
                      : null
                  }

                  onChange={(selectedOption) => {
                    setGatNumber(selectedOption?.value || "");
                    setPage(1);
                    setRecords([]);
                    setSelectedRecord(null);
                  }}

                  placeholder="Select Gat Number"
                  isSearchable
                  isDisabled={!district}

                  className="text-slate-900"
                />
              </div>
              </div>

            </div>

            <div className="shrink-0 space-y-2 border-t border-slate-200 bg-slate-50 p-3">

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={loading}
                  onClick={searchRecords}
                  className={`${btnPrimary} w-full`}
                >
                  <FaSearch size={11} />
                  {loading ? "Searching..." : "Search"}
                </button>

                <button
                  onClick={() => {

                    localStorage.removeItem("last_request");
                    setPage(1);
                    setDistrict("अहमदनगर");

                    setTaluka("");
                    setVillage("");
                    setNvd_Name("");
                    setProject("");
                    setSurveyNumber("");
                    setGatNumber("");

                    setRecords([]);
                  }}
                  className={`${btnSecondary} w-full`}
                >
                  <FaUndo size={10} />
                  Clear Filters
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                <button
                  disabled={!selectedRecord}
                  onClick={() =>
                    handleViewOriginalRecord(selectedRecord.id)
                  }
                  className={`${btnOutline} w-full`}
                >
                  <FaImage size={12} />
                  View Original
                </button>

                <button
                  disabled={!selectedRecord}
                  onClick={() => {

                    if (!selectedRecord) {
                      toast.error("Please select one record");
                      return;
                    }

                    const lastRequest = JSON.parse(
                      localStorage.getItem("last_request") || "null"
                    );

                    if (lastRequest) {

                      setApplicantName(
                        lastRequest.applicant_name || ""
                      );
                      setMobileNumber(
                        lastRequest.mobile_number || ""
                      );
                      setEmail(
                        lastRequest.email || ""
                      );

                      setAddressDistrict(
                        lastRequest.address_district || ""
                      );

                      setAddressTaluka(
                        lastRequest.address_taluka || ""
                      );

                      setAddressVillage(
                        lastRequest.address_village || ""
                      );
                    }

                    setActionType("preview");
                    setShowReportForm(true);

                  }}
                  className={`${btnOutline} w-full`}
                >
                  <FaFileInvoice size={12} />
                  Preview Certificate
                </button>
              </div>

              <button
                disabled={!selectedRecord}
                onClick={() => {

                    if (!selectedRecord) {
                      alert("Please select one record");
                      return;
                    }

                    const lastRequest = JSON.parse(
                      localStorage.getItem("last_request") || "null"
                    );

                    if (lastRequest) {

                      setApplicantName(
                        lastRequest.applicant_name || ""
                      );
                      setMobileNumber(
                        lastRequest.mobile_number || ""
                      );
                      setEmail(
                        lastRequest.email || ""
                      );

                      setAddressDistrict(
                        lastRequest.address_district || ""
                      );

                      setAddressTaluka(
                        lastRequest.address_taluka || ""
                      );

                      setAddressVillage(
                        lastRequest.address_village || ""
                      );
                    }

                    setActionType("request");
                    setShowReportForm(true);

                  }}
                className={`${btnAccent} w-full`}
              >
                <FaFileAlt size={12} />
                Request Certificate
              </button>

              <button
                onClick={() => router.push("/user/requests")}
                className={`${btnSecondary} w-full`}
              >
                <FaListAlt size={12} />
                Requests Status
              </button>
            </div>
          </aside>

          {/* RIGHT TABLE SECTION */}
          <section className="flex min-h-0 flex-col bg-white lg:col-span-9">

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-bold text-[#12285a]">
                Search Records
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {selectedRecord && (
                  <span className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-sm font-semibold text-[#12285a]">
                    Selected ID {selectedRecord.id}
                  </span>
                )}
                {hasSearched && (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-800">
                    {totalCount} record{totalCount === 1 ? "" : "s"} found
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-[70vh] min-h-[240px] flex-1 overflow-auto lg:max-h-none lg:min-h-0">
              <table className="w-full border-collapse bg-white">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className={`${thCls} w-16 text-center`}>Select</th>
                    <th className={thCls}>ID</th>
                    <th className={thCls}>District</th>
                    <th className={thCls}>Taluka</th>
                    <th className={thCls}>Village</th>
                    <th className={thCls}>Project</th>
                    <th className={thCls}>Nivada Name</th>
                    <th className={thCls}>Survey No</th>
                    <th className={thCls}>Gat No</th>
                  </tr>
                </thead>

                <tbody>

                  {records.map((record, index) => (
                    <tr
                      key={index}
                      className={
                        selectedRecord?.id === record.id
                          ? "bg-amber-50 shadow-[inset_4px_0_0_#f59e0b]"
                          : "bg-white transition-colors hover:bg-slate-50"
                      }
                    >
                      <td className={`${tdCls} text-center`}>

                        <input
                          type="radio"
                          name="selectedRecord"
                          aria-label={`Select record ${record.id}`}
                          checked={selectedRecord?.id === record.id}
                          onChange={() => setSelectedRecord(record)}
                          className="h-4 w-4 cursor-pointer accent-[#12285a] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                        />

                      </td>
                      <td className={tdCls}>{record.id}</td>
                      <td className={`${tdCls} font-medium`}>{record.district}</td>
                      <td className={`${tdCls} font-medium`}>{record.taluka}</td>
                      <td className={`${tdCls} font-medium`}>{record.village}</td>
                      <td className={`${tdCls} font-medium`}>{record.project_name}</td>
                      <td className={`${tdCls} font-medium`}>{record.Nvd_Name || "-"}</td>
                      <td className={`${tdCls} font-medium`}>{record.survey_number || "-"}</td>
                      <td className={`${tdCls} font-medium`}>{record.gat_number || "-"}</td>
                    </tr>
                  ))}

                </tbody>
              </table>

              {records.length === 0 && (
                <div className="flex h-48 flex-col items-center justify-center gap-2 px-4 text-center text-base text-slate-600">
                  {loading ? (
                    <>
                      <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-[#12285a]" />
                      <span className="font-medium">Searching records...</span>
                    </>
                  ) : (
                    <>
                      <FaSearch size={22} className="text-slate-400" />
                      <span className="font-medium">
                        {hasSearched ? "No records found" : "Use the filters and click Search to find records"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* PAGINATION BAR */}
            {hasSearched && (
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    title="First page"
                    aria-label="First page"
                    className={iconBtn}
                  >
                    <FaAngleDoubleLeft size={12} />
                  </button>

                  <button
                    disabled={!hasPrevious}
                    onClick={() => setPage(page - 1)}
                    title="Previous page"
                    aria-label="Previous page"
                    className={iconBtn}
                  >
                    <FaAngleLeft size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-semibold text-[#12285a]">
                    Page {page} of {totalPages || 1}
                  </span>
                  <span className="hidden text-slate-400 sm:inline">•</span>
                  <span className="hidden font-medium text-slate-700 sm:inline">
                    {totalCount} total records
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={!hasNext}
                    onClick={() => setPage(page + 1)}
                    title="Next page"
                    aria-label="Next page"
                    className={iconBtn}
                  >
                    <FaAngleRight size={12} />
                  </button>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    title="Last page"
                    aria-label="Last page"
                    className={iconBtn}
                  >
                    <FaAngleDoubleRight size={12} />
                  </button>
                </div>

              </div>
            )}

          </section>

        </div>

        {/* APPLICANT DETAILS */}
        {showReportForm && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 border-l-4 border-l-amber-500 px-5 py-4">
                <h2 className="text-lg font-bold text-[#12285a]">
                  Applicant Details
                </h2>

                <button
                  onClick={() => setShowReportForm(false)}
                  aria-label="Close"
                  className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-28">

                <div>
                  <label className={fieldLabel}>Applicant Name</label>
                  <input
                    type="text"
                    placeholder="Applicant Name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Mobile Number</label>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={inputCls}
                  />
                </div>
                {actionType === "request" && (
                  <div>
                    <label className={fieldLabel}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                )}

                <div>
                  <label className={fieldLabel}>District</label>
                  <Select
                    aria-label="Address District"
                    isClearable
                    noOptionsMessage={() => "No results found"}
                    styles={customSelectStyles}

                    options={districts.map((d) => ({
                      value: d,
                      label: d,
                    }))}

                    value={
                      addressDistrict
                        ? {
                          value: addressDistrict,
                          label: addressDistrict,
                        }
                        : null
                    }

                    onChange={(selectedOption) => {

                      setAddressDistrict(
                        selectedOption?.value || ""
                      );

                      setAddressTaluka("");
                      setAddressVillage("");
                    }}

                    placeholder="Select District"

                    isSearchable

                    className="text-slate-900"
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Taluka</label>
                  <Select
                    aria-label="Address Taluka"
                    isClearable
                    noOptionsMessage={() => "No results found"}
                    styles={customSelectStyles}

                    options={addressTalukas.map((t) => ({
                      value: t,
                      label: t,
                    }))}

                    value={
                      addressTaluka
                        ? {
                          value: addressTaluka,
                          label: addressTaluka,
                        }
                        : null
                    }

                    onChange={(selectedOption) => {

                      setAddressTaluka(
                        selectedOption?.value || ""
                      );

                      setAddressVillage("");
                    }}

                    placeholder="Select Taluka"

                    isSearchable

                    isDisabled={!addressDistrict}

                    className="text-slate-900"
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Village</label>
                  <Select
                    aria-label="Address Village"
                    isClearable
                    noOptionsMessage={() => "No results found"}
                    styles={customSelectStyles}

                    options={addressVillages.map((v) => ({
                      value: v,
                      label: v,
                    }))}

                    value={
                      addressVillage
                        ? {
                          value: addressVillage,
                          label: addressVillage,
                        }
                        : null
                    }

                    onChange={(selectedOption) => {

                      setAddressVillage(
                        selectedOption?.value || ""
                      );
                    }}

                    placeholder="Select Village"

                    isSearchable

                    isDisabled={!addressTaluka}

                    className="text-slate-900"
                  />
                </div>

              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">

                <button
                  onClick={() => setShowReportForm(false)}
                  className={btnSecondary}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {

                      const trimmedName =
                        applicantName.trim();

                      const trimmedMobile =
                        mobileNumber.trim();
                      const trimmedEmail =
                        email.trim();



                      // Applicant Name Required
                      if (!trimmedName) {

                        toast.error(
                          "Applicant Name is required"
                        );

                        return;
                      }


                      // Applicant Name Validation
                      const nameRegex =
                        /^[a-zA-Z\u0900-\u097F\s]+$/;

                      if (
                        !nameRegex.test(trimmedName)
                      ) {

                        toast.error(
                          "Enter valid applicant name"
                        );

                        return;
                      }


                      // Mobile Required
                      if (!trimmedMobile) {

                        toast.error(
                          "Mobile Number is required"
                        );

                        return;
                      }


                      // Indian Mobile Validation
                      const mobileRegex =
                        /^[6-9]\d{9}$/;

                      if (
                        !mobileRegex.test(
                          trimmedMobile
                        )
                      ) {

                        toast.error(
                          "Enter valid 10-digit mobile number"
                        );

                        return;
                      }

                      if (!addressVillage.trim()) {

                        toast.error("Village is required");

                        return;
                      }

                      if (!addressTaluka.trim()) {

                        toast.error("Taluka is required");

                        return;
                      }

                      if (!addressDistrict.trim()) {

                        toast.error("District is required");

                        return;
                      }


                      if (actionType === "preview") {

                        axios.post(
                          `${API_BASE}/certificate-preview/`,
                          {
                            record_id: selectedRecord.id,
                            volume_no: selectedRecord.volume_no,
                            page_no: selectedRecord.page_no,
                            entryno: selectedRecord.entryno,
                            applicant_name: trimmedName,

                            mobile_number: trimmedMobile,
                            email: trimmedEmail,
                            address_village: addressVillage,

                            address_taluka: addressTaluka,

                            address_district: addressDistrict,
                          }
                        )
                          .then((res) => {

                            sessionStorage.setItem(
                              "previewImage",
                              res.data.image
                            );

                            setShowReportForm(false);

                            sessionStorage.setItem(
                              "searchState",
                              JSON.stringify({
                                district,
                                taluka,
                                village,
                                project,
                                Nvd_Name,
                                surveyNumber,
                                gatNumber,
                                page,

                                records,
                                selectedRecord,

                                applicantName,
                                mobileNumber,
                                email,

                                addressDistrict,
                                addressTaluka,
                                addressVillage,
                              })
                            );

                            router.push(
                              "/certificate-preview"
                            );

                          })
                          .catch((err) => {

                            console.error(err);

                            toast.error(
                              "Unable to load preview"
                            );

                          });


                      }


                      else {

                        if (!trimmedEmail) {

                          toast.error("Email is required");

                          return;
                        }

                        const emailRegex =
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (!emailRegex.test(trimmedEmail)) {

                          toast.error("Enter valid email address");

                          return;
                        }

                        if (submitting) return;

                        setSubmitting(true);

                        axios.post(
                          `${API_BASE}/certificate/request/`,
                          {

                            record_id:
                              selectedRecord.id,

                            volume_no: selectedRecord.volume_no,
                            page_no: selectedRecord.page_no,
                            entryno: selectedRecord.entryno,

                            district:
                              selectedRecord.district,

                            taluka:
                              selectedRecord.taluka,

                            village:
                              selectedRecord.village,

                            project_name:
                              selectedRecord.project_name,

                            nivada_name:
                              selectedRecord.Nvd_Name,

                            survey_number:
                              selectedRecord.survey_number,

                            gat_number:
                              selectedRecord.gat_number,

                            applicant_name:
                              trimmedName,

                            mobile_number:
                              trimmedMobile,
                            email: trimmedEmail,
                            address_district:
                              addressDistrict,

                            address_taluka:
                              addressTaluka,

                            address_village:
                              addressVillage
                          }
                        )
                          .then((response) => {

                            toast.success(
                              `Certificate Request Submitted Successfully\nRequest ID: ${response.data.request_id}`
                            );

                            setShowReportForm(false);
                            setSelectedRecord(null);


                          })
                          .catch((error) => {

                            console.error(error);

                            toast.error(
                              error?.response?.data?.error ||
                              "Unable to submit certificate request"
                            );

                          })
                          .finally(() => {

                            setSubmitting(false);

                          });

                      }

                    }}
                  disabled={submitting}
                  className={btnPrimary}
                >
                  {
                    actionType === "preview"
                      ? "Preview Certificate"
                      : (submitting ? "Submitting..." : "Request Certificate")
                  }
                </button>

              </div>

            </div>

          </div>

        )}

        {/* ORIGINAL RECORD VIEWER */}
        {showOriginalModal && (
          <div
            className="fixed inset-0 z-50 bg-slate-800"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowOriginalModal(false);
              }
            }}
          >
            <div className="flex h-full flex-col">

              {/* TOP TOOLBAR */}
              <div className="relative z-50 shrink-0 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex h-14 w-full items-center justify-between gap-2 px-3 sm:px-5">

                  <div className="flex items-center gap-2">

                    <div className="flex items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          setZoom((prev) =>
                            Math.max(0.5, Number((prev - 0.25).toFixed(2)))
                          )
                        }
                        disabled={zoom <= 0.5}
                        aria-label="Zoom out"
                        className="flex h-9 w-9 items-center justify-center text-slate-800 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <FaMinus size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setZoom(1)}
                        title="Reset zoom"
                        className="flex h-9 min-w-[64px] items-center justify-center border-x border-slate-300 bg-slate-50 px-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700"
                      >
                        {Math.round(zoom * 100)}%
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setZoom((prev) =>
                            Math.min(5, Number((prev + 0.25).toFixed(2)))
                          )
                        }
                        disabled={zoom >= 5}
                        aria-label="Zoom in"
                        className="flex h-9 w-9 items-center justify-center text-slate-800 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className="hidden h-9 rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 sm:block"
                    >
                      Reset
                    </button>

                  </div>

                  <h2 className="hidden whitespace-nowrap text-base font-bold text-[#12285a] md:block">
                    Original Record
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowOriginalModal(false)}
                    aria-label="Close"
                    className="flex h-9 items-center gap-1.5 rounded-md bg-[#12285a] px-3 text-sm font-semibold text-white transition hover:bg-[#0a1f44] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 active:scale-95"
                  >
                    <FaTimes size={12} />
                    <span className="hidden sm:inline">Close</span>
                  </button>

                </div>
              </div>

              {/* IMAGE VIEWER */}
              <div
                className="flex-1 overflow-auto p-3 sm:p-5"
                onWheel={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();

                    setZoom((prev) =>
                      Math.min(
                        5,
                        Math.max(
                          0.5,
                          Number((prev - e.deltaY * 0.001).toFixed(2))
                        )
                      )
                    );
                  }
                }}
              >

              {/* PAGE NAVIGATION */}
              <div className="mx-auto mb-3 flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">

                <button
                  type="button"
                  onClick={goToPreviousOriginalPage}
                  disabled={
                    originalPageNo === null ||
                    originalVolumePages.indexOf(originalPageNo) <= 0
                  }
                  className="flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <span className="mr-1">←</span>
                  Previous
                </button>

                <div className="flex items-center gap-1.5 px-1">

                  <span className="text-sm font-medium text-slate-700">
                    Page
                  </span>

                  <input
                    type="number"
                    min={1}
                    value={originalPageNo ?? ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (e.target.value === "") {
                        setOriginalPageNo(null);
                        return;
                      }

                      if (Number.isInteger(value) && value > 0) {
                        setOriginalPageNo(value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = Number(
                          (e.target as HTMLInputElement).value
                        );

                        if (
                          Number.isInteger(value) &&
                          value > 0
                        ) {
                          loadOriginalRecordPage(value);
                        }
                      }
                    }}
                    aria-label="Page number"
                    className="h-9 w-20 rounded-md border border-slate-300 bg-white px-2 text-center text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-600/25"
                  />

                  <span className="whitespace-nowrap text-sm font-medium text-slate-600">
                    / {originalTotalPages}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={goToNextOriginalPage}
                  disabled={
                    originalPageNo === null ||
                    originalVolumePages.indexOf(originalPageNo) ===
                    originalVolumePages.length - 1
                  }
                  className="flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Next
                  <span className="ml-1">→</span>
                </button>

              </div>

                <div className="flex min-w-full justify-center">

                  <div
                    style={{
                      width: `${zoom * 100}%`,
                      minWidth: zoom < 1 ? "0" : "100%",
                    }}
                  >
                    <img
                      src={originalImageUrl}
                      alt="Original Record"
                      onContextMenu={(e) => e.preventDefault()}
                      onDoubleClick={() => setZoom(1)}
                      draggable={false}
                      className="mx-auto block select-none rounded-sm bg-white shadow-2xl"
                      style={{
                        width: "100%",
                        maxWidth: "none",
                        height: "auto",
                      }}
                    />
                  </div>

                </div>

              </div>


            </div>
          </div>
        )}

      </div>
    </>
  );
}