import LoginForm from "../components/LoginForm";
import HTXLogo from "../assets/atom.png";

export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-purple-900">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center w-full max-w-md">
        <img src={HTXLogo} alt="HTX Logo" className="w-24 h-24 mb-6" />
        <h1 className="text-3xl font-bold mb-8 text-purple-700 tracking-wide uppercase">
          audio-hosting-app
        </h1>
        <LoginForm onLogin={onLogin} />
        <div className="mt-6 text-center text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded p-3">
          This is an assessment project for demonstration purposes only and is not
          an official product.
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          Developed by KX for assessment purposes.
        </div>
      </div>
    </div>
  );
}