export function getErrorMessage(message?: string) {
  if (!message) return "알 수 없는 오류가 발생했습니다.";

  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }

  if (message.includes("Email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다.";
  }

  if (message.includes("Password should be at least")) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }

  if (message.includes("Invalid email")) {
    return "이메일 형식이 올바르지 않습니다.";
  }

  return "오류가 발생했습니다. 다시 시도해주세요.";
}
