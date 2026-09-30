import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import { getHomePage } from "@/services/homePage";
import { getGuideArticleBySlug, getRelatedGuides } from "@/services/propertyGuides";
import { ChevronLeft, Clock, Tag, User } from "lucide-react";

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

// ── Strapi Blocks renderer ─────────────────────────────────────────────────
function renderNode(node, key) {
  if (!node) return null;
  const children = node.children?.map((c, i) => renderNode(c, i)) || [];

  switch (node.type) {
    case "text": {
      let el = node.text;
      if (node.bold) el = <strong key={key} className="font-bold">{el}</strong>;
      if (node.italic) el = <em key={key} className="italic">{el}</em>;
      if (node.underline) el = <u key={key}>{el}</u>;
      if (node.strikethrough) el = <s key={key}>{el}</s>;
      if (node.code) el = <code key={key} className="bg-gray-100 text-[#0D3326] px-1.5 py-0.5 rounded text-[0.9em] font-mono break-words">{el}</code>;
      return el;
    }
    case "paragraph":
      return <p key={key} className="mb-6 text-gray-700 leading-[1.8] text-[17px] md:text-[18px] break-words">{children}</p>;
    case "heading":
      const Tag = `h${node.level || 2}`;
      const sizes = { 1: "text-3xl md:text-4xl", 2: "text-2xl md:text-3xl", 3: "text-xl md:text-2xl", 4: "text-lg md:text-xl", 5: "text-base md:text-lg", 6: "text-sm md:text-base" };
      return <Tag key={key} className={`${sizes[node.level] || "text-2xl"} font-extrabold text-[#0D3326] mt-10 mb-4 break-words`}>{children}</Tag>;
    case "list":
      return node.format === "ordered"
        ? <ol key={key} className="list-decimal list-outside ml-6 mb-6 space-y-3 text-gray-700 text-[17px] md:text-[18px] leading-[1.8] break-words">{children}</ol>
        : <ul key={key} className="list-disc list-outside ml-6 mb-6 space-y-3 text-gray-700 text-[17px] md:text-[18px] leading-[1.8] break-words">{children}</ul>;
    case "list-item":
      return <li key={key} className="pl-2">{children}</li>;
    case "link":
      return <a key={key} href={node.url} className="text-[#D7AE62] font-semibold underline hover:text-[#0D3326] transition-colors break-words" target="_blank" rel="noopener noreferrer">{children}</a>;
    case "image":
      const imgSrc = node.image?.url;
      if (!imgSrc) return null;
      return (
        <figure key={key} className="my-10 relative">
          <img src={imgSrc} alt={node.image?.alternativeText || ""} className="w-full rounded-2xl object-cover shadow-sm bg-gray-50" />
          {node.image?.caption && <figcaption className="text-center text-sm text-gray-400 mt-3">{node.image.caption}</figcaption>}
        </figure>
      );
    case "quote":
      return (
        <blockquote key={key} className="border-l-4 border-[#D7AE62] bg-[#F6F0E5] pl-6 pr-4 py-5 my-8 rounded-r-2xl italic text-gray-800 text-lg md:text-xl font-medium break-words">
          {children}
        </blockquote>
      );
    case "code":
      return <pre key={key} className="bg-[#0D3326] text-[#D7AE62] p-5 rounded-2xl overflow-x-auto my-8 text-sm md:text-[15px] leading-relaxed shadow-inner font-mono"><code>{children}</code></pre>;
    default:
      return <div key={key} className="break-words">{children}</div>;
  }
}

function ContentRenderer({ content }) {
  if (!content || !Array.isArray(content)) {
    return <p className="text-gray-400 italic">No content available for this guide.</p>;
  }
  return <>{content.map((node, i) => renderNode(node, i))}</>;
}

function RelatedCard({ article }) {
  const imgUrl = resolveImage(article.CoverImage);
  const slug = article.Slug || article.documentId || article.id;
  return (
    <Link href={`/property-guides/${slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[rgba(13,51,38,0.08)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-36 bg-gray-100 shrink-0">
        {imgUrl
          ? <Image src={imgUrl} alt={""} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized={true} />
          : <div className="absolute inset-0 bg-[#0D3326]/10 flex items-center justify-center">
              <Tag className="w-8 h-8 text-[#D7AE62]/40" />
            </div>
        }
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {article.Category && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D7AE62] mb-1">{article.Category}</span>
        )}
        <h4 className="font-bold text-[#0D3326] text-sm leading-snug group-hover:text-[#D7AE62] transition-colors line-clamp-2">
          {article.Title}
        </h4>
      </div>
    </Link>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getGuideArticleBySlug(slug);
  return {
    title: article ? `${article.Title} | Property Guides | HomeHub` : "Property Guide | HomeHub",
    description: article?.Excerpt || "Read this property guide on HomeHub.",
  };
}

export default async function PropertyGuideDetailPage({ params }) {
  const { slug } = await params;

  const [homePage, article] = await Promise.all([
    getHomePage(),
    getGuideArticleBySlug(slug),
  ]);

  if (!article) return notFound();

  const imgUrl = resolveImage(article.CoverImage);
  const related = await getRelatedGuides(article.Category, article.Slug);

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#F6F0E5" }}>
      <HomeHeader header={homePage?.Header} />

      {/* ARTICLE HERO */}
      <div style={{ background: "linear-gradient(135deg, #0D3326 0%, #1a5040 100%)" }}
        className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #D7AE62 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
        <div className="relative max-w-4xl mx-auto">
          <Link href="/property-guides"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Property Guides
          </Link>
          {article.Category && (
            <div className="mb-4">
              <span className="inline-block bg-[#D7AE62]/20 text-[#D7AE62] text-xs font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#D7AE62]/30">
                {article.Category}
              </span>
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {article.Title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/60 text-sm">
            {article.Author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {article.Author}
              </span>
            )}
            {article.ReadingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {article.ReadingTime} min read
              </span>
            )}
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE */}
      {imgUrl && (
        <div className="max-w-4xl mx-auto w-full px-4 -mt-12 mb-0 relative z-10">
          <div className="relative h-[340px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
            <Image src={imgUrl} alt={""} fill className="object-cover" unoptimized={true} />
          </div>
        </div>
      )}

      {/* ARTICLE BODY */}
      <div className="max-w-4xl mx-auto w-full px-4 py-14">
        <div className="bg-white rounded-3xl shadow-sm border border-[rgba(13,51,38,0.07)] p-8 md:p-14">
          {article.Excerpt && (
            <p className="text-xl text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-medium">
              {article.Excerpt}
            </p>
          )}
          <div className="prose prose-lg max-w-none">
            <ContentRenderer content={article.Content} />
          </div>
        </div>

        {/* RELATED GUIDES */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-[#0D3326] mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(r => <RelatedCard key={r.id} article={r} />)}
            </div>
          </div>
        )}
      </div>

      <Footer data={homePage?.Footer} />
    </main>
  );
}
 // touched
