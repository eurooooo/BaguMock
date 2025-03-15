import { Hero } from "@/components/Hero";
import { MainForm } from "@/components/MainForm";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <Hero />
      <MainForm />
    </main>
  );
}
