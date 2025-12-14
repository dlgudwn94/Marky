import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getErrorMessage } from "../utils/errorMessages";
import { isValidEmail } from "../utils/validation";
import Input from "../components/Input";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    passwordCheck?: string;
    form?: string;
  }>({});

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!isValidEmail(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    if (password !== passwordCheck) {
      newErrors.passwordCheck = "비밀번호가 서로 일치하지 않습니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrors({
        form: getErrorMessage(error.message),
      });
      return;
    }

    alert("회원가입이 완료되었습니다! 로그인해주세요.");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

          <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

          <Input label="비밀번호 확인" type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} error={errors.passwordCheck} />

          {errors.form && <div className="mb-4 rounded-lg text-sm text-red-600">{errors.form}</div>}

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
