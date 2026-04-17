import { useState } from "react";

import { BrandLogo } from "../components/BrandLogo";
import { Card } from "../components/Card";
import { ScrollReveal } from "../components/ScrollReveal";
import { useApp } from "../context/AppContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { allDistricts, portugalData } from "../data/portugal";

const professionalStatusOptions = [
  "Não especificado",
  "Estudante",
  "Trabalhador por conta de outrem",
  "Trabalhador independente",
  "Desempregado",
  "Estudante-Trabalhador"
];

const initialForm = {
  fullName: "",
  citizenCardNumber: "",
  birthDate: "",
  street: "",
  doorNumber: "",
  floor: "",
  parish: "",
  postalCode: "",
  council: "",
  district: "",
  email: "",
  mobile: "",
  phone: "",
  professionalStatus: "Não especificado",
  registrationDistrict: "",
  registrationCouncil: "",
  referencedBy: "",
  documentFrontName: "",
  documentFrontType: "",
  documentFrontSize: 0,
  documentFrontUri: null,
  documentBackName: "",
  documentBackType: "",
  documentBackSize: 0,
  documentBackUri: null
};

export function JoinPage() {
  const [form, setForm] = useState(initialForm);
  const { submitJoinRequest } = useApp();

  useDocumentMeta({
    title: "Tornar Militante | JSD Alcochete",
    description: "Submete o teu registo com o formulário completo de adesão à JSD Alcochete.",
    keywords: "tornar militante JSD Alcochete, registo, adesão, formulário"
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setForm((current) => {
      const nextState = { ...current, [name]: value };
      
      if (name === "district") {
        nextState.council = "";
      }
      if (name === "registrationDistrict") {
        nextState.registrationCouncil = "";
      }
      
      return nextState;
    });
  };

  const handleFileChange = (event, side) => {
    const file = event.target.files?.[0];
    if (!file) {
      setForm((current) => ({ ...current, [`document${side}Name`]: "", [`document${side}Type`]: "", [`document${side}Size`]: 0, [`document${side}Uri`]: null }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("O ficheiro deve ter menos de 2MB para não exceder o limite atual do browser.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((current) => ({
        ...current,
        [`document${side}Name`]: file.name,
        [`document${side}Type`]: file.type,
        [`document${side}Size`]: file.size,
        [`document${side}Uri`]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    submitJoinRequest({
      name: form.fullName,
      citizenCardNumber: form.citizenCardNumber,
      birthDate: form.birthDate,
      street: form.street,
      doorNumber: form.doorNumber,
      floor: form.floor,
      parish: form.parish,
      postalCode: form.postalCode,
      council: form.council,
      district: form.district,
      email: form.email,
      mobile: form.mobile,
      phone: form.phone,
      professionalStatus: form.professionalStatus,
      registrationCouncil: form.registrationCouncil,
      referencedBy: form.referencedBy,
      documentFrontName: form.documentFrontName,
      documentFrontType: form.documentFrontType,
      documentFrontSize: form.documentFrontSize,
      documentFrontUri: form.documentFrontUri,
      documentBackName: form.documentBackName,
      documentBackType: form.documentBackType,
      documentBackSize: form.documentBackSize,
      documentBackUri: form.documentBackUri
    });

    event.currentTarget.reset();
    setForm(initialForm);
  };

  return (
    <section className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
        <ScrollReveal className="space-y-6">
          <Card className="overflow-hidden border-jsd-orange/15 bg-gradient-to-br from-jsd-orange to-[#c56400] p-0 text-white">
            <div className="space-y-6 p-8 md:p-10">
              <BrandLogo textTone="light" imageClassName="h-20 w-20 sm:h-24 sm:w-24" />
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Tornar Militante</p>
                <h1 className="font-display text-4xl font-bold md:text-5xl">Submeter Registo</h1>
                <p className="max-w-xl text-sm leading-7 text-white/78">
                  Preenche o formulário completo de adesão com os teus dados pessoais, morada, contactos e documento de identificação.
                </p>
              </div>
              <div className="flex justify-center pt-8">
                <img
                  src="/jsd-logo.jpg"
                  alt="Logótipo JSD"
                  className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 rounded-full object-cover shadow-sm"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <p className="eyebrow">Informação</p>
            <div className="grid gap-4">
              {[
                "Usa dados verdadeiros e atualizados para validação interna.",
                "O carregamento do documento fica guardado em modo simulado com nome e metadados do ficheiro.",
                "O pedido entra diretamente no painel interno com estado e histórico de submissão."
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-[#fff8ef] p-4 text-sm leading-7 text-jsd-black/72">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <Card as="form" onSubmit={handleSubmit} className="space-y-8 border-jsd-orange/15">
            <div>
              <h2 className="font-display text-3xl font-bold text-jsd-blue-dark dark:text-white">Formulário de Adesão</h2>
              <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">
                Preenche todos os campos obrigatórios para avançar com o pedido.
              </p>
            </div>

            <section className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">Informação Pessoal</h3>
                <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">Dados pessoais básicos e identificação</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="field md:col-span-2">
                  <label htmlFor="fullName" className="label">Introduza o seu nome completo</label>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="citizenCardNumber" className="label">Introduza o número do cartão de cidadão</label>
                  <input id="citizenCardNumber" name="citizenCardNumber" value={form.citizenCardNumber} onChange={handleChange} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="birthDate" className="label">Selecione uma data</label>
                  <input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} className="input" required />
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">Informação de Morada</h3>
                <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">Detalhes da sua morada residencial</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="field md:col-span-2">
                  <label htmlFor="street" className="label">Nome da rua</label>
                  <input id="street" name="street" value={form.street} onChange={handleChange} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="doorNumber" className="label">Número</label>
                  <input id="doorNumber" name="doorNumber" value={form.doorNumber} onChange={handleChange} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="floor" className="label">Andar</label>
                  <input id="floor" name="floor" value={form.floor} onChange={handleChange} className="input" />
                </div>
                <div className="field">
                  <label htmlFor="parish" className="label">Freguesia</label>
                  <input id="parish" name="parish" value={form.parish} onChange={handleChange} className="input" required />
                </div>
                <div className="field">
                  <label htmlFor="postalCode" className="label">Código postal</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="input"
                    placeholder="0000-000"
                    pattern="[0-9]{4}-[0-9]{3}"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="district" className="label">Distrito</label>
                  <select id="district" name="district" value={form.district} onChange={handleChange} className="input" required>
                    <option value="">Selecione o distrito</option>
                    {allDistricts.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="council" className="label">Concelho</label>
                  <select id="council" name="council" value={form.council} onChange={handleChange} className="input" required disabled={!form.district}>
                    <option value="">Selecione o concelho</option>
                    {(form.district ? portugalData[form.district] : []).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">Informação de Contacto</h3>
                <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">Como podemos contactá-lo</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="field md:col-span-2">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="mobile" className="label">Telemóvel</label>
                  <input id="mobile" name="mobile" value={form.mobile} onChange={handleChange} className="input" placeholder="+351 900 000 000" required />
                </div>
                <div className="field">
                  <label htmlFor="phone" className="label">Telefone</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+351 200 000 000" />
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">Situação Profissional/Académica</h3>
                <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">O seu estatuto profissional ou académico atual</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="field">
                  <label htmlFor="professionalStatus" className="label">Estado atual</label>
                  <select id="professionalStatus" name="professionalStatus" value={form.professionalStatus} onChange={handleChange} className="input">
                    {professionalStatusOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="registrationDistrict" className="label">Distrito de Registo</label>
                  <select id="registrationDistrict" name="registrationDistrict" value={form.registrationDistrict} onChange={handleChange} className="input" required>
                    <option value="">Selecione o distrito</option>
                    {allDistricts.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="registrationCouncil" className="label">Concelho de Registo</label>
                  <select id="registrationCouncil" name="registrationCouncil" value={form.registrationCouncil} onChange={handleChange} className="input" required disabled={!form.registrationDistrict}>
                    <option value="">Selecione o concelho</option>
                    {(form.registrationDistrict ? portugalData[form.registrationDistrict] : []).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="field md:col-span-2">
                  <label htmlFor="referencedBy" className="label">Nome do membro que o referenciou</label>
                  <input id="referencedBy" name="referencedBy" value={form.referencedBy} onChange={handleChange} className="input" />
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">Carregamento de Documentos</h3>
                <p className="mt-2 text-sm text-jsd-black/65 dark:text-white/65">Carregue as duas frentes do cartão de cidadão</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-jsd-orange/35 bg-[#fff8ef] px-6 py-8 text-center transition hover:border-jsd-orange hover:bg-[#fff3df]">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(e, "Front")} required />
                  <span className="font-display text-xl font-bold text-jsd-blue-dark">Frente do CC</span>
                  <span className="text-sm text-jsd-black/60">
                    {form.documentFrontName || "PDF, JPG ou PNG"}
                  </span>
                </label>
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-jsd-orange/35 bg-[#fff8ef] px-6 py-8 text-center transition hover:border-jsd-orange hover:bg-[#fff3df]">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(e, "Back")} required />
                  <span className="font-display text-xl font-bold text-jsd-blue-dark">Verso do CC</span>
                  <span className="text-sm text-jsd-black/60">
                    {form.documentBackName || "PDF, JPG ou PNG"}
                  </span>
                </label>
              </div>
            </section>

            <button type="submit" className="btn-primary w-full py-4 text-base">
              Submeter Registo
            </button>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
