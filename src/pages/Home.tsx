import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import BookmarkCard from "../components/BookmarkCard";
import { useNavigate } from "react-router-dom";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      const { data } = await supabase.from("bookmarks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setBookmarks(data || []);
      setSearchResults(data || []);
    };

    fetchBookmarks();

    const channel = supabase
      .channel("public:bookmarks")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${user.id}` }, (payload) => {
        fetchBookmarks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDelete = async (id: number) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const handleSearch = () => {
    let filtered = bookmarks;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = bookmarks.filter((b) => b.title.toLowerCase().includes(term) || b.description.toLowerCase().includes(term) || b.tags.some((tag) => tag.toLowerCase().includes(term)));
    }
    if (filterTag) {
      filtered = filtered.filter((b) => b.tags.includes(filterTag));
    }
    setSearchResults(filtered);
  };

  const handleTagClick = (tag: string) => {
    setFilterTag(tag);
    const filtered = bookmarks.filter((b) => b.tags.includes(tag));
    setSearchResults(filtered);
  };

  const clearFilter = () => {
    setFilterTag(null);
    setSearchResults(bookmarks);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="검색어를 입력하고 엔터"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          검색
        </button>
        <button onClick={() => navigate("/add")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          새 북마크
        </button>
      </div>

      {filterTag && (
        <div className="mb-4">
          <span className="text-sm text-gray-500 mr-2">태그 필터:</span>
          <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded mr-2">{filterTag}</span>
          <button onClick={clearFilter} className="text-sm text-red-500 underline">
            지우기
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {searchResults.map((bookmark) => (
          <BookmarkCard key={bookmark.id} item={bookmark} onDelete={handleDelete} onEdit={(id) => navigate(`/add?id=${id}`)} onTagClick={handleTagClick} />
        ))}
      </div>
    </div>
  );
}

export default Home;
