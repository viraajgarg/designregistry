"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Applicant = { applicant_name: string; applicant_address: string };
type Priority = {
  application_number: string;
  country_name: string;
  date_of_filing_conversion_country: string;
};
type DesignImage = { image: string; image_view: string };
type Design = {
  id?: number;
  design_num_id: string;
  filing_date?: string;
  article_name?: string;
  class?: string;
  journal_num?: string | null;
  journal_date?: string | null;
  active?: string;
  image?: string | null;
  images?: DesignImage[];
  applicants?: Applicant[];
  priorities?: Priority[];
};
type SearchHit = {
  id?: string;
  name?: string;
  design_num_id?: string;
  article_name?: string;
  class?: string;
  score?: number;
  accuracy_percent?: number;
  image_base64?: string;
  image_media_type?: string;
  metadata?: Record<string, unknown>;
  image?: string;
};
type SearchCard = {
  designNumId: string;
  articleName: string;
  designClass: string;
  score?: number;
  imageUrl?: string;
};
type SearchMode = "image" | "semantic" | "text";
type ApplicantDraft = Applicant;
type PriorityDraft = Priority;

const imageBaseUrl =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "http://localhost/images/";
const maxImageBytes = 15 * 1024 * 1024;
const emptyApplicant = (): ApplicantDraft => ({
  applicant_name: "",
  applicant_address: "",
});
const emptyPriority = (): PriorityDraft => ({
  application_number: "",
  country_name: "",
  date_of_filing_conversion_country: "",
});

