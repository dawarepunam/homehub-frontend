export default function PropertyDescription({ property }) {

  const description =
    property?.Description?.[0]?.children?.[0]?.text;

  if (!description) return null;

  return (

    <section className="mt-10">

      <div className="rounded-2xl bg-white p-8 shadow">

        <h2 className="mb-5 text-3xl font-bold">

          Description

        </h2>

        <p className="leading-8 text-gray-600">

          {description}

        </p>

      </div>

    </section>

  );

}