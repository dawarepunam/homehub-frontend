export default function PropertyFeatures({ property }) {
  const features = property?.PropertyFeatures || [];

  if (features.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-extrabold tracking-tight">
        Property Features
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features
          .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
          .map((feature) => (
            <div
              key={feature.id}
              className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl mb-4">
                {getIcon(feature.Icon)}
              </div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                {feature.Title}
              </h3>
              <p className="mt-2 text-[var(--text-muted)] font-medium leading-relaxed">
                {feature.Description}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}

function getIcon(icon) {
  switch (icon) {
    case "bed": return "🛏";
    case "car": return "🚗";
    case "pool": return "🏊";
    case "shield": return "🛡";
    case "wifi": return "📶";
    case "lift": return "🛗";
    case "gym": return "🏋️";
    case "camera": return "📷";
    default: return "✔";
  }
}