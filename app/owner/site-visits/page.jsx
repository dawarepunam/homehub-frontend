import { redirect } from "next/navigation";

export default function SiteVisitsIndexPage() {
  redirect("/owner/site-visits/upcoming");
}

