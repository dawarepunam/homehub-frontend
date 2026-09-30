import PropertyRequirementClient from "@/components/user/PropertyRequirementClient";

export const metadata = { title: "Property Requirements — HomeHub" };

export default function RequirementsPage() {
  return (
    <div className="space-y-6">
      <PropertyRequirementClient />
    </div>
  );
}
