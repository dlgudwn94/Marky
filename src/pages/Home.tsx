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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(stored);
    setFilteredBookmarks(stored);
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    setFilteredBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const term = searchTerm.toLowerCase().trim();

    if (term === "") {
      setFilteredBookmarks(bookmarks);
    } else {
      const result = bookmarks.filter((b) => b.title.toLowerCase().includes(term) || b.tags.some((tag) => tag.toLowerCase().includes(term)));
      setFilteredBookmarks(result);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredBookmarks(bookmarks);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">내 북마크</h1>

          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input type="text" placeholder="제목 또는 태그 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 pr-8 w-full focus:ring-2 focus:ring-indigo-400 outline-none" />
              {searchTerm && (
                <button type="button" onClick={handleReset} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  ✖
                </button>
              )}
            </div>

            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              검색
            </button>

            <button type="button" onClick={() => navigate("/add")} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              + 새 북마크
            </button>
          </form>
        </div>

        {filteredBookmarks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">{bookmarks.length === 0 ? "아직 추가된 북마크가 없습니다." : "검색 결과가 없습니다."}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((item) => (
              <BookmarkCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
