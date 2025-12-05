import { Link } from "react-router-dom";

export const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-4">
            Registro
          </h2>
          <p className="text-center text-gray-500">
            Formulario de registro (en construcción)
          </p>
          <div className="divider"></div>
          <div className="text-center">
            <Link to="/login" className="link link-primary">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
