import Link from "next/link";

interface Button {
  text: string;
  color?: string;
  size?: string;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  href?: string;
  block?: boolean;
}

export default function Button({
  text = "",
  color = "green",
  size = "md",
  onClick = () => {},
  href = "",
  block,
}: Button) {
  // Default classes
  let finalClass = `rounded ${block ? "w-full" : ""}`;

  // Determine background color
  switch (color) {
    default:
    case "green":
      finalClass += " bg-green-400 text-black";
  }

  // Determine padding
  switch (size) {
    default:
    case "md":
      finalClass += " p-2";
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
