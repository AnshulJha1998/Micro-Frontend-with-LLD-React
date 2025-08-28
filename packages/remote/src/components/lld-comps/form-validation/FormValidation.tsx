import React, { useEffect, useMemo, useState } from "react";
import Input from "./more-on-inputs/Input";

// REGEX for : farcry4.ajayGhale@kyrat.com

// =====> /^[a-z]+\d+\.[a-z]+[A-Z][a-zA-Z]*@kyrat\.com$/

// 🔎 Breakdown
// ^[a-z]+ → game name: one or more lowercase letters

// \d+ → one or more digits (game version number)

// \. → literal dot

// [a-z]+ → first name: lowercase letters

// [A-Z] → one uppercase letter (surname start)

// [a-zA-Z]* → rest of surname (letters, any case)

// @kyrat\.com$ → literal domain, at end

type FormState = {
  username: string;
  age: string;
  email: string;
  agree: boolean;
  occ: string;
  file: File | null;
};

type Errors = {
  [K in keyof FormState]?: string;
};

const initState: FormState = {
  username: "",
  age: "",
  email: "",
  agree: false,
  occ: "",
  file: null,
};

const validate = (formData: FormState) => {
  const errors: Errors = {};

  if (!formData.username) errors.username = "Username is required";
  else if (formData.username.length <= 3)
    errors.username = "Username should not be less than length 3";

  const ageNum = Number(formData.age);
  if (!ageNum) errors.age = "Age is required";
  else if (isNaN(ageNum)) errors.age = "Age should be an integer";
  else if (ageNum < 0) errors.age = "Age should be positive integer";
  else if (ageNum < 18) errors.age = "Age should be more than 18";
  else if (ageNum > 100) errors.age = "Age should not be more than 100";

  if (!formData.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid Email";

  if (!formData.agree) errors.agree = "You must agree to terms";

  if (!formData.occ) errors.occ = "Select an Occupation";

  if (!formData.file) errors.file = "File required";
  else if (
    !["image/png", "image/jpeg", "application/pdf"].includes(formData.file.type)
  )
    errors.file = "Only PNG , JPEG or PDF  allowed";
  else if (formData.file.size > 5 * 1024 * 1024)
    errors.file = "File must be ≤ 5MB";

  return errors;
};

const FormValidation = () => {
  const [form, setForm] = useState<FormState>(initState);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [preview, setPreview] = useState<string | null>();

  const errors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  const showError = (field: keyof FormState) => {
    return touched[field] && errors[field];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files?.[0] : type === "checkbox" ? checked : value,
    }));

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (type === "file" && files?.[0]) {
      setPreview(URL.createObjectURL(files?.[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      username: true,
      age: true,
      email: true,
      agree: true,
      occ: true,
      file: true,
    });

    if (isValid) {
      alert("Submitted!\n" + JSON.stringify(form, null, 2));
    }
  };

  useEffect(() => {
    // to prevent re-rendering

    if (!form.file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url); // Clean up!
  }, [form.file]);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        maxWidth: 400,
        margin: "32px auto",
        padding: 18,
        border: "1px solid #ddd",
        borderRadius: 7,
        fontFamily: "sans-serif",
      }}
    >
      <h2>Form Validation Example</h2>
      <div style={{ margin: "14px 0" }}>
        <label>
          Username:
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                username: true,
              }))
            }
          ></input>
        </label>
        {showError("username") && (
          <div style={{ color: "red" }}>{errors.username}</div>
        )}
      </div>
      <div style={{ margin: "14px 0" }}>
        <label>
          Age:
          <input
            name="age"
            type="text"
            inputMode="numeric" //for mobile input
            autoComplete="off"
            value={form.age}
            onChange={(e) => {
              const int = e.target.value;
              // if (/^\d{0,2}(\.\d{0,1})?$/.test(int)) handleChange(e); if decimal of 1 digit is allowed
              if (/^\d{0,2}$/.test(int)) handleChange(e);
              setTouched((prev) => ({ ...prev, age: true }));
            }}
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                age: true,
              }))
            }
          ></input>
        </label>
        {showError("age") && <div style={{ color: "red" }}>{errors.age}</div>}
      </div>
      {/* For Phone Number  */}
      <Input />
      <div style={{ margin: "14px 0" }}>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
        </label>
        {showError("email") && (
          <div style={{ color: "red" }}>{errors.email}</div>
        )}
      </div>
      <div style={{ margin: "14px 0" }}>
        <label>
          Occupation:
          <select
            name="occ"
            value={form.occ}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, occ: true }))}
          >
            <option value="">None</option>
            <option value="Frontend Dev">Frontend</option>
            <option value="Backend Dev">Backend</option>
            <option value="Devops">Devops</option>
            <option value="QA">QA</option>
          </select>
        </label>
        {showError("occ") && <div style={{ color: "red" }}>{errors.occ}</div>}
      </div>
      <div style={{ margin: "14px 0" }}>
        <label>
          Terms and policies:
          <input
            name="agree"
            type="checkbox"
            checked={form.agree}
            onChange={handleChange}
          />{" "}
          I agree to terms
        </label>
        {showError("agree") && (
          <div style={{ color: "red" }}>{errors.agree}</div>
        )}
      </div>
      <div style={{ margin: "14px 0" }}>
        <label>
          Upload file (PNG/JPEG/PDF ≤ 5MB):
          <input
            name="file"
            type="file"
            onChange={handleChange}
            accept=".pdf,.png,.jpeg,.jpg"
            onBlur={() => setTouched((t) => ({ ...t, file: true }))}
          />
        </label>
        {showError("file") && <div style={{ color: "red" }}>{errors.file}</div>}
        {preview && (
          <div style={{ marginTop: 6 }}>
            {form.file?.type === "application/pdf" ? (
              <div style={{ marginTop: 6, height: 300 }}>
                <object
                  data={preview}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p>
                    Your browser does not support PDFs.{" "}
                    <a href={URL.createObjectURL(form.file)}>Download PDF</a>.
                  </p>
                </object>
              </div>
            ) : (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
            )}
          </div>
        )}
      </div>
      {/* <iframe src="https://www.youtube.com/watch?v=bXPTcJssGRc" /> */}
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};

export default FormValidation;
