import Link from "next/link";
import { MouseEvent } from "react";

interface Button {
  text: string;
  color?: string;
  size?: string;
  onClick?(event: MouseEvent<HTMLButtonElement>): void;
  href?: string;
  block?: boolean;
  rounded?: boolean;
}

export default function Button({
  text = "",
  color = "green",
  size = "md",
  onClick = () => {},
  href = "",
  block,
  rounded,
}: Button) {
  // Default classes
  let finalClass = `${rounded ? "rounded-full px-4" : "rounded"} ${
    block ? "w-full" : ""
  } hover:opacity-70`;

  // Determine background color
  switch (color) {
    default:
    case "green":
      finalClass += " bg-green-400 text-black";
      break;
    case "gray":
      finalClass += " bg-gray-400 text-black";
      break;
  }

  // Determine padding
  switch (size) {
    default:
    case "md":
      finalClass += " p-2";
      break;
    case "sm":
      finalClass += " p-0";
      break;
  }

  if (href)
    return (
      <Link className={finalClass} href={href}>
        {text}
      </Link>
    );

  return (
    <button className={finalClass} onClick={onClick}>
      {text}
    </button>
  );
}
