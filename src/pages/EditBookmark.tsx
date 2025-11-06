import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

function EditBookmark() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const bookmark = stored.find((b: BookmarkItem) => b.id === Number(id));
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
      setDescription(bookmark.description);
      setTags(bookmark.tags.join(", "));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const updated = stored.map((b: BookmarkItem) =>
      b.id === Number(id)
        ? {
            ...b,
            title,
            url,
            description,
            tags: tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }
        : b
    );
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">북마크 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">제목</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">태그</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            수정 완료
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBookmark;
