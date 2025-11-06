import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

function AddBookmark() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBookmark: BookmarkItem = {
      id: Date.now(),
      title,
      url,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const existing = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const updated = [newBookmark, ...existing];
    localStorage.setItem("bookmarks", JSON.stringify(updated));

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">새 북마크 추가</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">제목</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="예: React 공식 문서" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="https://example.com" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="이 북마크에 대한 간단한 설명을 입력하세요."></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">태그</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="쉼표로 구분 (예: react, frontend)" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            추가하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBookmark;
