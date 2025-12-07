import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Setup2FAPage = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);

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
        setShowVerification(true);
      } catch (err: any) {
        setError(err.message || "Error al generar el código QR");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, []);

  const handleEnableVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const userDataStr = localStorage.getItem("user");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;

      const response = await fetch("/api/2fa/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Código incorrecto");
        setVerifying(false);
        return;
      }

      // Actualizar el estado del usuario en localStorage
      const updatedUser = { ...userData, twoFactorEnabled: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Redirigir a welcome
      navigate("/welcome");
    } catch (err: any) {
      setError(err.message || "Error al habilitar 2FA");
      setVerifying(false);
    }
  };

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

                {showVerification && (
                  <>
                    <div className="divider">Verifica tu configuración</div>
                    <form onSubmit={handleEnableVerification}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Introduce el código de 6 dígitos de tu app
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="000000"
                          className="input input-bordered text-center text-2xl tracking-widest"
                          value={verificationCode}
                          onChange={(e) =>
                            setVerificationCode(
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          maxLength={6}
                          required
                        />
                      </div>

                      <div className="form-control mt-4">
                        <button
                          type="submit"
                          className={`btn btn-primary ${
                            verifying ? "loading" : ""
                          }`}
                          disabled={verifying || verificationCode.length !== 6}
                        >
                          {verifying ? "Verificando..." : "Habilitar 2FA"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
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
