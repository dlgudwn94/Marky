import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getErrorMessage } from "../utils/errorMessages";
import { isValidEmail } from "../utils/validation";
import Input from "../components/Input";

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isValidEmail(email)) {
      setErrors({ email: "올바른 이메일 형식을 입력해주세요." });
      return;
    }

    if (!password) {
      setErrors({ password: "비밀번호를 입력해주세요." });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors({
        form: getErrorMessage(error.message),
      });
      return;
    }

    navigate("/");
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

          <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

          {errors.form && <div className="mb-4 rounded-lg text-sm text-red-600">{errors.form}</div>}

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
