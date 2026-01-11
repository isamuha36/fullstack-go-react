import { useState, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router"; // biasanya dari "react-router-dom"
import axios from "axios";
import type { AxiosError } from "axios";

import { useRegister } from "../../hooks/auth/useRegister";

type RegisterFields = "name" | "username" | "email" | "password";

// Laravel biasanya array string per field
type ApiFieldErrors = Partial<Record<RegisterFields, string[]>>;

// Ini yang kamu simpan untuk ditampilkan (string tunggal per field)
type UiFieldErrors = Partial<Record<RegisterFields, string>>;

type RegisterErrorResponse = {
  message?: string;
  errors?: ApiFieldErrors;
};

const pickFirstError = (errs?: ApiFieldErrors): UiFieldErrors => {
  if (!errs) return {};
  const out: UiFieldErrors = {};
  for (const key of Object.keys(errs) as RegisterFields[]) {
    const v = errs[key];
    if (v && v.length > 0) out[key] = v[0];
  }
  return out;
};

const Register: FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<UiFieldErrors>({});

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    mutate(
      { name, username, email, password },
      {
        onSuccess: () => navigate("/login"),
        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            const err = error as AxiosError<RegisterErrorResponse>;
            setErrors(pickFirstError(err.response?.data?.errors));
            return;
          }

          // fallback kalau bukan AxiosError
          setErrors({});
        },
      }
    );
  };

  return (
    <div className="row justify-content-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold text-center">REGISTER</h4>
              <hr />
              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="mb-1 fw-bold">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        placeholder="Full Name"
                      />
                      {errors.name && (
                        <div className="alert alert-danger mt-2 rounded-4">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form-group">
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="mb-1 fw-bold">Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Email Address"
                      />
                      {errors.email && (
                        <div className="alert alert-danger mt-2 rounded-4">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <div className="form-group">
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
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-4"
                  disabled={isPending}
                >
                  {isPending ? "Loading..." : "REGISTER"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
