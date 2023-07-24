interface Input {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  disabled?: boolean;
  maxLength?: number;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  error,
  onChange,
  disabled,
  maxLength,
}: Input) {
  if (type === "textarea")
    return (
      <div className="space-y-1">
        <p className="text-gray-500 text-sm">{label}</p>
        <textarea
          className={`${
            error ? "border-red-500" : ""
          } border rounded w-full p-2 bg-black`}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
        />
      </div>
    );

  return (
    <div className="space-y-1">
      <p className="text-gray-500 text-sm">{label}</p>
      <input
        className={`${
          error ? "border-red-500" : ""
        } border rounded w-full p-2 bg-black`}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
      />
    </div>
  );
}
