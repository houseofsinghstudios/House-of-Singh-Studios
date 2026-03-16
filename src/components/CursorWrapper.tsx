"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function CursorWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <CustomCursor />;
}
