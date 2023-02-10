interface Input {
  label?: string;
  name: string;
  type?: string;
}

export default function Input({ label, name, type = "text" }: Input) {
  return (
    <div className="text-black">
      <p className="text-gray-500 text-sm">{label}</p>
      <input className="border rounded w-full p-1" name={name} type={type} />
    </div>
  );
}
