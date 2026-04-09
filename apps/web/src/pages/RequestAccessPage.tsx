export default function RequestAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-primary to-primary-dark">
      <div className="bg-surface-low p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Request Access</h1>
        <p className="mb-6 text-gray-300">
          Please contact your administrator to request access to the Cancha360
          platform.
        </p>
        <button
          onClick={() => (window.location.href = "mailto:admin@cancha360.com")}
          className="bg-primary text-[#0e0e0e] hover:bg-primary-dark py-2 px-4 rounded-lg font-bold"
        >
          Contact Administrator
        </button>
      </div>
    </div>
  );
}
