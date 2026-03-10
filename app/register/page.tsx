"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import RegisterStakeholderTx from "@/components/registerStakeholder";
import { upload } from "thirdweb/storage";
import { client } from "@/lib/client";

const rolesOptions = [
  "MANUFACTURER",
  "REGULATOR",
  "CONSUMER",
  "PHARMACY",
  "DISTRIBUTOR",
  "WHOLESALER",
];

export default function RegisterPage() {
  const router = useRouter();
  const account = useActiveAccount();
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    detailsIPFSURL: "",
    license: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account?.address) {
      setError("Please connect your wallet first");
      return;
    }

    if (
      !formData.name ||
      !formData.role ||
      !formData.location ||
      !formData.license ||
      !file
    ) {
      setError("Please fill in all fields and upload a file");
      return;
    }

    setIsLoading(true);

    try {
      // Upload file to IPFS
      const uri = await upload({
        client,
        files: [file],
      });

      const ipfsUrl = uri[0];

      setFormData((prev) => ({
        ...prev,
        detailsIPFSURL: ipfsUrl,
      }));

      setSuccess("File uploaded successfully!");
    } catch (err) {
      setError("IPFS upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Register Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please fill in your details to complete registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Select a role</option>
              {rolesOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Location Field */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your location"
              disabled={isLoading}
            />
          </div>

          {/* IPFS CID Field */}
          {/* File Upload */}
          <div>
            <label
              htmlFor="fileUpload"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Supporting Document
            </label>

            <input
              type="file"
              id="fileUpload"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-700"
              disabled={isLoading}
            />

            {file && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* License ID Field */}
          <div>
            <label
              htmlFor="license"
              className="block text-sm font-medium text-gray-700"
            >
              License ID
            </label>
            <input
              type="text"
              id="license"
              name="license"
              value={formData.license}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter License ID"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          {formData.name &&
            formData.role &&
            formData.location &&
            file &&
            formData.license && (
              <RegisterStakeholderTx
                name={formData.name}
                role={formData.role}
                location={formData.location}
                detailsIPFSURL={formData.detailsIPFSURL}
                license={formData.license}
                onSuccess={() => {
                  setSuccess("Registration successful!");
                  setTimeout(() => router.push("/"), 2000);
                }}
              />
            )}
        </form>

        <p className="text-center text-sm text-gray-600">
          Make sure your wallet is connected before registering
        </p>
      </div>
    </div>
  );
}
