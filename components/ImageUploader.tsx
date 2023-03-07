import { useState, Dispatch, SetStateAction } from "react";

import Button from "./Button";

interface IImageUploader {
  image: File | null;
  onChange: Function;
  errorArr: String[];
  setErrorArr: Dispatch<SetStateAction<String[]>>;
}

export default function ImageUploader({
  image,
  onChange,
  errorArr,
  setErrorArr,
}: IImageUploader) {
  const [sizeError, setSizeError] = useState(false);

  const handleChange = (file: File) => {
    if (file?.size > 2000000) {
      setErrorArr([...errorArr, "imageError"]);
      setSizeError(true);
    }

    onChange(file);
  };

  return (
    <div
      className={`${
        errorArr.includes("imageError") || sizeError ? "border-red-500" : ""
      } border bg-gray-900 p-2 flex flex-col gap-4 items-center`}
    >
      {image && (
        <div className="p-2 flex flex-col gap-4 items-center">
          <div className="border p-4">
            <img
              alt="not found"
              width={"50px"}
              src={URL.createObjectURL(image)}
            />
          </div>
          <div>
            <Button
              color="red"
              text="Remove"
              onClick={() => {
                const filteredArr = errorArr.filter(
                  (err) => err !== "imageError"
                );
                setErrorArr(filteredArr);
                setSizeError(false);
                onChange(null);
              }}
            />
          </div>
        </div>
      )}
      {!image && (
        <input
          type="file"
          accept=".png,.gif,.jpeg,.jpg"
          name="image"
          onChange={(event) => {
            if (event.target.files) handleChange(event.target.files[0]);
          }}
        />
      )}
      {sizeError && <p className="text-red-400">Max file size is 2MB</p>}
    </div>
  );
}
