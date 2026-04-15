import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BrandLogo } from "../components/BrandLogo";
import { Card } from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../services/helpers";

const loginInitial = {
  email: "",
  password: ""
};

const registerInitial = {
  name: "",
  email: "",
  age: "",
  motivation: "",
  password: ""
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [error, setError] = useState("");

  useDocumentMeta({
    title: "Login | JSD Alcochete",
    description: "Acede à área de membros da JSD Alcochete ou cria a tua conta.",
    keywords: "login JSD Alcochete, área de membros"
  });

  const handleLogin = (event) => {
    event.preventDefault();
    const response = login(loginForm.email, loginForm.password);

    if (!response.ok) {
      setError(response.error);
      return;
    }

    navigate("/dashboard");
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const response = register(registerForm);

    if (!response.ok) {
      setError(response.error);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <section className="section-shell">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden border-jsd-orange/15 bg-gradient-to-br from-jsd-orange to-[#c56400] p-0 text-white">
            <div className="space-y-6 p-8 md:p-10">
              <BrandLogo textTone="light" imageClassName="h-20 w-20 sm:h-20 sm:w-20" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Área de membros</p>
                <h1 className="mt-3 font-display text-4xl font-bold">Acesso reservado</h1>
                <p className="mt-4 text-sm leading-7 text-white/78">
                  Entra na área reservada para acompanhar a tua participação, editar perfil e aceder a funcionalidades internas.
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-jsd-orange/12 bg-[#fff8ef]">
            <p className="text-sm leading-7 text-jsd-black/72 dark:text-white/72">
              Conta demo admin: <strong>admin@jsdalcochete.pt</strong> / <strong>admin123</strong>
            </p>
          </Card>
        </div>

        <Card className="space-y-6 border-jsd-orange/12">
          <div className="flex gap-3 rounded-full bg-[#fff8ef] p-2 dark:bg-white/5">
            <button type="button" onClick={() => setMode("login")} className={cn("flex-1 rounded-full px-4 py-3 text-sm font-semibold transition", mode === "login" ? "bg-jsd-blue text-white" : "text-jsd-blue-dark dark:text-white")}>
              Login
            </button>
            <button type="button" onClick={() => setMode("register")} className={cn("flex-1 rounded-full px-4 py-3 text-sm font-semibold transition", mode === "register" ? "bg-jsd-orange text-jsd-black" : "text-jsd-blue-dark dark:text-white")}>
              Registo
            </button>
          </div>

          {error && <div className="rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-900 dark:bg-red-500/10 dark:text-red-100">{error}</div>}

          {mode === "login" ? (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="login-email" className="label">Email</label>
                <input id="login-email" type="email" className="input" value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} required />
              </div>
              <div className="field">
                <label htmlFor="login-password" className="label">Palavra-passe</label>
                <input id="login-password" type="password" className="input" value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary w-full">Entrar</button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="field">
                <label htmlFor="register-name" className="label">Nome</label>
                <input id="register-name" className="input" value={registerForm.name} onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))} required />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="field">
                  <label htmlFor="register-email" className="label">Email</label>
                  <input id="register-email" type="email" className="input" value={registerForm.email} onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))} required />
                </div>
                <div className="field">
                  <label htmlFor="register-age" className="label">Idade</label>
                  <input id="register-age" type="number" min="14" max="35" className="input" value={registerForm.age} onChange={(event) => setRegisterForm((current) => ({ ...current, age: event.target.value }))} required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="register-motivation" className="label">Motivação</label>
                <textarea id="register-motivation" className="textarea" value={registerForm.motivation} onChange={(event) => setRegisterForm((current) => ({ ...current, motivation: event.target.value }))} required />
              </div>
              <div className="field">
                <label htmlFor="register-password" className="label">Palavra-passe</label>
                <input id="register-password" type="password" className="input" value={registerForm.password} onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary w-full">Criar conta</button>
            </form>
          )}

          <p className="text-center text-sm text-jsd-black/65 dark:text-white/65">
            Ainda estás a explorar? <Link to="/junta-te" className="font-semibold text-jsd-orange">Preenche o pedido de adesão</Link>.
          </p>
        </Card>
      </div>
    </section>
  );
}
