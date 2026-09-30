import EditProfileForm from "@/components/user/EditProfileForm";

export const metadata = {
  title: "Edit Profile | HomeHub",
  description: "Update your HomeHub buyer profile details, photo and settings.",
};

// NOTE: Do NOT call getUserProfile() here — it uses localStorage (JWT) which
// is unavailable on the server. EditProfileForm fetches the profile client-side.
export default function EditProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D3326]">Edit Profile</h1>
        <p className="mt-1 text-sm text-[#0D3326]/70">
          Update your HomeHub buyer profile details, photo and settings.
        </p>
      </div>
      <EditProfileForm />
    </div>
  );
}
