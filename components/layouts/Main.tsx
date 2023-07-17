import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { ReactNode } from "react";

interface MainProp {
  children: ReactNode;
}

export default function Main({ children }: MainProp) {
  return (
    <div className="bg-black h-full min-h-screen">
      <Header />
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="pt-16 md:ml-32 text-white h-full">{children}</div>
    </div>
  );
}
