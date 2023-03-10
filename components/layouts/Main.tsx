import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";

export default function Main({ children }) {
  return (
    <div className="bg-black h-full min-h-screen">
      <Header />
      <Sidebar />
      {/* This needs to be dynamic based on */}
      <div className="pt-16 ml-32 text-white h-full">{children}</div>
    </div>
  );
}
