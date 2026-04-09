export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-primary to-primary-dark">
      <div className="bg-surface-low p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="mb-6 text-gray-300">
          Please contact your administrator to reset your password for the
          Cancha360 platform.
        </p>
        <button
          onClick={() => (window.location.href = "mailto:admin@cancha360.com")}
          className="bg-primary text-[#0e0e0e] py-2 px-4 rounded-lg font-bold hover:opacity-80 transition-opacity"
        >
          Contact Administrator
        </button>
      </div>
    </div>
  );
}
