import { useState } from "react";

const Input = () => {
  const [phone, setPhone] = useState("");

  const formattingNumber = (value: string): string => {
    if (value.length === 0) return "";
    if (value.length <= 3) return `(${value}`;
    if (value.length <= 6) return `(${value.slice(0, 3)})${value.slice(3)}`;
    return `(${value.slice(0, 3)})${value.slice(3, 6)}-${value.slice(6, 10)}`;
  };
  const handlePhoneInputChange = (e) => {
    // const value = e.target.value.replace(/\D/g, "").slice(0, 10);   //another way for digits only
    const value = e.target.value
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll("-", "")
      .replaceAll(" ", "");
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };
  return (
    <div>
      <label>
        {" "}
        Phone Number
        {/* <input  // another way of using Tel only
          value={phone}
          type="tel"
          maxLength={10}
          pattern="[0-9]{10}"
          inputMode="numeric"
          title="Phone number"
          required
          onChange={handlePhoneInputChange}
        /> */}
        <input
          value={formattingNumber(phone)}
          type="text"
          title="Phone number"
          required
          onChange={handlePhoneInputChange}
        />
      </label>
    </div>
  );
};

export default Input;
