import { Link } from "react-router-dom";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-4">
            Login
          </h2>
          <form>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Iniciar sesión
              </button>
            </div>
          </form>
          <div className="divider">O</div>
          <div className="text-center">
            <Link to="/signup" className="link link-primary">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
