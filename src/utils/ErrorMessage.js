export default function errorMessage(code, msg) {
  const payload = {
    code,
    msg,
  };
  return payload;
}
