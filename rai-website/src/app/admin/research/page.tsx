"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Research {
  _id: string;
  title: string;
  guide: string;
  teamMembers: string[];
  fundedAmount: number;
  year: number;
  thumbnail: string;
  paperUrl: string;
  description: string;
  domain: string;
  status: string;
  fundingAgency: string;
}

export default function ResearchManagementPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    guide: "",
    teamMembers: "",
    fundedAmount: "",
    year: "",
    thumbnail: "",
    paperUrl: "",
    description: "",
    domain: "",
    status: "ongoing",
    fundingAgency: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResearch();
  }, []);

  async function fetchResearch() {
    try {
      const res = await fetch("/api/research");
      const data = await res.json();
      setResearch(data);
    } catch (error) {
      toast.error("Failed to fetch research");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...formData,
      teamMembers: formData.teamMembers.split(",").map((s) => s.trim()).filter(Boolean),
      fundedAmount: Number(formData.fundedAmount) || 0,
      year: Number(formData.year) || new Date().getFullYear(),
    };

    try {
      const url = editingId ? "/api/research" : "/api/research";
      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? { id: editingId, ...payload }
        : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? "Research updated!" : "Research added!");
        setShowModal(false);
        resetForm();
        fetchResearch();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save research");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/research?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!");
        fetchResearch();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  function handleEdit(item: Research) {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      guide: item.guide || "",
      teamMembers: item.teamMembers.join(", "),
      fundedAmount: item.fundedAmount?.toString() || "",
      year: item.year?.toString() || "",
      thumbnail: item.thumbnail || "",
      paperUrl: item.paperUrl || "",
      description: item.description || "",
      domain: item.domain || "",
      status: item.status || "ongoing",
      fundingAgency: item.fundingAgency || "",
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      guide: "",
      teamMembers: "",
      fundedAmount: "",
      year: "",
      thumbnail: "",
      paperUrl: "",
      description: "",
      domain: "",
      status: "ongoing",
      fundingAgency: "",
    });
    setEditingId(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "rai/research");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, thumbnail: data.url });
        toast.success("Image uploaded!");
      }
    } catch (error) {
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Research Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage research projects
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Add Research
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guide</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : research.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center">No research found</td></tr>
            ) : (
              research.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm font-medium">{r.title}</td>
                  <td className="px-6 py-4 text-sm">{r.guide || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">{r.year || "N/A"}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(r)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit" : "Add"} Research</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="w-32 h-20 object-cover mt-2 rounded" />}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border"
                    placeholder="Research Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guide</label>
                  <input
                    type="text"
                    value={formData.guide}
                    onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    placeholder="Guide Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team Members (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    placeholder="Member 1, Member 2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Funded Amount</label>
                    <input
                      type="number"
                      value={formData.fundedAmount}
                      onChange={(e) => setFormData({ ...formData, fundedAmount: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border"
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Domain</label>
                    <input
                      type="text"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border"
                      placeholder="e.g. Computer Vision"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Funding Agency</label>
                  <input
                    type="text"
                    value={formData.fundingAgency}
                    onChange={(e) => setFormData({ ...formData, fundingAgency: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    placeholder="e.g. AICTE / VGST"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Paper URL</label>
                  <input
                    type="url"
                    value={formData.paperUrl}
                    onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    rows={4}
                    placeholder="Research description..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
