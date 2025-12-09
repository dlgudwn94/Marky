import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

function AddBookmark() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (id && user) {
      const fetchBookmark = async () => {
        const { data } = await supabase.from("bookmarks").select("*").eq("id", id).eq("user_id", user.id).single();
        if (data) {
          setTitle(data.title);
          setUrl(data.url);
          setDescription(data.description);
          setTags(data.tags.join(", "));
        }
      };
      fetchBookmark();
    }
  }, [id, user]);

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!isValidUrl(url)) {
      alert("올바른 URL을 입력해주세요.");
      return;
    }

    const bookmark = {
      title,
      url,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      user_id: user.id,
    };

    if (id) {
      await supabase.from("bookmarks").update(bookmark).eq("id", id);
    } else {
      await supabase.from("bookmarks").insert(bookmark);
    }

    navigate("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 flex justify-center items-center px-4 py-10">
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
