import LoginForm from "../components/LoginForm";
import logo from "../assets/atom.png";

const APP_TITLE = "audio-hosting-app";
const DISCLAIMER =
  "This is an assessment project for demonstration purposes only and is not an official product.";
const FOOTER = "Developed by KX.";

export default function Login({ onLogin, showConsoleMessage }) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-purple-900">
      <section className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center w-full max-w-md">
        <img src={logo} alt="Logo" className="w-24 h-24 mb-6" />
        <h1 className="text-3xl font-bold mb-8 text-purple-700 tracking-wide uppercase">
          {APP_TITLE}
        </h1>
        <LoginForm onLogin={onLogin} showConsoleMessage={showConsoleMessage} />
        <div className="mt-6 text-center text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded p-3">
          {DISCLAIMER}
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          {FOOTER}
        </div>
      </section>
    </main>
  );
}