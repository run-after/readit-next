import { ReactNode, useEffect, MouseEventHandler } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface IModal {
  onClose: MouseEventHandler<HTMLParagraphElement>;
  children: ReactNode;
  heading?: ReactNode;
}

export default function Modal({ onClose, children, heading }: IModal) {
  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return function () {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm cursor-auto z-20">
      <div className="w-3/4 h-5/6 overflow-y-auto bg-black border border-gray-700 rounded relative cursor-auto flex flex-col">
        {/* Heading */}
        <div className="w-full h-12 flex gap-4 items-center px-4">
          <div className="flex-1 py-2">{heading}</div>
          <p
            className="text-black cursor-pointer hover:opacity-50"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </p>
        </div>
        {/* Main section */}
        <div className="overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  );
}
