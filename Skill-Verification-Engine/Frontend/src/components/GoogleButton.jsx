export default function GoogleButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5005/api/auth/google";
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
    >
      Continue with Google
    </button>
  );
}
