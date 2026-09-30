"use client";

import { useEffect, useRef } from "react";
import { recordPropertyView } from "@/services/activityService";

export default function PropertyViewTracker({ propertyDocumentId }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !propertyDocumentId) return;
    tracked.current = true;
    recordPropertyView(propertyDocumentId);
  }, [propertyDocumentId]);

  return null;
}
