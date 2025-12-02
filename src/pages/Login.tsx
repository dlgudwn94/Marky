import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errorMessages";
import { isValidEmail } from "../utils/validation";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(getErrorMessage(error.message));
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none" />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            로그인
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
