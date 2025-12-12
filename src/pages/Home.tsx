import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import BookmarkCard from "../components/BookmarkCard";
import { useNavigate } from "react-router-dom";
import { Search, BookmarkPlus } from "lucide-react";

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
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="검색어를 입력해 주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button onClick={handleSearch} className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </button>

          <button onClick={() => navigate("/add")} className="p-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
            <BookmarkPlus className="w-5 h-5" />
          </button>
        </div>
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
