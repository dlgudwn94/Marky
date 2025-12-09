import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getErrorMessage } from "../utils/errorMessages";
import { isValidEmail } from "../utils/validation";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password !== passwordCheck) {
      return setError("비밀번호가 서로 일치하지 않습니다.");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(getErrorMessage(error.message));
      return;
    }

    alert("회원가입이 완료되었습니다! 로그인해주세요.");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">비밀번호 확인</label>
            <input type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
