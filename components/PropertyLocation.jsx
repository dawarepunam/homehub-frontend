export default function PropertyLocation({ property }) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-extrabold tracking-tight">
        Property Location
      </h2>

      <div className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 md:p-8 shadow-[var(--shadow-card)]">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Address" value={property.Address} />
          <InfoCard title="Area" value={property.Area} />
          <InfoCard title="City" value={property.City} />
          <InfoCard title="State" value={property.State} />
          <InfoCard title="Pincode" value={property.PinCode} />
        </div>

        {property.GoogleMapLink && (
          <a
            href={property.GoogleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] px-6 py-3 font-bold text-sm uppercase tracking-widest transition hover:opacity-80"
          >
            📍 View on Google Maps
          </a>
        )}
      </div>
    </section>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-5">
      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
        {title}
      </p>
      <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
        {value || "-"}
      </p>
    </div>
  );
}