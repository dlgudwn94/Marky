import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkCard from "../components/BookmarkCard";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

function Home() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(stored);
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">내 북마크</h1>
          <button onClick={() => navigate("/add")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            + 새 북마크
          </button>
        </div>

        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center">아직 추가된 북마크가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((item) => (
              <BookmarkCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
