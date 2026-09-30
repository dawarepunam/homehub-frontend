"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ChevronRight, Clock, Tag, BookOpen } from "lucide-react";
import { getGuideArticles } from "@/services/propertyGuides";

const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api")
  .replace(/\/api\/?$/, "");

function resolveImage(img) {
  if (!img) return null;
  
  let url = null;
  if (typeof img === 'string') {
    url = img;
  } else if (Array.isArray(img)) {
    url = img[0]?.url || img[0]?.formats?.large?.url || img[0]?.formats?.medium?.url;
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
    day: "numeric", month: "long", year: "numeric"
  });
}

const CATEGORY_COLORS = {
  Buying: "#D7AE62",
  Renting: "#0D3326",
  Selling: "#c0552b",
  Investing: "#3b6e8c",
  Legal: "#6b4c9a",
  Finance: "#2e7d32",
  "Home Improvement": "#e57c22",
  "Market Trends": "#ad1457",
};

function CategoryBadge({ category }) {
  if (!category) return null;
  const color = CATEGORY_COLORS[category] || "#0D3326";
  return (
    <span style={{ background: color + "1a", color, border: `1px solid ${color}44` }}
      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

function GuideCard({ article }) {
  const imgUrl = resolveImage(article.CoverImage);
  const slug = article.Slug || article.documentId || article.id;

  return (
    <Link href={`/property-guides/${slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[rgba(13,51,38,0.08)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 bg-[#e8e3da] overflow-hidden shrink-0">
        {imgUrl ? (
          <Image src={imgUrl} alt={""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={true} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-[#D7AE62] opacity-40" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        {article.Category && (
          <div className="mb-3">
            <CategoryBadge category={article.Category} />
          </div>
        )}
        <h3 className="font-extrabold text-[#0D3326] text-xl leading-snug mb-3 group-hover:text-[#D7AE62] transition-colors">
          {article.Title}
        </h3>
        {article.Excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-6">
            {article.Excerpt}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-medium text-gray-400 mb-4">
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            {article.ReadingTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.ReadingTime} min read</span>}
          </div>
          <div className="flex items-center text-[#D7AE62] font-bold text-sm">
            Read More <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ article }) {
  const imgUrl = resolveImage(article.CoverImage);
  const slug = article.Slug || article.documentId || article.id;

  return (
    <div className="mb-16">
      <div className="mb-6 flex items-center gap-2">
         <span className="inline-block text-[#D7AE62] text-xs font-extrabold tracking-widest uppercase">
           ✦ Featured Guide
         </span>
      </div>
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg flex flex-col md:flex-row">
        
        {/* Left Side: Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[350px] bg-gray-100">
          {imgUrl ? (
            <Image src={imgUrl} alt={""} fill className="object-cover" unoptimized={true} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>
        
        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-4">
             <CategoryBadge category={article.Category} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D3326] leading-tight mb-4 break-words">
            {article.Title}
          </h2>
          {article.Excerpt && (
            <p className="text-gray-500 text-base mb-8 line-clamp-3 leading-relaxed">
              {article.Excerpt}
            </p>
          )}
          <div className="flex items-center gap-6 text-gray-400 text-sm mb-8 font-medium">
            {article.Author && <span>{article.Author}</span>}
            {article.ReadingTime && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.ReadingTime} min read</span>}
          </div>
          <Link href={`/property-guides/${slug}`}
            className="self-start inline-flex items-center gap-2 bg-[#0D3326] text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#D7AE62] hover:text-[#0D3326] transition-colors">
            Read Guide <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PropertyGuidesClient({ featured, categories, initialArticles, initialMeta }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [articles, setArticles] = useState(initialArticles);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (!search && !activeCategory) return articles;
    return articles.filter(a => {
      const matchCat = !activeCategory || a.Category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !search ||
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
      const result = await getGuideArticles({ category: activeCategory, search, pageSize: 12 });
      setArticles(result.data);
      setMeta(result.meta);
    } catch {
      setError("Unable to load guides. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1">
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #0D3326 0%, #1a5040 100%)" }}
        className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #D7AE62 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block text-[#D7AE62] text-xs font-extrabold tracking-[0.3em] uppercase mb-4">
            Knowledge Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
            Property Guides
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore helpful insights and practical advice for buying, selling, renting, and investing in property.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search property guides..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-full bg-white text-gray-800 text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-[#D7AE62]/30 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* FEATURED */}
        {featured && !activeCategory && !search && <FeaturedCard article={featured} />}

        {/* CATEGORIES */}
        {categories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#0D3326] mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 ${!activeCategory ? "bg-[#0D3326] text-white border-[#0D3326]" : "bg-white text-[#0D3326] border-[#0D3326]/20 hover:border-[#0D3326]"}`}>
                All Guides
              </button>
              {categories.map(cat => {
                const color = CATEGORY_COLORS[cat] || "#0D3326";
                const isActive = activeCategory === cat;
                return (
                  <button key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    style={isActive ? { background: color, borderColor: color, color: "white" } : { borderColor: color + "44", color }}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 bg-white hover:opacity-80`}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={handleRetry}
              className="bg-[#0D3326] text-white px-6 py-2 rounded-full font-bold hover:bg-[#0a271d] transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* GUIDES GRID */}
        {!error && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-[#0D3326]">
                {activeCategory ? `${activeCategory} Guides` : "Latest Property Guides"}
              </h2>
              {filtered.length > 0 && (
                <span className="text-sm text-gray-400">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No guides found.</h3>
                <p className="text-gray-400">
                  {search || activeCategory ? "Try another search or category." : "New guides will appear here once they are published."}
                </p>
                {(search || activeCategory) && (
                  <button onClick={() => { setSearch(""); setActiveCategory(""); }}
                    className="mt-6 bg-[#0D3326] text-white px-6 py-2 rounded-full font-bold hover:bg-[#0a271d] transition-colors text-sm">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(article => (
                  <GuideCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
