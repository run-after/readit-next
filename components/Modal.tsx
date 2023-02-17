import { ReactNode, useEffect, MouseEventHandler } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface IModal {
  onClose: MouseEventHandler<HTMLParagraphElement>;
  children: ReactNode;
}

export default function Modal({ onClose, children }: IModal) {
  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm cursor-auto z-20">
      <div className="w-3/4 h-5/6 bg-black border border-gray-700 rounded relative cursor-auto">
        <p
          className="text-black absolute top-3 right-5 cursor-pointer hover:opacity-50"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </p>
        {children}
      </div>
    </div>
  );
}
