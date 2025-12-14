import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

import Input from "../components/Input";
import Textarea from "../components/Textarea";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

function AddBookmark() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    url?: string;
  }>({});

  /* 수정 모드일 경우 기존 데이터 불러오기 */
  useEffect(() => {
    if (!id || !user) return;

    const fetchBookmark = async () => {
      const { data } = await supabase.from("bookmarks").select("*").eq("id", id).single();

      if (data) {
        setTitle(data.title);
        setUrl(data.url);
        setDescription(data.description || "");
        setTags((data.tags || []).join(", "));
      }
    };

    fetchBookmark();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!url.trim()) newErrors.url = "URL을 입력해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload = {
      title,
      url,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      user_id: user?.id,
    };

    if (id) {
      await supabase.from("bookmarks").update(payload).eq("id", id);
    } else {
      await supabase.from("bookmarks").insert(payload);
    }

    navigate("/");
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-10">
      <div className="rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">{id ? "북마크 수정" : "새 북마크 추가"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} placeholder="예: React 공식 문서" />

          <Input label="URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} error={errors.url} placeholder="https://example.com" />

          <Textarea label="설명" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="이 북마크에 대한 간단한 설명" />

          <Input label="태그" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="쉼표로 구분 (예: react, frontend)" />

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            {id ? "수정 완료" : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBookmark;
