import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
// import Blog from "@/components/Blog";
// import Contact from "@/components/Contact";
// import Pricing from "@/components/Pricing";
// import Testimonials from "@/components/Testimonials";
// import Features from "@/components/Features";
import Brands from "@/components/Brands";
import SectionTitle from "@/components/Common/SectionTitle";
import ScrollUp from "@/components/Common/ScrollUp";
import FeaturesTab from "@/components/FeaturesTab";
import Hero from "@/components/Hero";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PondPedia | Teknologi Akuakultur Yang Berkelanjutan",
  description:
    "To Promote The Sustainability of The Aquaculture Industry Through Technology",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      {/* <Features /> */}
      <SectionTitle
        title="Fitur Utama"
        paragraph="PondPedia menawarkan beragam fitur unggul untuk mendukung praktik akuakultur yang berkelanjutan."
        center
      />
      <FeaturesTab />
      {/* <Video /> */}
      <SectionTitle
        title="Didukung Oleh"
        paragraph=""
        center
      />
      <Brands />
      <AboutSectionOne />
      {/* <AboutSectionTwo /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      {/* <Blog /> */}
      {/* <Contact /> */}
    </>
  );
}
