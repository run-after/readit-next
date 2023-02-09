interface Input {
  label?: string;
}

export default function Input({ label }: Input) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <input className="border rounded w-full" />
    </div>
  );
}
