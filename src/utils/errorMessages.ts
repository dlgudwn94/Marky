export const getErrorMessage = (message: string): string => {
  switch (message) {
    case "Invalid login credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "Email not confirmed":
      return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.";
    case "User not found":
      return "존재하지 않는 계정입니다.";
    case "Password should be at least 6 characters":
      return "비밀번호는 최소 6자 이상이어야 합니다.";
    case "User already registered":
      return "이미 가입된 이메일입니다.";
    case "Invalid email":
      return "올바른 이메일 형식이 아닙니다.";
    default:
      return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
