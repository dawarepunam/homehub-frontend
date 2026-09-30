export default function PropertyLocation({ property }) {
  return (
    <section className="mt-12">

      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        📍 Property Location
      </h2>

      <div className="rounded-2xl bg-white p-8 shadow">

        <div className="grid gap-6 md:grid-cols-2">

          <InfoCard
            title="Address"
            value={property.Address}
          />

          <InfoCard
            title="Area"
            value={property.Area}
          />

          <InfoCard
            title="City"
            value={property.City}
          />

          <InfoCard
            title="State"
            value={property.State}
          />

          <InfoCard
            title="Pincode"
            value={property.PinCode}
          />

        </div>

        {property.GoogleMapLink && (
          <a
            href={property.GoogleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
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
    <div className="rounded-xl border bg-gray-50 p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-lg font-semibold text-gray-900">
        {value || "-"}
      </p>

    </div>
  );
}