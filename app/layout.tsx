import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "./_providers/Auth";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <AuthProvider
          // To toggle between the REST and GraphQL APIs,
          // change the `api` prop to either `rest` or `gql`
          api="rest" // change this to `gql` to use the GraphQL API
        >
          <Providers>
            {/* <ConditionalHeader route={route} /> */}
            <Header />
            <main>{children}</main>
            {/* <ConditionalHeader route={route} /> */}
            <Footer />
            <ScrollToTop />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

// export default async function RootLayout(props: { children: React.ReactNode }) {
//   const { children } = props;

//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider
//           // To toggle between the REST and GraphQL APIs,
//           // change the `api` prop to either `rest` or `gql`
//           api="rest" // change this to `gql` to use the GraphQL API
//         >
//           <Providers>
//             <Header />
//             <main>{children}</main>
//             <Footer />
//             <ScrollToTop />
//           </Providers>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import { Providers } from "./providers";
