import Footer from "@/components/landing/footer";
import Navbar from "@/components/landing/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <>
        <Navbar />
        <main>{children}</main>
        <Footer />
        </>
    );
}
