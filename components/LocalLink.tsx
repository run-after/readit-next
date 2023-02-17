import Link from "next/link";
import { MouseEventHandler } from "react";

interface ILocalLink {
  href: string;
  text: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function LocalLink({ href, text, onClick }: ILocalLink) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold hover:underline hover:opacity-80"
      onClick={onClick}
    >
      {text}
    </Link>
  );
}
