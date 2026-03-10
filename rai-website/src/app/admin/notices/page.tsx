"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Notice {
  _id: string;
  title: string;
  description: string;
  date: string;
  documentUrl: string;
}

export default function NoticesManagementPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    documentUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchNotices(); }, []);

  async function fetchNotices() {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    } catch (error) {
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? "/api/notices" : "/api/notices";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? "Updated!" : "Added!");
        setShowModal(false);
        resetForm();
        fetchNotices();
      }
    } catch (error) {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/notices?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!");
        fetchNotices();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  function handleEdit(item: Notice) {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description || "",
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : "",
      documentUrl: item.documentUrl || "",
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({ title: "", description: "", date: new Date().toISOString().split('T')[0], documentUrl: "" });
    setEditingId(null);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "rai/notices");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, documentUrl: data.url });
        toast.success("Uploaded!");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notices Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage department notices</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Add Notice
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : notices.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center">No notices</td></tr>
            ) : (
              notices.map((n) => (
                <tr key={n._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{n.title}</td>
                  <td className="px-6 py-4">{n.date || "N/A"}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(n)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(n._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit" : "Add"} Notice</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Document (Optional)</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />
                  {formData.documentUrl && <p className="text-sm text-green-600 mt-2">Document uploaded</p>}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400">
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
