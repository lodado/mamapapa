export const strictValidateInput = (value: string) => {
  const regex = /^[^\s~!@#$%^&*()+=<>?:"{}|\\[\]\\;'/]*$/;
  if (!regex.test(value)) {
    return true;
  }
  return false;
};

export const validateInput = (value: string, allowComma = false) => {
  // 금지할 문자에서 \s를 제거하고, 스페이스를 제외한 다른 공백 문자를 명시적으로 제외합니다.
  const disallowedWhitespace = "\t\r\n\f\v";

  const regex = allowComma
    ? new RegExp(`^[^${disallowedWhitespace}~\`!@#$%^&*()+=<>?:"{}|\\\\[\\]\\\\;'/]*$`)
    : new RegExp(`^[^${disallowedWhitespace}~\`!@#$%^&*()+=,<>.?:"{}|\\\\[\\]\\\\;'/]*$`);

  // 입력 값이 정규식에 맞지 않으면 true 반환 (유효하지 않음)
  return !regex.test(value);
};
