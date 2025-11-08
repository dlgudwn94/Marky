import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

function AddBookmark() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // 수정 모드일 경우 데이터 불러오기
  useEffect(() => {
    if (id) {
      const bookmarks: BookmarkItem[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const bookmarkToEdit = bookmarks.find((b) => b.id === Number(id));
      if (bookmarkToEdit) {
        setTitle(bookmarkToEdit.title);
        setUrl(bookmarkToEdit.url);
        setDescription(bookmarkToEdit.description);
        setTags(bookmarkToEdit.tags.join(", "));
      }
    }
  }, [id]);

  // URL 유효성 검사
  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(url)) {
      alert("올바른 URL을 입력해주세요.");
      return;
    }

    const newBookmark: BookmarkItem = {
      id: id ? Number(id) : Date.now(),
      title,
      url,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const existing: BookmarkItem[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    let updated: BookmarkItem[];
    if (id) {
      updated = existing.map((b) => (b.id === Number(id) ? newBookmark : b));
    } else {
      updated = [newBookmark, ...existing];
    }

    localStorage.setItem("bookmarks", JSON.stringify(updated));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{id ? "북마크 수정" : "새 북마크 추가"}</h1>

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
            {id ? "수정 완료" : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBookmark;