function Icon({
  name,
  size = 20,
}: {
  name: "search" | "upload" | "arrow" | "close" | "menu" | "plus" | "shield" | "image" | "spark";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5" /><path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    plus: <><path d="M12 5v14m-7-7h14" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function imageUrl(value?: string | null) {
  if (!value) return undefined;
  if (value.startsWith("data:") || /^https?:\/\//i.test(value)) return value;
  const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
  const imagePathIndex = normalized.toLowerCase().lastIndexOf("images/");
  const imagePath =
    imagePathIndex >= 0
      ? normalized.slice(imagePathIndex + "images/".length)
      : normalized.split("/").pop() ?? normalized;
  const filename = imagePath.split("/").pop() ?? imagePath;
  const baseUrl = imageBaseUrl.endsWith("/") ? imageBaseUrl : `${imageBaseUrl}/`;
  return new URL(filename, baseUrl).toString();
}

function designIsActive(active?: string) {
  return active === undefined || ["y", "yes", "true", "1"].includes(active.toLowerCase());
}

function dataImage(base64?: string, mediaType?: string) {
  if (!base64) return undefined;
  return `data:${mediaType || "image/jpeg"};base64,${base64}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, { ...init, cache: "no-store" });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      const detail = body?.detail;
      message = Array.isArray(detail)
        ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join("; ")
        : typeof detail === "string"
          ? detail
          : message;
    } catch {
      // Use the HTTP status when the server does not return JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function getSearchCards(data: unknown): SearchCard[] {
  const records = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "items" in data
      ? (data as { items?: unknown[] }).items ?? []
      : [];

  return records.map((entry) => {
    const item = entry as Design & SearchHit;
    const metadata = item.metadata ?? {};
    const designNumId =
      item.design_num_id ??
      (typeof metadata.design_num_id === "string" ? metadata.design_num_id : undefined) ??
      item.id ??
      item.name ??
      "Unknown design";
    const encoded = dataImage(item.image_base64, item.image_media_type);
    const detailImage =
      item.images?.[0]?.image_view ??
      item.images?.[0]?.image ??
      item.image ??
      (typeof metadata.image === "string" ? metadata.image : undefined);
    return {
      designNumId,
      articleName:
        item.article_name ??
        (typeof metadata.article_name === "string" ? metadata.article_name : undefined) ??
        item.name ??
        "Registered design",
      designClass:
        item.class ??
        (typeof metadata.class === "string" ? metadata.class : undefined) ??
        "Design registry",
      score:
        typeof item.accuracy_percent === "number"
          ? item.accuracy_percent
          : typeof item.score === "number"
            ? item.score >= 0 && item.score <= 1
              ? item.score * 100
              : item.score
            : undefined,
      imageUrl:
        encoded ??
        imageUrl(detailImage) ??
        imageUrl(designNumId),
    };
  });
}

function UploadPreview({
  file,
  onChange,
  onFileError,
  title,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  onFileError: (message: string) => void;
  title: string;
}) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <label className={`upload-box ${file ? "has-file" : ""}`}>
      {preview ? (
        <img className="upload-preview" src={preview} alt="Selected design" />
      ) : (
        <span className="upload-icon"><Icon name="upload" size={22} /></span>
      )}
      <span className="upload-copy">
        <strong>{file ? file.name : title}</strong>
        <small>{file ? "Click to replace image" : "JPG, PNG or WEBP · max 15 MB"}</small>
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          if (nextFile && nextFile.size > maxImageBytes) {
            onChange(null);
            onFileError("Choose an image smaller than 15 MB.");
          } else {
            onChange(nextFile);
            onFileError("");
          }
          event.target.value = "";
        }}
      />
    </label>
  );
}

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mode, setMode] = useState<SearchMode>("image");
  const [query, setQuery] = useState("");
  const [searchImage, setSearchImage] = useState<File | null>(null);
  const [results, setResults] = useState<SearchCard[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [imageZoomed, setImageZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [notice, setNotice] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdMessage, setCreatedMessage] = useState("");
  const [designId, setDesignId] = useState("");
  const [articleName, setArticleName] = useState("");
  const [designClass, setDesignClass] = useState("");
  const [filingDate, setFilingDate] = useState("");
  const [journalNum, setJournalNum] = useState("");
  const [journalDate, setJournalDate] = useState("");
  const [applicants, setApplicants] = useState<ApplicantDraft[]>([emptyApplicant()]);
  const [priorities, setPriorities] = useState<PriorityDraft[]>([]);
  const [createImages, setCreateImages] = useState<File[]>([]);

  const modeDescription = useMemo(() => {
    if (mode === "image") return "Find visually similar designs by uploading a reference image.";
    if (mode === "semantic") return "Describe the design in plain English to find related registrations.";
    return "Search registry records by design number, article name or keyword.";
  }, [mode]);

  async function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearching(true);
    setSearchError("");
    setResults([]);
    setHasSearched(true);
    try {
      let data: unknown;
      if (mode === "image") {
        if (!searchImage) throw new Error("Choose an image before searching.");
        const formData = new FormData();
        formData.append("image", searchImage);
        data = await apiRequest<SearchHit[]>("/search/image?limit=100", {
          method: "POST",
          body: formData,
        });
      } else if (mode === "semantic") {
        if (!query.trim()) throw new Error("Enter a description to search.");
        data = await apiRequest<SearchHit[]>("/search/text?limit=100", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
        });
      } else {
        if (!query.trim()) throw new Error("Enter a design number or keyword.");
        data = await apiRequest<{ items: Design[] }>(
          `/designs/search?q=${encodeURIComponent(query.trim())}&page=1&page_size=100`,
        );
      }
      setResults(getSearchCards(data));
    } catch (error) {
      setSearchError(errorMessage(error));
    } finally {
      setSearching(false);
    }
  }

  async function openDesign(designNumId: string, image?: string) {
    setSelectedDesign(null);
    setSelectedImage(image);
    setImageZoomed(false);
    setZoomLevel(1);
    setZoomPosition({ x: 50, y: 50 });
    setDetailError("");
    setDetailLoading(true);
    try {
      const design = await apiRequest<Design>(
        `/designs/${encodeURIComponent(designNumId)}`,
      );
      setSelectedDesign(design);
    } catch (error) {
      setDetailError(errorMessage(error));
    } finally {
      setDetailLoading(false);
    }
  }

  async function deactivateDesign() {
    if (!selectedDesign) return;
    const confirmed = window.confirm(
      `Disable design ${selectedDesign.design_num_id}? It will no longer be active in the registry.`,
    );
    if (!confirmed) return;
    setDetailError("");
    try {
      await apiRequest<void>(
        `/designs/${encodeURIComponent(selectedDesign.design_num_id)}`,
        { method: "DELETE" },
      );
      setNotice(`Design ${selectedDesign.design_num_id} was deactivated.`);
      setSelectedDesign({ ...selectedDesign, active: "false" });
    } catch (error) {
      setDetailError(errorMessage(error));
    }
  }

  function addCreateImage(file: File | null) {
    if (!file) return;
    if (file.size > maxImageBytes) {
      setCreateError("Each image must be smaller than 15 MB.");
      return;
    }
    if (createImages.length >= 7) {
      setCreateError("You can add up to seven design images.");
      return;
    }
    setCreateImages((current) => [...current, file]);
    setCreateError("");
  }

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError("");
    setCreatedMessage("");
    if (createImages.length < 1 || createImages.length > 7) {
      setCreateError("Add between one and seven design images.");
      return;
    }
    const validApplicants = applicants.filter(
      (applicant) => applicant.applicant_name.trim() && applicant.applicant_address.trim(),
    );
    if (!validApplicants.length) {
      setCreateError("Add at least one applicant with a name and address.");
      return;
    }
    setCreateLoading(true);
    let created: Design;
    try {
      const data = {
        design_num_id: designId.trim(),
        filing_date: filingDate ? new Date(`${filingDate}T00:00:00Z`).toISOString() : "",
        article_name: articleName.trim(),
        class: designClass.trim(),
        journal_num: journalNum.trim() || null,
        journal_date: journalDate
          ? new Date(`${journalDate}T00:00:00Z`).toISOString()
          : null,
        applicants: validApplicants.map((applicant) => ({
          applicant_name: applicant.applicant_name.trim(),
          applicant_address: applicant.applicant_address.trim(),
        })),
        priorities: priorities
          .filter(
            (priority) =>
              priority.application_number.trim() &&
              priority.country_name.trim() &&
              priority.date_of_filing_conversion_country,
          )
          .map((priority) => ({
            ...priority,
            application_number: priority.application_number.trim(),
            country_name: priority.country_name.trim(),
            date_of_filing_conversion_country: new Date(
              `${priority.date_of_filing_conversion_country}T00:00:00Z`,
            ).toISOString(),
          })),
      };
      const body = new FormData();
      body.append("data", JSON.stringify(data));
      createImages.forEach((file) => body.append("images", file));
      created = await apiRequest<Design>("/designs", {
        method: "POST",
        body,
      });
    } catch (error) {
      setCreateError(errorMessage(error));
      setCreateLoading(false);
      return;
    }

    const embeddingErrors: string[] = [];
    for (const file of createImages) {
      const embeddingForm = new FormData();
      embeddingForm.append("image", file);
      embeddingForm.append("name", `${created.design_num_id}_${file.name}`);
      embeddingForm.append(
        "metadata_json",
        JSON.stringify({
          design_num_id: created.design_num_id,
          article_name: created.article_name,
          class: created.class,
        }),
      );
      try {
        await apiRequest("/embeddings/dino", {
          method: "POST",
          body: embeddingForm,
        });
      } catch (error) {
        embeddingErrors.push(`DINO (${file.name}): ${errorMessage(error)}`);
      }
    }
    try {
      await apiRequest(`/embeddings/siglip/${encodeURIComponent(created.design_num_id)}`, {
        method: "POST",
      });
    } catch (error) {
      embeddingErrors.push(`SigLIP: ${errorMessage(error)}`);
    }
    setCreateLoading(false);
    if (embeddingErrors.length) {
      setCreateError(
        `Design ${created.design_num_id} was saved, but embedding generation was incomplete. ${embeddingErrors.join(" ")}`,
      );
      return;
    }
    setCreatedMessage(`Design ${created.design_num_id} was created and indexed successfully.`);
    setDesignId("");
    setArticleName("");
    setDesignClass("");
    setFilingDate("");
    setJournalNum("");
    setJournalDate("");
    setApplicants([emptyApplicant()]);
    setPriorities([]);
    setCreateImages([]);
  }

  const selectedPhoto =
    selectedDesign?.images?.[0]?.image_view ??
    selectedDesign?.images?.[0]?.image ??
    selectedDesign?.image;
  const modalImage = imageUrl(selectedPhoto) ?? selectedImage;

  return (
    <div className="site-shell">
      <div className="topline">
        <div className="container topline-inner">
          <span>India&apos;s design intelligence platform</span>
          <div className="topline-links">
            <a href="/contact-us">Contact us</a>
            <a href="/about">About us</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#" aria-label="Legal Thread home">
            <span className="brand-mark">LT</span>
            <span className="brand-copy"><strong>LEGAL THREAD</strong><small>DESIGN REGISTRY</small></span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-active" href="#registry">Registry</a>
            <a href="/how-it-works">How it works</a>
            <a href="/about">About us</a>
            <a href="/contact-us">Contact us</a>
          </nav>
          <div className="header-actions">
            <span className="secure-label"><Icon name="shield" size={16} /> Secure workspace</span>
            <button
              className={`role-button ${isAdmin ? "role-admin" : ""}`}
              onClick={() => {
                setIsAdmin((value) => !value);
                setNotice("");
              }}
              type="button"
            >
              {isAdmin ? "Admin workspace" : "Enterprise user"}
              <span className="role-dot" />
            </button>
          </div>
          <button className="mobile-menu" aria-label={mobileNavOpen ? "Close menu" : "Open menu"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)} type="button"><Icon name="menu" /></button>
        </div>
        <nav className={`mobile-nav ${mobileNavOpen ? "mobile-nav-open" : ""}`} aria-label="Mobile navigation">
          <a href="#registry" onClick={() => setMobileNavOpen(false)}>Registry</a>
          <a href="/how-it-works" onClick={() => setMobileNavOpen(false)}>How it works</a>
          <a href="/about" onClick={() => setMobileNavOpen(false)}>About us</a>
          <a href="/contact-us" onClick={() => setMobileNavOpen(false)}>Contact us</a>
          <button
            className={`role-button ${isAdmin ? "role-admin" : ""}`}
            onClick={() => { setIsAdmin((value) => !value); setMobileNavOpen(false); }}
            type="button"
          >
            {isAdmin ? "Admin workspace" : "Enterprise user"}<span className="role-dot" />
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> DESIGN INTELLIGENCE, REIMAGINED</div>
              <h1>Find the design<br /><em>behind the idea.</em></h1>
              <p>Search India&apos;s design registry with the precision your work deserves. Discover, compare and protect what&apos;s next.</p>
              <div className="hero-proof">
                <span><i className="proof-dot" /> Visual &amp; semantic search</span>
                <span><i className="proof-dot" /> Registry-ready records</span>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="art-card art-back"><span>FORM 01</span><div className="bottle bottle-back" /></div>
              <div className="art-card art-front"><span>DESIGN STUDY · 2024</span><div className="bottle"><i /></div><div className="art-caption">Form follows<br />feeling.</div></div>
              <div className="art-stamp">DESIGN<br />FOUND</div>
              <div className="art-index">01 — 03</div>
            </div>
            <div className="hero-bottom">
              <span>SEARCH WITH CONFIDENCE</span>
              <span>DESIGN REGISTRY <b>·</b> INDIA</span>
            </div>
          </div>
        </section>

        <section className="workspace-section" id="registry">
          <div className="container workspace">
            <aside className="workspace-intro">
              <div className="section-index">01 <span> / SEARCH</span></div>
              <h2>Your next<br />great find<br /><em>starts here.</em></h2>
              <p>Choose a search method and let the registry do the looking.</p>
              <div className="aside-note"><span className="note-line" /><span>MADE FOR<br />DESIGN PROFESSIONALS</span></div>
            </aside>

            <div className="search-panel">
              <div className="panel-heading">
                <div><span className="mini-kicker">DESIGN REGISTRY</span><h2>Search designs</h2></div>
                <span className="record-count"><i /> Live registry</span>
              </div>
              <div className="search-tabs" role="tablist" aria-label="Search type">
                {([
                  ["image", "Image search", "Visual match"],
                  ["semantic", "Describe it", "Semantic"],
                  ["text", "Free text", "Registry terms"],
                ] as const).map(([key, title, subtitle]) => (
                  <button
                    key={key}
                    className={`search-tab ${mode === key ? "selected" : ""}`}
                    role="tab"
                    aria-selected={mode === key}
                    onClick={() => { setMode(key); setSearchError(""); }}
                    type="button"
                  >
                    <span className="tab-icon"><Icon name={key === "image" ? "image" : key === "semantic" ? "spark" : "search"} size={18} /></span>
                    <span><strong>{title}</strong><small>{subtitle}</small></span>
                  </button>
                ))}
              </div>
              <form className="search-form" onSubmit={submitSearch}>
                <p className="form-description">{modeDescription}</p>
                {mode === "image" ? (
                  <UploadPreview file={searchImage} onChange={setSearchImage} onFileError={setSearchError} title="Drop a reference image or browse" />
                ) : (
                  <label className="field-label">
                    {mode === "semantic" ? "DESCRIBE YOUR DESIGN" : "DESIGN NUMBER OR KEYWORD"}
                    {mode === "semantic" ? (
                      <textarea
                        rows={3}
                        maxLength={512}
                        placeholder="E.g. a sculptural table lamp with a curved brass stem and opal glass shade"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    ) : (
                      <input
                        type="search"
                        placeholder="Try a design number, article or keyword"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    )}
                  </label>
                )}
                {searchError && <p className="error-message" role="alert">{searchError}</p>}
                <div className="search-submit-row">
                  <span className="form-hint">Results are matched against available registry records.</span>
                  <button className="button-primary" type="submit" disabled={searching}>
                    {searching ? "Searching…" : "Search registry"} <Icon name="arrow" size={17} />
                  </button>
                </div>
              </form>

              {notice && <div className="notice-message" role="status">{notice}</div>}

              {hasSearched && (
                <div className="results-section" aria-live="polite">
                  <div className="results-heading">
                    <div><span className="mini-kicker">YOUR DISCOVERIES</span><h3>{searching ? "Searching the registry…" : `${results.length} ${results.length === 1 ? "design" : "designs"} found`}</h3></div>
                    {results.length > 0 && <span className="results-sort">BEST MATCH</span>}
                  </div>
                  {!searching && results.length > 0 && (
                    <div className="result-grid">
                      {results.map((result, index) => (
                        <button
                          className="result-card"
                          key={`${result.designNumId}-${index}`}
                          onClick={() => openDesign(result.designNumId, result.imageUrl)}
                          type="button"
                        >
                          <span className="result-image-wrap">
                            <span className="result-image-placeholder"><Icon name="image" size={28} /></span>
                            {result.imageUrl && (
                              // API image URLs are served by the registry image host.
                              <img src={result.imageUrl} alt={result.articleName} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                            )}
                            <span className="result-open"><Icon name="arrow" size={16} /></span>
                            {typeof result.score === "number" && <span className="match-pill">{Math.round(result.score)}% match</span>}
                          </span>
                          <span className="result-meta"><small>DESIGN NO. {result.designNumId}</small><strong>{result.articleName}</strong><span>{result.designClass}</span></span>
                        </button>
                      ))}
                    </div>
                  )}
                  {!searching && !searchError && results.length === 0 && (
                    <div className="empty-results"><span className="empty-mark">—</span><strong>No matching designs found</strong><span>Try a different image or refine your search terms.</span></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="admin-section" id="admin">
            <div className="container admin-layout">
              <div className="admin-intro">
                <div className="section-index">02 <span> / ADMIN</span></div>
                <h2>Build the<br /><em>registry.</em></h2>
                <p>Add a new design record and index its images for discovery.</p>
                <div className="admin-tag"><Icon name="shield" size={16} /> ADMIN WORKSPACE</div>
              </div>
              <form className="create-panel" onSubmit={submitCreate}>
                <div className="panel-heading">
                  <div><span className="mini-kicker">NEW RECORD</span><h2>Create a design</h2></div>
                  <span className="required-note">* REQUIRED</span>
                </div>
                <div className="form-grid">
                  <label className="field-label">DESIGN NUMBER *<input required value={designId} onChange={(event) => setDesignId(event.target.value)} placeholder="e.g. 412345-001" /></label>
                  <label className="field-label">ARTICLE NAME *<input required value={articleName} onChange={(event) => setArticleName(event.target.value)} placeholder="e.g. Table lamp" /></label>
                  <label className="field-label">CLASS *<input required value={designClass} onChange={(event) => setDesignClass(event.target.value)} placeholder="e.g. 26-05" /></label>
                  <label className="field-label">FILING DATE *<input required type="date" value={filingDate} onChange={(event) => setFilingDate(event.target.value)} /></label>
                  <label className="field-label">JOURNAL NUMBER<input value={journalNum} onChange={(event) => setJournalNum(event.target.value)} placeholder="Optional" /></label>
                  <label className="field-label">JOURNAL DATE<input type="date" value={journalDate} onChange={(event) => setJournalDate(event.target.value)} /></label>
                </div>
                <div className="repeat-section">
                  <div className="repeat-heading"><strong>Applicants *</strong><button className="text-button" type="button" onClick={() => setApplicants((current) => [...current, emptyApplicant()])}><Icon name="plus" size={15} /> Add applicant</button></div>
                  {applicants.map((applicant, index) => (
                    <div className="repeat-row" key={`applicant-${index}`}>
                      <input aria-label={`Applicant ${index + 1} name`} required value={applicant.applicant_name} onChange={(event) => setApplicants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, applicant_name: event.target.value } : item))} placeholder="Applicant name" />
                      <input aria-label={`Applicant ${index + 1} address`} required value={applicant.applicant_address} onChange={(event) => setApplicants((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, applicant_address: event.target.value } : item))} placeholder="Applicant address" />
                      {applicants.length > 1 && <button className="remove-button" type="button" aria-label="Remove applicant" onClick={() => setApplicants((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Icon name="close" size={16} /></button>}
                    </div>
                  ))}
                </div>
                <div className="repeat-section">
                  <div className="repeat-heading"><strong>Priority details</strong><button className="text-button" type="button" onClick={() => setPriorities((current) => [...current, emptyPriority()])}><Icon name="plus" size={15} /> Add priority</button></div>
                  {priorities.map((priority, index) => (
                    <div className="repeat-row priority-row" key={`priority-${index}`}>
                      <input aria-label="Priority application number" value={priority.application_number} onChange={(event) => setPriorities((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, application_number: event.target.value } : item))} placeholder="Application number" />
                      <input aria-label="Priority country" value={priority.country_name} onChange={(event) => setPriorities((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, country_name: event.target.value } : item))} placeholder="Country" />
                      <input aria-label="Priority filing date" type="date" value={priority.date_of_filing_conversion_country} onChange={(event) => setPriorities((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, date_of_filing_conversion_country: event.target.value } : item))} />
                      <button className="remove-button" type="button" aria-label="Remove priority" onClick={() => setPriorities((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Icon name="close" size={16} /></button>
                    </div>
                  ))}
                </div>
                <div className="repeat-section">
                  <div className="repeat-heading"><strong>Design images *</strong><span className="form-hint">{createImages.length}/7 added · add JPG, PNG or WEBP</span></div>
                  <div className="image-upload-row">
                    <label className="image-add-button"><Icon name="plus" size={17} /><span>Add image</span><input type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => { addCreateImage(event.target.files?.[0] ?? null); event.target.value = ""; }} /></label>
                    {createImages.map((file, index) => (
                      <span className="image-file-chip" key={`${file.name}-${index}`}><Icon name="image" size={15} /><span>{file.name}</span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => setCreateImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Icon name="close" size={14} /></button></span>
                    ))}
                  </div>
                </div>
                {createError && <p className="error-message" role="alert">{createError}</p>}
                {createdMessage && <p className="success-message" role="status">{createdMessage}</p>}
                <div className="create-footer">
                  <span className="form-hint">Design images are indexed after the record is saved.</span>
                  <button className="button-primary" type="submit" disabled={createLoading}>{createLoading ? "Creating & indexing…" : "Create design"} <Icon name="arrow" size={17} /></button>
                </div>
              </form>
            </div>
          </section>
        )}

        <section className="process-section" id="how-it-works">
          <div className="container process-inner">
            <div><span className="mini-kicker">A CLEARER WAY TO DISCOVER</span><h2>From first thought<br /><em>to found.</em></h2></div>
            <div className="process-steps">
              <div className="process-step"><span>01</span><strong>Search your way</strong><p>Upload an image, describe your idea, or search by registry terms.</p></div>
              <div className="process-step"><span>02</span><strong>Explore matches</strong><p>See relevant designs with clear visual previews and match scores.</p></div>
              <div className="process-step"><span>03</span><strong>Know the details</strong><p>Open any record for applicants, filing information and priorities.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <a className="brand footer-brand" href="#" aria-label="Legal Thread home"><span className="brand-mark">LT</span><span className="brand-copy"><strong>LEGAL THREAD</strong><small>DESIGN REGISTRY</small></span></a>
          <p>Giving every good idea<br />the clarity it deserves.</p>
          <div className="footer-links"><a href="/contact-us">Contact us</a><a href="/about">About us</a><a href="#registry">Design registry</a></div>
          <div className="footer-location">BUILT FOR INDIA<br /><span>DESIGN · INTELLIGENCE · PROTECTION</span></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Legal Thread Technologies Ltd. All rights reserved.</span><span>Thoughtful design deserves thoughtful protection.</span></div>
      </footer>

      {(detailLoading || selectedDesign || detailError) && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedDesign(null); setDetailError(""); } }}>
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedDesign ? `Design record details for ${selectedDesign.article_name || selectedDesign.design_num_id}` : "Design record details"}
          >
            <button className="modal-close" type="button" aria-label="Close design details" onClick={() => { setSelectedDesign(null); setDetailError(""); }}><Icon name="close" size={20} /></button>
            {detailLoading ? <div className="modal-loading"><span className="loading-spinner" /><strong>Loading design details…</strong></div> : detailError && !selectedDesign ? <div className="modal-error"><h2>Could not load design</h2><p>{detailError}</p><button className="button-secondary" type="button" onClick={() => { setSelectedDesign(null); setDetailError(""); }}>Close</button></div> : selectedDesign && (
              <>
                <div className="detail-topline"><span className="mini-kicker">DESIGN REGISTRY · RECORD DETAIL</span><span className={`status-pill ${designIsActive(selectedDesign.active) ? "" : "status-inactive"}`}><i />{designIsActive(selectedDesign.active) ? "Active record" : "Inactive"}</span></div>
                <div className="detail-layout">
                  <div
                    className="detail-photo"
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse" && modalImage) setImageZoomed(true);
                    }}
                    onPointerLeave={() => setImageZoomed(false)}
                  >
                    {modalImage ? (
                      <img
                        src={modalImage}
                        alt={selectedDesign.article_name || "Registered design"}
                        onPointerMove={(event) => {
                          if (event.pointerType !== "mouse") return;
                          const bounds = event.currentTarget.getBoundingClientRect();
                          setZoomPosition({
                            x: Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)),
                            y: Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100)),
                          });
                        }}
                      />
                    ) : <div className="result-image-placeholder"><Icon name="image" size={34} /></div>}
                    <div className="detail-photo-footer">
                      <span>DESIGN NO. {selectedDesign.design_num_id}</span>
                      {modalImage && (
                        <label className="zoom-control">
                          <span>{zoomLevel.toFixed(1)}×</span>
                          <input
                            type="range"
                            aria-label="Image zoom level"
                            min="1"
                            max="5"
                            step="0.1"
                            value={zoomLevel}
                            onChange={(event) => setZoomLevel(Number(event.target.value))}
                            onFocus={() => setImageZoomed(true)}
                            onBlur={() => setImageZoomed(false)}
                          />
                        </label>
                      )}
                    </div>
                    {modalImage && <small className="zoom-hint">HOVER TO PREVIEW</small>}
                  </div>
                  <div className="detail-content">
                    <div className={`detail-information ${imageZoomed && modalImage ? "detail-information-hidden" : ""}`} aria-hidden={imageZoomed && Boolean(modalImage)}>
                      <>
                        <h2>{selectedDesign.article_name || "Registered design"}</h2>
                        <p className="detail-class">Class {selectedDesign.class || "—"} <span>·</span> Design no. {selectedDesign.design_num_id}</p>
                        <div className="detail-fields">
                          <div><span>Filing date</span><strong>{formatDate(selectedDesign.filing_date)}</strong></div>
                          <div><span>Journal number</span><strong>{selectedDesign.journal_num || "—"}</strong></div>
                          <div><span>Journal date</span><strong>{formatDate(selectedDesign.journal_date)}</strong></div>
                        </div>
                        <div className="detail-table-section">
                          <h3>Applicant details</h3>
                          <div className="detail-table-wrap"><table><thead><tr><th>Applicant name</th><th>Applicant address</th></tr></thead><tbody>
                            {(selectedDesign.applicants ?? []).length ? selectedDesign.applicants!.map((applicant, index) => <tr key={`detail-applicant-${index}`}><td>{applicant.applicant_name}</td><td>{applicant.applicant_address}</td></tr>) : <tr><td colSpan={2}>No applicant details available.</td></tr>}
                          </tbody></table></div>
                        </div>
                        <div className="detail-table-section">
                          <h3>Priorities</h3>
                          <div className="detail-table-wrap"><table><thead><tr><th>Application number</th><th>Country</th><th>Filing date</th></tr></thead><tbody>
                            {(selectedDesign.priorities ?? []).length ? selectedDesign.priorities!.map((priority, index) => <tr key={`detail-priority-${index}`}><td>{priority.application_number}</td><td>{priority.country_name}</td><td>{formatDate(priority.date_of_filing_conversion_country)}</td></tr>) : <tr><td colSpan={3}>No priority details available.</td></tr>}
                          </tbody></table></div>
                        </div>
                        {detailError && <p className="error-message" role="alert">{detailError}</p>}
                        <div className="modal-actions">{isAdmin && designIsActive(selectedDesign.active) && <button className="button-danger" type="button" onClick={deactivateDesign}>Disable design</button>}<button className="button-secondary" type="button" onClick={() => { setSelectedDesign(null); setDetailError(""); }}>Close details</button></div>
                      </>
                    </div>
                    {imageZoomed && modalImage && (
                      <div
                        className="detail-zoom"
                        role="img"
                        aria-label={`${zoomLevel.toFixed(1)} times magnified view of ${selectedDesign.article_name || "registered design"}`}
                        style={{
                          backgroundImage: `url(${JSON.stringify(modalImage)})`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
                        }}
                      >
                        <span>{zoomLevel.toFixed(1)}× MAGNIFIED VIEW · MOVE POINTER TO PAN</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
