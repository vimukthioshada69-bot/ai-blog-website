import type { Metadata } from "next";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
export const metadata: Metadata = { title: "Free AI Background Remover Online | SYNAPSE AI", description: "Remove photo backgrounds for free in your browser and download transparent PNG images. No signup required.", alternates: { canonical: "/tools/background-remover" } };
export default function Page() { return <BackgroundRemover />; }
