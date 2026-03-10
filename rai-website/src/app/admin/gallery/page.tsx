"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Gallery {
  _id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  eventDate: string;
}

export default function GalleryManagementPage() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "events",
    thumbnail: "",
    description: "",
    eventDate: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchGallery(); }, []);

  async function fetchGallery() {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setGallery(data);
    } catch (error) {
      toast.error("Failed to fetch gallery");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? "/api/gallery" : "/api/gallery";
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
        fetchGallery();
      }
    } catch (error) {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!");
        fetchGallery();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  function handleEdit(item: Gallery) {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      category: item.category,
      thumbnail: item.thumbnail,
      description: item.description || "",
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : "",
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({ title: "", category: "events", thumbnail: "", description: "", eventDate: "" });
    setEditingId(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "rai/gallery");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, thumbnail: data.url });
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
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage gallery events</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Add Gallery
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : gallery.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center">No gallery items</td></tr>
            ) : (
              gallery.map((g) => (
                <tr key={g._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><img src={g.thumbnail} alt={g.title} className="w-16 h-12 object-cover rounded" /></td>
                  <td className="px-6 py-4 font-medium">{g.title}</td>
                  <td className="px-6 py-4 capitalize">{g.category}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(g)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(g._id)} className="text-red-600 hover:text-red-900">Delete</button>
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
              <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit" : "Add"} Gallery</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="w-32 h-20 object-cover mt-2 rounded" />}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
                    <option value="events">Events</option>
                    <option value="competitions">Competitions</option>
                    <option value="cultural">Cultural</option>
                    <option value="projects">Projects</option>
                    <option value="industrial_visit">Industrial Visit</option>
                    <option value="workshop">Workshop</option>
                    <option value="labs">Labs</option>
                    <option value="college">College</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date</label>
                  <input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full px-4 py-2 rounded-lg border" />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
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
