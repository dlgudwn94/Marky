import React from "react";
import { Plus } from "lucide-react";

const Home = () => {
  const bookmarks = [
    {
      id: 1,
      title: "Vite 공식 문서",
      url: "https://vitejs.dev",
      description: "빠르고 현대적인 프론트엔드 빌드 툴",
      tag: "Frontend",
    },
    {
      id: 2,
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      description: "Utility-first CSS 프레임워크",
      tag: "Design",
    },
    {
      id: 3,
      title: "React.dev",
      url: "https://react.dev",
      description: "React 공식 문서",
      tag: "Library",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📑 Marky</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          <Plus size={18} />
          Add Bookmark
        </button>
      </header>

      {/* Bookmark List */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((b) => (
          <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition block">
            <h2 className="text-xl font-semibold mb-2">{b.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{b.description}</p>
            <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{b.tag}</span>
          </a>
        ))}
      </main>
    </div>
  );
};

export default Home;
