import { useNavigate } from "react-router-dom";

export const WelcomePage = () => {
  const navigate = useNavigate();

  // Obtener datos del usuario del localStorage
  const userDataStr = localStorage.getItem("user");
  const userData = userDataStr ? JSON.parse(userDataStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-3xl mb-4">
            ¡Bienvenido! 🎉
          </h2>

          {userData && (
            <div className="space-y-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-24">
                  <span className="text-3xl">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold">{userData.name}</h3>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          )}

          <div className="divider"></div>

          <p className="text-sm text-gray-600">
            Has iniciado sesión exitosamente
          </p>

          <div className="card-actions justify-center mt-4 flex-col gap-2">
            {!userData?.twoFactorEnabled && (
              <button
                onClick={() => navigate("/setup-2fa")}
                className="btn btn-primary"
              >
                Configurar autenticación de dos factores
              </button>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
