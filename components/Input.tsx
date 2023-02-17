interface Input {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
}: Input) {
  if (type === "textarea")
    return (
      <div className="space-y-1">
        <p className="text-gray-500 text-sm">{label}</p>
        <textarea
          className="border rounded w-full p-2 bg-black"
          name={name}
          placeholder={placeholder}
        />
      </div>
    );

  return (
    <div className="space-y-1">
      <p className="text-gray-500 text-sm">{label}</p>
      <input
        className="border rounded w-full p-2 bg-black"
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
