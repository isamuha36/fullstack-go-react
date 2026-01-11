import { type FC, useState, useContext, type FormEvent } from "react";
import { useNavigate } from "react-router"; // biasanya dari "react-router-dom"

import { useLogin } from "../../hooks/auth/useLogin";
import Cookies from "js-cookie";

import axios from "axios";
import type { AxiosError } from "axios";

import { AuthContext } from "../../context/AuthContext";

type LoginFields = "username" | "password" | "error";

// untuk UI (string tunggal per field)
type UiErrors = Partial<Record<LoginFields, string>>;

// untuk API (Laravel biasa array string)
type ApiErrors = Partial<Record<Exclude<LoginFields, "error">, string[]>> & {
  error?: string[]; // kalau backend ngirim general error
};

type LoginSuccessPayload = {
  token: string;
  id: number;
  name: string;
  username: string;
  email: string;
};

type LoginSuccessResponse = {
  data: LoginSuccessPayload;
};

type LoginErrorResponse = {
  message?: string;
  errors?: ApiErrors;
};

const pickFirstError = (errs?: ApiErrors): UiErrors => {
  if (!errs) return {};
  const out: UiErrors = {};

  if (errs.username?.[0]) out.username = errs.username[0];
  if (errs.password?.[0]) out.password = errs.password[0];

  // general error (opsional)
  if (errs.error?.[0]) out.error = errs.error[0];

  return out;
};

export const Login: FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();

  const { setIsAuthenticated } = useContext(AuthContext)!;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<UiErrors>({});

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    mutate(
      { username, password },
      {
        onSuccess: (result: unknown) => {
          // Narrowing hasil mutate
          const res = result as LoginSuccessResponse;
          const payload = res.data;

          Cookies.set("token", payload.token);

          Cookies.set(
            "user",
            JSON.stringify({
              id: payload.id,
              name: payload.name,
              username: payload.username,
              email: payload.email,
            })
          );

          setIsAuthenticated(true);
          navigate("/admin/dashboard");
        },

        onError: (error: unknown) => {
          // reset dulu biar ga nyangkut
          setErrors({});

          if (axios.isAxiosError(error)) {
            const err = error as AxiosError<LoginErrorResponse>;
            const apiErrors = err.response?.data?.errors;

            // kalau backend cuma balikin 401 tanpa errors
            if (!apiErrors) {
              setErrors({ error: "Username or Password is incorrect" });
              return;
            }

            setErrors(pickFirstError(apiErrors));
            return;
          }

          // fallback kalau bukan AxiosError
          setErrors({ error: "Something went wrong. Please try again." });
        },
      }
    );
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body">
            <h4 className="fw-bold text-center">LOGIN</h4>
            <hr />

            {errors.error && (
              <div className="alert alert-danger mt-2 rounded-4">
                {errors.error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <label className="mb-1 fw-bold">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Username"
                />
                {errors.username && (
                  <div className="alert alert-danger mt-2 rounded-4">
                    {errors.username}
                  </div>
                )}
              </div>

              <div className="form-group mb-3">
                <label className="mb-1 fw-bold">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="alert alert-danger mt-2 rounded-4">
                    {errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-4"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "LOGIN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
