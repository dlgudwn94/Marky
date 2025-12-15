import React from "react";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

interface Props {
  item: BookmarkItem;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onTagClick: (tag: string) => void;
}

function BookmarkCard({ item, onDelete, onEdit, onTagClick }: Props) {
  return (
    <div className="dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-md transition h-full">
      <div>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-indigo-500 hover:underline">
          {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
        </a>
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-2 line-clamp-3">{item.description}</p>
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className="text-xs bg-indigo-100 text-indigo-600  px-2 py-1 rounded-md cursor-pointer" onClick={() => onTagClick(tag)}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={() => onEdit(item.id)} className="text-black-500 hover:text-indigo-700 text-sm font-medium">
          수정
        </button>
        <button onClick={() => onDelete(item.id)} className="text-black-500 hover:text-indigo-700 text-sm font-medium">
          삭제
        </button>
      </div>
    </div>
  );
}

export default BookmarkCard;
