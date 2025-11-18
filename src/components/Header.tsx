// src/components/Header.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-indigo-600 text-white">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        Marky
      </h1>
      {user && (
        <button onClick={handleLogout} className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100 transition">
          로그아웃
        </button>
      )}
    </header>
  );
};

export default Header;
