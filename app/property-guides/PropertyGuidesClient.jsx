"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ChevronRight, Clock, Tag, BookOpen } from "lucide-react";
import { getGuideArticles } from "@/services/propertyGuides";
import { motion, AnimatePresence } from "framer-motion";

const STRAPI_BASE = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api"
).replace(/\/api\/?$/, "");

function resolveImage(img) {
  if (!img) return null;

  let url = null;
  if (typeof img === "string") {
    url = img;
  } else if (Array.isArray(img)) {
    url =
      img[0]?.url ||
      img[0]?.formats?.large?.url ||
      img[0]?.formats?.medium?.url;
  } else if (img.url) {
    url = img.url;
  } else if (img.data) {
    if (Array.isArray(img.data)) {
      url = img.data[0]?.attributes?.url || img.data[0]?.url;
    } else {
      url = img.data.attributes?.url || img.data.url;
    }
  } else if (img.attributes?.url) {
    url = img.attributes.url;
  }

  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_BASE}${url}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CategoryBadge({ category, outline = false }) {
  if (!category) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${outline ? "bg-transparent border border-[var(--text-primary)] text-[var(--text-primary)]" : "bg-[var(--text-primary)] text-[var(--bg-page)]"}`}
    >
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

function GuideCard({ article, variants }) {
  const imgUrl = resolveImage(article.CoverImage);
  const slug = article.Slug || article.documentId || article.id;

  return (
    <motion.div variants={variants}>
      <Link
        href={`/property-guides/${slug}`}
        className="group relative flex flex-col h-full bg-[var(--bg-card)] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all duration-300"
      >
        <div className="relative h-56 bg-[var(--bg-page)] overflow-hidden shrink-0">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={""}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              unoptimized={true}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        </div>
        <div className="flex flex-col flex-1 p-6 md:p-8">
          {article.Category && (
            <div className="mb-4">
              <CategoryBadge category={article.Category} outline />
            </div>
          )}
          <h3 className="font-extrabold text-[var(--text-primary)] text-xl leading-snug mb-3 group-hover:opacity-80 transition-opacity">
            {article.Title}
          </h3>
          {article.Excerpt && (
            <p className="text-[14px] text-[var(--text-muted)] leading-relaxed flex-1 line-clamp-3 mb-6">
              {article.Excerpt}
            </p>
          )}
          <div className="mt-auto pt-5 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] mb-4 uppercase tracking-wider">
              <span>
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              {article.ReadingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {article.ReadingTime} MIN
                </span>
              )}
            </div>
            <div className="flex items-center text-[var(--text-primary)] font-bold text-sm">
              Read Guide{" "}
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedCard({ article }) {
  const imgUrl = resolveImage(article.CoverImage);
  const slug = article.Slug || article.documentId || article.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-20"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="h-[1px] w-8 bg-[var(--text-primary)]" />
        <span className="inline-block text-[var(--text-primary)] text-xs font-extrabold tracking-[0.2em] uppercase">
          Featured Editorial
        </span>
      </div>
      <div className="bg-[var(--bg-card)] rounded-[24px] overflow-hidden border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col lg:flex-row group transition-all duration-500 hover:shadow-2xl">
        {/* Left Side: Image */}
        <div className="relative w-full lg:w-[55%] h-72 md:h-96 lg:h-auto min-h-[400px] bg-[var(--bg-page)] overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={""}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              unoptimized={true}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-[var(--text-muted)] opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-[45%] p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-6">
            <CategoryBadge category={article.Category} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight">
            {article.Title}
          </h2>
          {article.Excerpt && (
            <p className="text-[var(--text-muted)] text-base md:text-lg mb-8 line-clamp-4 leading-relaxed font-medium">
              {article.Excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-[var(--text-muted)] text-sm mb-10 font-bold uppercase tracking-widest">
            {article.Author && <span>By {article.Author}</span>}
            {article.ReadingTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.ReadingTime} MIN READ
              </span>
            )}
          </div>
          <Link
            href={`/property-guides/${slug}`}
            className="self-start inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-page)] font-bold text-sm px-8 py-4 rounded-full hover:opacity-80 transition-opacity uppercase tracking-widest"
          >
            Read Editorial <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function PropertyGuidesClient({
  featured,
  categories,
  initialArticles,
  initialMeta,
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [articles, setArticles] = useState(initialArticles);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (!search && !activeCategory) return articles;
    return articles.filter((a) => {
      const matchCat = !activeCategory || a.Category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (a.Title || "").toLowerCase().includes(q) ||
        (a.Excerpt || "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [articles, search, activeCategory]);

  const handleCategoryChange = async (cat) => {
    const next = cat === activeCategory ? "" : cat;
    setActiveCategory(next);
    setSearch("");
    setIsLoading(true);
    setError("");
    try {
      const result = await getGuideArticles({ category: next, pageSize: 12 });
      setArticles(result.data);
      setMeta(result.meta);
    } catch {
      setError("Unable to load guides. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getGuideArticles({
        category: activeCategory,
        search,
        pageSize: 12,
      });
      setArticles(result.data);
      setMeta(result.meta);
    } catch {
      setError("Unable to load guides. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="flex-1 bg-[var(--bg-page)]">
      {/* HERO */}
      <div className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 text-center relative border-b border-[var(--border-subtle)] bg-[var(--bg-section)]">
        <div className="relative max-w-[900px] mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[var(--text-primary)] text-[11px] font-extrabold tracking-[0.3em] uppercase mb-6">
              Insights & Expertise
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tighter leading-[1.05]">
              Property Guides
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Curated editorial perspectives for navigating the modern real
              estate landscape.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input
              type="text"
              placeholder="Search editorial content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-14 py-5 md:py-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-lg focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)]/70 shadow-sm font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 bg-[var(--bg-page)] rounded-full border border-[var(--border-subtle)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        {/* FEATURED */}
        {featured && !activeCategory && !search && (
          <FeaturedCard article={featured} />
        )}

        {/* CATEGORIES */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 border ${!activeCategory ? "bg-[var(--text-primary)] text-[var(--bg-page)] border-[var(--text-primary)]" : "bg-transparent text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"}`}
              >
                All Journals
              </button>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 border ${isActive ? "bg-[var(--text-primary)] text-[var(--bg-page)] border-[var(--text-primary)]" : "bg-transparent text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-20 bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)]">
            <p className="text-[var(--text-primary)] mb-6 font-medium text-lg">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="bg-[var(--text-primary)] text-[var(--bg-page)] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* GUIDES GRID */}
        {!error && (
          <>
            <div className="flex items-center justify-between mb-10 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {activeCategory
                  ? `${activeCategory} Editorials`
                  : "Latest Editorials"}
              </h2>
              {filtered.length > 0 && (
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "Article" : "Articles"}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[var(--bg-card)] rounded-[var(--radius-card)] overflow-hidden border border-[var(--border-subtle)] animate-pulse h-full flex flex-col"
                  >
                    <div className="h-56 bg-[var(--border-subtle)] shrink-0" />
                    <div className="p-8 space-y-4 flex-1">
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-1/4" />
                      <div className="h-8 bg-[var(--border-subtle)] rounded w-full mt-4" />
                      <div className="h-8 bg-[var(--border-subtle)] rounded w-3/4" />
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-full mt-6" />
                      <div className="h-4 bg-[var(--border-subtle)] rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)]"
              >
                <BookOpen className="w-12 h-12 text-[var(--border-subtle)] mx-auto mb-6" />
                <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
                  No editorials found
                </h3>
                <p className="text-[var(--text-muted)] font-medium text-lg">
                  {search || activeCategory
                    ? "Refine your search or try a different category."
                    : "New content is being prepared."}
                </p>
                {(search || activeCategory) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("");
                    }}
                    className="mt-8 bg-transparent text-[var(--text-primary)] border border-[var(--text-primary)] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-page)] transition-colors text-xs"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((article) => (
                  <GuideCard
                    key={article.id}
                    article={article}
                    variants={cardVariants}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
