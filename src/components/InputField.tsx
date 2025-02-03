import React, { useState, useRef, useEffect } from "react";
import { Stack, Typography, Box } from "@mui/material";

interface InputFieldProps {
  min: number;
  max: number;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ min, max, placeholder }) => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(50);

  // Хук для обновления ширины поля ввода в зависимости от длины текста
  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 10);
    }
  }, [value]);

  // Функция для форматирования числа с разделителями по тысячам
  const formatNumber = (number: number): string => {
    const numberAsString = number.toString();
    const absoluteNumberString = numberAsString.replace("-", "");
    return absoluteNumberString.length > 4
      ? new Intl.NumberFormat("ru-RU").format(number)
      : numberAsString;
  };

  // Функция обработки потери фокуса
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const rawValue = e.target.value.replace(/\s+/g, "");
    const inputValue = parseFloat(rawValue);

    // Проверка на корректность ввода
    if (isNaN(inputValue)) {
      setError("Значение должно быть числом");
      setValue(formatNumber(min));
    } else if (inputValue < min || inputValue > max) {
      setError(`Значение должно быть между ${min} и ${max}`);
      setValue(formatNumber(Math.min(Math.max(inputValue, min), max)));
    } else {
      setError("");
      setValue(formatNumber(inputValue));
    }
  };

  // Функция обработки ввода текста
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, "");

    if (/^-?\d*$/.test(rawValue)) {
      setValue(rawValue);
      setError("");
    }
  };

  return (
    <Stack width="100%" justifyContent="center" alignItems="center">
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          visibility: "hidden",
        }}
      >
        {value || "0"}
      </span>

      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          minWidth: "150px",
          width: `${inputWidth}px`,
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            left: "8px",
            top: isFocused || value ? "0px" : "50%",
            transform:
              isFocused || value
                ? "translateY(-100%) scale(0.8)"
                : "translateY(-50%) scale(1)",
            transition: "transform 0.2s ease-in-out, top 0.2s ease-in-out",
            fontSize: isFocused || value ? "12px" : "16px",
            color: isFocused ? "#7688f0" : "#aaa",
            pointerEvents: "none",
          }}
        >
          {placeholder}
        </Typography>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          style={{ width: "100%", height: "40px" }}
        />
      </Box>

      {error && <Typography color="error">{error}</Typography>}
    </Stack>
  );
};

export default InputField;
