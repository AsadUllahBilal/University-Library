"use client";

import { Image as IKImage, upload, Video as IKVideo } from "@imagekit/next";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import config from "@/lib/config";
import { Button } from "./ui/button";

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<{ filePath: string | null | undefined }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  // Validate file size
  const onValidate = (file: File) => {
    const maxSize = type === "image" ? 20 : 50; // MB
    if (file.size > maxSize * 1024 * 1024) {
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!onValidate(selectedFile)) return;

    try {
      // Get authentication params from your server
      const authRes = await fetch("/api/imagekit");
      const authData = await authRes.json();

      // Upload using @imagekit/next
      const res = await upload({
        publicKey: config.env.imagekit.publicKey,
        file: selectedFile,
        fileName: selectedFile.name,
        folder,
        signature: authData.signature,
        expire: authData.expire,
        token: authData.token,
        onProgress: (evt) => {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setProgress(percent);
        },
      });

      setFile({ filePath: res.filePath ?? null });
      onFileChange(res.filePath ?? "");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        className="bg-[#232839] w-full h-14 text-[18px] cursor-pointer py-3 hover:bg-[#232839] text-light-100"
        size={"lg"}
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
        />
        <p>{placeholder}</p>
        {file.filePath && <p className="text-xs">{file.filePath}</p>}
      </Button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200 mt-2 h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {file.filePath && type === "image" && (
        <IKImage
          src={file.filePath}
          width={500}
          height={300}
          alt="Uploaded Image"
          urlEndpoint={config.env.imagekit.urlEndpoint}
        />
      )}

      {file.filePath && type === "video" && (
        <IKVideo
          src={file.filePath} // ✅ use src, not path
          urlEndpoint={config.env.imagekit.urlEndpoint}
          controls
          width={500}
          height={300}
          className="h-96 w-full rounded-xl"
        />
      )}
    </div>
  );
};

export default FileUpload;
