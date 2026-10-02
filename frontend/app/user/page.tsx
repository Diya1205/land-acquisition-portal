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
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

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

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "34px",
      borderRadius: "9px",
      border: state.isFocused
        ? "2px solid #2563eb"
        : "2px solid #d1d5db",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      "&:hover": {
        border: "2px solid #2563eb",
      },
      fontSize: "13px",
      transition: "all 0.15s ease",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 8px",
    }),

    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "34px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "black",
      padding: 8,
      cursor: "pointer",
      fontSize: "13px",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "13px",
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
            borderRadius: "12px",
            background: "#fff",
            color: "#111827",
          },
        }}
      />
      <div className="h-screen bg-slate-100 p-3 overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-3.5 text-center text-white shadow-lg shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome to Collector Office, Ahilyanagar
          </h1>

          <p className="mt-1 text-sm">
            Land Acquisition Certificate Portal
          </p>

          <p className="text-xs opacity-90">
            Search Land Acquisition Records and Generate Certificates Online
          </p>
          <button
            onClick={() => {

              localStorage.removeItem(
                "mobile_number"
              );

              router.push("/");

            }}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
          >
            <FaSignOutAlt size={12} />
            Logout
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">

          {/* LEFT FILTER SECTION — non-scrollable, fits on one screen */}
          <div className="lg:col-span-2 border-r border-gray-200 bg-gray-50 flex flex-col min-h-0 overflow-hidden">

            <div className="px-3 pt-3 pb-1.5 shrink-0">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <FaFilter size={10} className="text-blue-600" />
                Land Search
              </h2>

            </div>
            <div className="flex-1 px-3 pb-3 min-h-0 flex flex-col justify-between overflow-y-auto pr-1">

              <div className="space-y-1.5">

                <Select
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
                  className="text-black"
                />

                <Select
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

                  className="text-black"
                />

                <Select
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

                  className="text-black"
                />
                <Select
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

                  className="text-black"
                />
                <Select
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

                  className="text-black"
                />

                <Select
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

                  className="text-black"
                />

                <Select
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

                  className="text-black"
                />

              </div>

              <div className="space-y-1.5 pt-1.5">

                <button
                  disabled={loading}
                  onClick={searchRecords}
                  className="w-full bg-blue-600 text-white py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-blue-700 disabled:bg-gray-400 font-medium text-xs shadow-sm"
                >
                  <FaSearch size={10} />
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
                  className="w-full bg-white border border-gray-300 text-gray-600 py-1.5 rounded-lg hover:bg-gray-100 font-medium text-xs"
                >
                  Clear Filters
                </button>

                <div className="h-px bg-gray-200" />

                <button
                  disabled={!selectedRecord}
                  onClick={() =>
                    handleViewOriginalRecord(selectedRecord.id)
                  }
                  className="w-full bg-white border-2 border-blue-600 text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-400 font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <FaImage size={10} />
                  View Original
                </button>

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
                  className="w-full bg-emerald-600 text-white py-1.5 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FaFileAlt size={10} />
                  Request Certificate
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
                  className="w-full bg-red-600 text-white py-1.5 rounded-lg hover:bg-red-700 disabled:bg-gray-300 font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FaFileInvoice size={10} />
                  Preview Certificate
                </button>
                <button
                  onClick={() => router.push("/user/requests")}
                  className="w-full bg-indigo-600 text-white py-1.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Requests Status
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT TABLE SECTION */}
          <div className="lg:col-span-10 flex flex-col min-h-0 bg-white">

            <div className="px-4 pt-3.5 pb-2 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-slate-800">
                Search Records
              </h2>
              {hasSearched && (
                <span className="text-xs text-gray-500 font-medium">
                  {totalCount} record{totalCount === 1 ? "" : "s"} found
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-3 min-h-0">

              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse bg-white">
                  <thead className="sticky top-0 z-10">
                    <tr>

                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-center w-14">
                        Select
                      </th>
                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        ID
                      </th>
                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        District
                      </th>

                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        Taluka
                      </th>

                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        Village
                      </th>

                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        Project
                      </th>
                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        Nivada Name
                      </th>

                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        Survey No
                      </th>

                      <th className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold uppercase tracking-wide text-left">
                        Gat No
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {records.map((record, index) => (
                      <tr
                        key={index}
                        className={
                          selectedRecord?.id === record.id
                            ? "bg-blue-50 hover:bg-blue-50"
                            : "bg-white hover:bg-gray-50"
                        }
                      >
                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-center">

                          <input
                            type="radio"
                            name="selectedRecord"
                            checked={selectedRecord?.id === record.id}
                            onChange={() => setSelectedRecord(record)}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />

                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black whitespace-nowrap">
                          {record.id}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.district}
                        </td>

                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.taluka}
                        </td>

                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.village}
                        </td>

                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.project_name}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.Nvd_Name || "-"}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.survey_number || "-"}
                        </td>

                        <td className="px-3 py-2 border-b border-gray-100 text-sm text-black font-medium whitespace-nowrap">
                          {record.gat_number || "-"}
                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>
                {records.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                    {hasSearched ? "No records found" : "Use the filters and click Search to find records"}
                  </div>
                )}
              </div>
            </div>

            {/* PAGINATION BAR */}
            {hasSearched && (
              <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">

                <div className="flex items-center gap-1.5">

                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    title="First page"
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-slate-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    <FaAngleDoubleLeft size={11} />
                  </button>

                  <button
                    disabled={!hasPrevious}
                    onClick={() => setPage(page - 1)}
                    title="Previous page"
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-slate-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    <FaAngleLeft size={11} />
                  </button>

                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-slate-700 font-semibold">
                    Page {page} of {totalPages || 1}
                  </span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-500 font-medium hidden sm:inline">
                    {totalCount} total records
                  </span>
                </div>

                <div className="flex items-center gap-1.5">

                  <button
                    disabled={!hasNext}
                    onClick={() => setPage(page + 1)}
                    title="Next page"
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-slate-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    <FaAngleRight size={11} />
                  </button>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    title="Last page"
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-slate-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    <FaAngleDoubleRight size={11} />
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

        {showReportForm && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">

              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl shrink-0">
                <h2 className="text-lg font-bold text-slate-900">
                  Applicant Details
                </h2>

                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3">

                <input
                  type="text"
                  placeholder="Applicant Name"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full border-2 border-gray-200 p-2.5 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full border-2 border-gray-200 p-2.5 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {actionType === "request" && (
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 p-2.5 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                )}
                <Select
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

                  className="text-black"
                />

                <Select
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

                  className="text-black"
                />

                <Select
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

                  className="text-black"
                />


                <div className="flex gap-3 pt-2">

                  <button
                    onClick={() => setShowReportForm(false)}
                    className="flex-1 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium"
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
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-xl text-sm font-semibold disabled:bg-gray-400"
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

          </div>

        )}
        {showOriginalModal && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowOriginalModal(false);
              }
            }}
          >
            <div className="flex h-full flex-col">

              {/* =========================
          TOP TOOLBAR
      ========================= */}
              <div className="sticky top-0 z-50 shrink-0 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
                <div className="mx-auto flex h-14 w-full items-center justify-between px-3 sm:px-5">

                  {/* LEFT - ZOOM */}
                  <div className="flex items-center gap-1.5">

                    <button
                      type="button"
                      onClick={() =>
                        setZoom((prev) =>
                          Math.max(0.5, Number((prev - 0.25).toFixed(2)))
                        )
                      }
                      disabled={zoom <= 0.5}
                      aria-label="Zoom out"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <FaMinus size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      title="Reset zoom"
                      className="flex h-8 min-w-[58px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
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
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <FaPlus size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className="ml-1 hidden h-8 rounded-md px-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:block"
                    >
                      Reset
                    </button>

                  </div>

                  {/* CENTER - TITLE */}
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <h2 className="whitespace-nowrap text-sm font-semibold text-slate-800">
                      Original Record
                    </h2>
                  </div>

                  {/* RIGHT - CLOSE */}
                  <button
                    type="button"
                    onClick={() => setShowOriginalModal(false)}
                    aria-label="Close"
                    className="flex h-8 items-center gap-1.5 rounded-md bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 active:scale-95"
                  >
                    <FaTimes size={11} />
                    <span className="hidden sm:inline">Close</span>
                  </button>

                </div>
              </div>

              {/* =========================
          IMAGE VIEWER
      ========================= */}
              <div
                className="flex-1 overflow-auto p-3 sm:p-4"
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

                {/* =========================
            PAGE NAVIGATION
        ========================= */}
                <div className="mx-auto mb-3 flex w-fit max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm">

                  {/* PREVIOUS */}
                  <button
                    type="button"
                    onClick={goToPreviousOriginalPage}
                    disabled={
                      originalPageNo === null ||
                      originalVolumePages.indexOf(originalPageNo) <= 0
                    }
                    className="flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <span className="mr-1">←</span>
                    Previous
                  </button>

                  {/* PAGE INPUT */}
                  <div className="flex items-center gap-1.5 px-1">

                    <span className="text-xs font-medium text-slate-500">
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
                      className="h-8 w-16 rounded-md border border-slate-200 bg-white px-2 text-center text-xs font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <span className="whitespace-nowrap text-xs text-slate-400">
                      / {originalTotalPages}
                    </span>

                  </div>

                  {/* NEXT */}
                  <button
                    type="button"
                    onClick={goToNextOriginalPage}
                    disabled={
                      originalPageNo === null ||
                      originalVolumePages.indexOf(originalPageNo) ===
                      originalVolumePages.length - 1
                    }
                    className="flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Next
                    <span className="ml-1">→</span>
                  </button>

                </div>

                {/* =========================
            IMAGE
        ========================= */}
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
                      className="mx-auto block select-none rounded-lg shadow-xl"
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