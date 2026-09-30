export default function AdminSection({ title, subtitle, action, children }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#17231E]">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="mt-4 sm:ml-4 sm:mt-0">
            {action}
          </div>
        )}
      </div>
      <div className="p-0">
        {children}
      </div>
    </div>
  );
}
