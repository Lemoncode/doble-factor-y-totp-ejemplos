import { useNavigate } from "react-router-dom";

export const Setup2FAPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            Configurar autenticación de dos factores
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Esta página te permitirá configurar la autenticación de dos factores
            para mayor seguridad.
          </p>

          <div className="card-actions justify-center mt-4">
            <button onClick={handleBack} className="btn btn-outline">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
