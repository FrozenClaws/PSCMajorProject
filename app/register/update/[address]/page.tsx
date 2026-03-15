"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { client } from "@/lib/client";
import "@/app/globals.css";
import LogoutButton from "@/components/logoutButton";
import { StakeholderContract } from "@/lib/contracts";
import UpdateStakeholderTx from "@/components/updateStakeholder";
import { ROLE_MAP } from "@/lib/rolemap";

type Stakeholder = {
  user: string;
  name: string;
  role: string;
  location: string;
  detailsIPFSURL: string;
  license: string;
  approved: boolean;
  exists: boolean;
};

const rolesOptions = [
  "MANUFACTURER",
  "CONSUMER",
  "PHARMACY",
  "DISTRIBUTOR",
  "WHOLESALER",
];

export default function UpdateRegistrationPage() {
  const router = useRouter();
  const account = useActiveAccount();

  const { data, isLoading: isFetching } = useReadContract({
    contract: StakeholderContract,
    method: "getStakeholder",
    params: [account?.address as string],
    queryOptions: {
      enabled: !!account,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    role: "",
    detailsIPFSURL: "",
    license: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!data) return;

    const stakeholder: Stakeholder = Array.isArray(data)
      ? {
          user: data[0] as string,
          name: data[1] as string,
          role: data[2] as string,
          location: data[3] as string,
          detailsIPFSURL: data[4] as string,
          license: data[5] as string,
          approved: data[6] as boolean,
          exists: data[7] as boolean,
        }
      : (data as Stakeholder);

    if (stakeholder.exists) {
      const roleLabel = ROLE_MAP[stakeholder.role as string] ?? "";
      setFormData({
        name: stakeholder.name ?? "",
        location: stakeholder.location ?? "",
        role: roleLabel,
        detailsIPFSURL: stakeholder.detailsIPFSURL ?? "",
        license: stakeholder.license ?? "",
      });
    }
  }, [data]);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account?.address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const uri = await upload({
        client,
        files: [file],
      });

      const ipfsUrl = uri;

      setFormData((prev) => ({
        ...prev,
        detailsIPFSURL: ipfsUrl,
      }));

      setSuccess("File uploaded successfully!");
      setError("");
    } catch (err) {
      setError("IPFS upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit =
    !!formData.name &&
    !!formData.location &&
    !!formData.role &&
    !!formData.license &&
    !!formData.detailsIPFSURL;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/40">
              <span className="text-sm font-semibold text-emerald-400">Rx</span>
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                PharmaChain
              </p>
              <p className="text-xs text-slate-400">
                Update your stakeholder details
              </p>
            </div>
          </div>

          <LogoutButton />
        </header>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            <section className="max-w-lg space-y-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Update your{" "}
                <span className="text-emerald-400">Stakeholder Profile</span>
              </h1>
              <p className="text-sm text-slate-300 sm:text-base">
                Review and update your regulatory information and supporting
                documentation. Changes will be written on-chain using your
                connected wallet.
              </p>
            </section>

            <section className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  Edit registration details
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Your current on-chain details are prefilled below.
                </p>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                    {success}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-slate-200"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    placeholder="Enter your full name"
                    disabled={isUploading || isFetching}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="location"
                    className="block text-xs font-medium text-slate-200"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    placeholder="Enter your location"
                    disabled={isUploading || isFetching}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="role"
                    className="block text-xs font-medium text-slate-200"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    disabled={isUploading || isFetching}
                  >
                    <option value="">Select a role</option>
                    {rolesOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="license"
                    className="block text-xs font-medium text-slate-200"
                  >
                    License ID
                  </label>
                  <input
                    type="text"
                    id="license"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    placeholder="Enter License ID"
                    disabled={isUploading || isFetching}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="fileUpload"
                    className="block text-xs font-medium text-slate-200"
                  >
                    Upload New Supporting Document (optional)
                  </label>

                  <input
                    type="file"
                    id="fileUpload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-500/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-emerald-200 hover:file:bg-emerald-500/20"
                    disabled={isUploading || isFetching}
                  />

                  {file && (
                    <p className="mt-1 text-xs text-slate-400">
                      Selected: {file.name}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-3 inline-flex items-center rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm transition hover:border-emerald-400 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isUploading || !file}
                  >
                    {isUploading ? "Uploading to IPFS..." : "Upload Document"}
                  </button>
                </div>

                <UpdateStakeholderTx
                  name={formData.name}
                  location={formData.location}
                  role={formData.role}
                  detailsIPFSURL={formData.detailsIPFSURL}
                  license={formData.license}
                  disabled={!canSubmit || isFetching}
                  onSuccess={() => {
                    setSuccess("Update successful! Redirecting...");
                    setError("");
                    router.push("/waiting");
                  }}
                  onError={(err) => {
                    console.error("Update failed:", err);
                    const message =
                      err instanceof Error
                        ? err.message
                        : "Transaction failed. Check console for details.";
                    setError(message);
                  }}
                />
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
