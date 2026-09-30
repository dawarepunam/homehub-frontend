import ActivityPageClient from "@/components/user/ActivityPageClient";

export const metadata = { title: "My Activity — HomeHub" };

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D3326]">My Activity</h1>
        <p className="mt-1 text-sm text-[#0D3326]/70">
          Track your property activity and interactions in one place.
        </p>
      </div>
      
      <ActivityPageClient />
    </div>
  );
}
