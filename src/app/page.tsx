import { LandingPage } from "@/components/LandingPage";
import { Feature } from "@/components/Feature";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <LandingPage />
      <Feature />
      <Footer />
    </main>
  );
}
