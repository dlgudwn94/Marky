import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X } from "lucide-react";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between relative">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Marky
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/" className="hover:text-indigo-500">
                홈
              </Link>
              <Link to="/add" className="hover:text-indigo-500">
                추가
              </Link>
              <Link to="/settings" className="hover:text-indigo-500">
                설정
              </Link>
              <button onClick={handleLogout} className="hover:text-indigo-500">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-500">
                로그인
              </Link>
              <Link to="/signup" className="hover:text-indigo-500">
                회원가입
              </Link>
            </>
          )}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* 모바일 드롭다운 메뉴 */}
        {open && (
          <div className="absolute top-full right-4 mt-2 w-40 bg-white shadow-xl rounded-lg py-2 flex flex-col md:hidden animate-fade-in">
            {user ? (
              <>
                <Link to="/" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-gray-100">
                  홈
                </Link>
                <Link to="/add" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-gray-100">
                  추가
                </Link>
                <Link to="/settings" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-gray-100">
                  설정
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-gray-100">
                  로그인
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-gray-100">
                  회원가입
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
