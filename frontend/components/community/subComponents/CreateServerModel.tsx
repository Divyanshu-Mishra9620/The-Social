"use client";
import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCamera, IconX } from "@tabler/icons-react";

export interface CreateServerModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateServerModel: React.FC<CreateServerModelProps> = ({
  isOpen,
  onClose,
}) => {
  const [serverName, setServerName] = useState("");
  const [serverImage, setServerImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setServerImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) {
      alert("Please provide a server name.");
      return;
    }

    const formData = new FormData();
    formData.append("name", serverName);
    if (serverImage) {
      formData.append("profilePic", serverImage);
    }

    console.log("Submitting form data:", {
      name: serverName,
      file: serverImage?.name,
    });

    // Here you would make your API call, e.g., fetch('/api/servers', { method: 'POST', body: formData });

    onClose(); // Close the modal after submission
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-neutral-900"
          >
            <div className="relative text-center">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                Create Your Server
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Give your new community a personality with a name and an icon.
              </p>
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="flex justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  className="group relative h-24 w-24 rounded-full border-2 border-dashed border-neutral-300 transition-colors hover:border-blue-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-neutral-800/50"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Server icon preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <IconCamera
                        size={32}
                        className="text-neutral-400 transition-colors group-hover:text-blue-500"
                      />
                    </div>
                  )}
                </button>
              </div>

              <div>
                <label
                  htmlFor="serverName"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  SERVER NAME
                </label>
                <input
                  id="serverName"
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Enter a server name"
                  maxLength={100}
                  required
                  className="w-full rounded-md border border-neutral-300 bg-transparent px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:text-neutral-200 dark:focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
              >
                Create Server
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateServerModel;
