const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/daware.R.D/Desktop/housing-management-system/frontend/app/new-projects';
const pages = [
  { file: 'new-launches/page.jsx', title: 'New Launches', titleHtml: 'Discover New Launch <br className="hidden md:block" /> <span>Projects</span>', subtitle: 'Explore newly launched residential and commercial projects crafted for modern lifestyles.' },
  { file: 'ready-to-move/page.jsx', title: 'Ready to Move', titleHtml: 'Discover Ready to Move <br className="hidden md:block" /> <span>Properties</span>', subtitle: 'Find completed projects that are ready for immediate possession.' },
  { file: 'under-construction/page.jsx', title: 'Under Construction', titleHtml: 'Explore Under Construction <br className="hidden md:block" /> <span>Projects</span>', subtitle: 'Discover premium properties currently under development.' },
  { file: 'upcoming/page.jsx', title: 'Upcoming Projects', titleHtml: 'Explore Upcoming <br className="hidden md:block" /> <span>Projects</span>', subtitle: 'Get early access to future residential and commercial developments.' },
];

pages.forEach(p => {
  const filePath = path.join(dir, p.file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Need to ensure framer-motion and Sparkles are imported
  if (!content.includes('framer-motion')) {
    content = content.replace('import {', 'import { motion, AnimatePresence } from "framer-motion";\nimport {');
  }
  if (!content.includes('Sparkles')) {
    content = content.replace('X,', 'X, Sparkles,');
  }

  // Find the start of the return statement
  let returnIndex = content.indexOf('  return (\n    <>');
  if (returnIndex === -1) {
      returnIndex = content.indexOf('  return (\n');
  }

  const beforeReturn = content.substring(0, returnIndex);

  const newReturn = `  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {homeData && <HomeHeader header={homeData.Header} />}

      {/* HERO SECTION */}
      <section className="relative min-h-[360px] flex items-center justify-center bg-[var(--bg-section)] overflow-hidden border-b border-[var(--border-subtle)]">
        {heroBg && (
          <Image src={heroBg} alt="${p.title}" fill className="object-cover opacity-20 mix-blend-luminosity" unoptimized priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-section)] via-transparent to-transparent" />
        <div className="relative z-10 text-center px-6 py-20 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> ${p.title}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-[1.1] text-[var(--text-primary)]">
              ${p.titleHtml.replace('<span>', '<span className="text-[var(--text-muted)]">')}
            </h1>
            <p className="text-[var(--text-muted)] text-lg font-medium max-w-xl mx-auto">
              ${p.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      {!loading && !error && allProjects.length > 0 && (
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)] py-4 px-6 relative z-20 shadow-sm">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center md:justify-center items-center gap-8 md:gap-16">
            {[
              { num: stats?.total || filteredProjects?.length || 0, label: "Projects" },
              { num: stats?.locations || availableLocations?.length || 0, label: "Locations" },
              { num: stats?.residential || 0, label: "Residential" },
              { num: stats?.commercial || 0, label: "Commercial" },
            ].map((stat, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="text-center">
                <div className="text-xl font-extrabold text-[var(--text-primary)]">{stat.num}</div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-12">
        
        {/* FILTER BAR */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--bg-card)] rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] mb-12 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="relative z-20">
              <label className="block text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Project name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-page)] text-[var(--text-primary)] text-sm border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--text-primary)] font-medium transition-colors placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            <div className="relative z-10">
              <label className="block text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none bg-[var(--bg-page)] text-[var(--text-primary)] text-sm border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--text-primary)] font-medium transition-colors cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {(availableLocations || []).map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest mb-2">Property Type</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none bg-[var(--bg-page)] text-[var(--text-primary)] text-sm border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--text-primary)] font-medium transition-colors cursor-pointer"
                >
                  <option value="">All Types</option>
                  {(availableTypes || []).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest mb-2">Project Status</label>
              <div className="relative">
                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className="w-full appearance-none bg-[var(--bg-page)] text-[var(--text-primary)] text-sm border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--text-primary)] font-medium transition-colors cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {(availableStatuses || []).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

          </div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-end mt-4">
                <button onClick={typeof clearFilters === 'function' ? clearFilters : () => {setSearchQuery(""); setLocation(""); setPropertyType(""); setProjectStatus("");}} className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest bg-[var(--bg-page)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg">
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Unable to load projects</h3>
            <p className="text-[var(--text-muted)] mb-6 font-medium">Please check your connection and try again.</p>
            <button onClick={fetchData} className="flex items-center justify-center gap-2 mx-auto bg-[var(--text-primary)] text-[var(--bg-page)] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-80 transition-opacity">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-16 text-center shadow-sm">
            <Building2 className="w-12 h-12 text-[var(--border-subtle)] mx-auto mb-4" />
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">No Projects Found</h3>
            <p className="text-[var(--text-muted)] mb-6 font-medium text-lg">We couldn't find any projects matching your criteria.</p>
            {hasActiveFilters && (
              <button onClick={typeof clearFilters === 'function' ? clearFilters : () => {setSearchQuery(""); setLocation(""); setPropertyType(""); setProjectStatus("");}} className="bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:border-[var(--text-primary)] transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* RESULTS */}
        {!loading && !error && filteredProjects.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Matching Projects
              </h2>
              <span className="bg-[var(--text-primary)] text-[var(--bg-page)] px-3 py-1 rounded-full text-xs font-bold">
                {filteredProjects.length} Results
              </span>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProjects.map((property) => (
                <motion.div variants={itemVariants} key={property.documentId} className="group h-full">
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

      </main>
      {homeData && <Footer data={homeData.Footer} />}
    </div>
  );
}
`;

  const finalContent = beforeReturn + newReturn;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Updated ' + p.file);
});
