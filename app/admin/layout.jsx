import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <AdminFooter />
    </div>
  );
}
