import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Setup2FAPage = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Obtener userId del localStorage
        const userDataStr = localStorage.getItem("user");
        const userData = userDataStr ? JSON.parse(userDataStr) : null;

        if (!userData || !userData.id) {
          setError("No se encontró información del usuario");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/2fa/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al generar el código QR");
        }

        setQrCode(data.data.qrCode);
        setSecret(data.data.secret);
      } catch (err: any) {
        setError(err.message || "Error al generar el código QR");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, []);

  const handleBack = () => {
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            Configurar autenticación de dos factores
          </h2>

          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && qrCode && (
            <>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Escanea este código QR con tu aplicación de autenticación
                  (Google Authenticator, Authy, etc.)
                </p>

                <div className="flex justify-center bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                </div>

                <div className="divider">O</div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Introduce manualmente este código:
                  </p>
                  <div className="bg-base-200 p-3 rounded text-center font-mono text-sm break-all">
                    {secret}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="card-actions justify-center mt-6">
            <button onClick={handleBack} className="btn btn-outline">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
