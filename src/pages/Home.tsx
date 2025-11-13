import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkCard from "../components/BookmarkCard";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  favorite: boolean;
}

function Home() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filtered, setFiltered] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [searchResultCount, setSearchResultCount] = useState<number | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(stored);
    setFiltered(stored);
  }, []);

  const handleSearch = () => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      setFiltered(bookmarks);
      setDisplayQuery("");
      setSearchResultCount(null);
      return;
    }

    const result = bookmarks.filter((b) => b.title.toLowerCase().includes(trimmed) || b.description.toLowerCase().includes(trimmed) || b.tags.some((t) => t.toLowerCase().includes(trimmed)));

    setFiltered(result);
    setDisplayQuery(searchQuery);
    setSearchResultCount(result.length);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    const trimmed = tag.trim().toLowerCase();
    const result = bookmarks.filter((b) => b.title.toLowerCase().includes(trimmed) || b.description.toLowerCase().includes(trimmed) || b.tags.some((t) => t.toLowerCase().includes(trimmed)));
    setFiltered(result);
    setDisplayQuery(tag);
    setSearchResultCount(result.length);
  };

  const handleDelete = (id: number) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    setFiltered(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    if (searchResultCount !== null) {
      setSearchResultCount(filtered.filter((b) => b.id !== id).length);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/add?id=${id}`);
  };

  const handleFavoriteToggle = (id: number) => {
    const updated = bookmarks.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b));
    setBookmarks(updated);
    setFiltered((prev) => prev.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const sortedFiltered = [...filtered].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">내 북마크</h1>
          <button onClick={() => navigate("/add")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            + 새 북마크
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="검색어를 입력하세요 (제목, 설명, 태그)" className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-400 outline-none" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFiltered(bookmarks);
                  setDisplayQuery("");
                  setSearchResultCount(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            )}
          </div>

          <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            검색
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          전체 북마크 {bookmarks.length}개{searchResultCount !== null && ` / "${displayQuery}" 검색 결과 ${searchResultCount}개`}
        </p>

        {sortedFiltered.length === 0 ? (
          <p className="text-gray-500 text-center">등록된 북마크가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {sortedFiltered.map((item) => (
              <BookmarkCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} onTagClick={handleTagClick} onFavoriteToggle={handleFavoriteToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
