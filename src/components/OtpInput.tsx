import { useRef, useState, useCallback, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

const OtpInput = ({ length = 6, onComplete, disabled = false }: OtpInputProps) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newValues = [...values];
      newValues[index] = value.slice(-1);
      setValues(newValues);

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      const otp = newValues.join("");
      if (otp.length === length && newValues.every((v) => v !== "")) {
        onComplete(otp);
      }
    },
    [values, length, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [values]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      const newValues = Array(length).fill("");
      pasted.split("").forEach((char, i) => {
        newValues[i] = char;
      });
      setValues(newValues);
      if (pasted.length === length) {
        onComplete(pasted);
      } else {
        inputRefs.current[pasted.length]?.focus();
      }
    },
    [length, onComplete]
  );

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="otp-box bg-background disabled:opacity-50"
        />
      ))}
    </div>
  );
};

export default OtpInput;
