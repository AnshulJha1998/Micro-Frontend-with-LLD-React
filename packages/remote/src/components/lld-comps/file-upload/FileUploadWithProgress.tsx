import React, { useRef, useState } from "react";

const CHUNK_SIZE = 512 * 1024; // 512KB per chunk

function FileUploadWithProgress() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Validate and show preview immediately
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files || null;
    if (!f) return;
    if (!["image/png", "image/jpeg"].includes(f.type)) {
      setError("Only PNG and JPEG images allowed.");
      setFile(null);
      setPreview(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setProgress(0);
  };

  // Chunked upload logic (mock API endpoint here)
  const uploadFile = async () => {
    if (!file) return;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploaded = 0;
    abortRef.current = new AbortController();

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Simulate real upload with a timeout. Replace this with real upload logic:
        await new Promise((res, rej) => {
          const timeout = setTimeout(res, 300);
          abortRef.current!.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            rej(new Error("Upload cancelled"));
          });
        });

        // Update progress (per chunk)
        uploaded += chunk.size;
        setProgress(Math.round((uploaded / file.size) * 100));
      }
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "Upload cancelled or failed");
    } finally {
      abortRef.current = null;
    }
  };

  // Cancel current upload
  const cancelUpload = () => {
    abortRef.current?.abort();
  };

  // Retry: Reset error/progress and re-upload
  const retryUpload = () => {
    setError(null);
    setProgress(0);
    uploadFile();
  };

  return (
    <div style={{ maxWidth: 350, margin: "40px auto" }}>
      <h2>File Upload with Progress</h2>
      <input type="file" onChange={onFileChange} accept=".png,.jpg,.jpeg" />
      {preview && (
        <div style={{ margin: "10px 0" }}>
          <img src={preview} alt="Preview" width={100} />
        </div>
      )}
      {file && (
        <div>
          <button
            onClick={uploadFile}
            disabled={progress !== 0 && progress !== 100}
          >
            Upload
          </button>
          {progress > 0 && progress < 100 && (
            <button onClick={cancelUpload} style={{ marginLeft: 5 }}>
              Cancel
            </button>
          )}
        </div>
      )}
      {progress > 0 && (
        <div style={{ margin: 10 }}>
          <progress value={progress} max={100} style={{ width: "90%" }} />
          <span> {progress}%</span>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          Error: {error}{" "}
          <button onClick={retryUpload} style={{ marginLeft: 5 }}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploadWithProgress;
