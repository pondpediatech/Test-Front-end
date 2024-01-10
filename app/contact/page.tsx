import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | PondPedia",
  description: "Halaman Hubungi Kami PondPedia",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hubungi Kami"
        description=""
      />

      <Contact />
    </>
  );
};

export default ContactPage;
