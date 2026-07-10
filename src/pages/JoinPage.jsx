import { useState } from "react";
import { motion } from "framer-motion";

import { BrandLogo } from "../components/BrandLogo";
import { Card } from "../components/Card";
import { PageBanner } from "../components/PageBanner";
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
      setForm((current) => ({
        ...current,
        [`document${side}Name`]: "",
        [`document${side}Type`]: "",
        [`document${side}Size`]: 0,
        [`document${side}Uri`]: null
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("O ficheiro deve ter menos de 10MB para poder ser anexado.");
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
      fullName: form.fullName,
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
      registrationDistrict: form.registrationDistrict,
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
    <>
      <PageBanner
        label="Tornar Militante"
        title="Submeter o teu registo"
        description="Preenche o formulário completo de adesão com os teus dados pessoais, morada, contactos e documento de identificação."
      />

      <section className="section-shell pt-0">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          <ScrollReveal className="space-y-6">
            <Card className="overflow-hidden border border-jsd-orange/20 bg-white/[0.03] p-0">
              <div className="space-y-6 p-8 md:p-10">
                <BrandLogo textTone="light" imageClassName="h-16 w-16 sm:h-20 sm:w-20" />
                <div className="space-y-4">
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.25em] text-jsd-orange border border-jsd-orange/20 bg-jsd-orange/10 px-3 py-1">
                    MUDANÇA AUTÁRQUICA
                  </span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight uppercase text-white">
                    Junta-te à estrutura
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-white/70">
                    Dá o primeiro passo e vem fazer parte do núcleo juvenil mais ativo do concelho.
                  </p>
                </div>
                <div className="flex justify-center pt-4">
                  <img
                    src="/jsd-logo.jpg"
                    alt="Logótipo JSD"
                    className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 border border-white/10 object-cover"
                  />
                </div>
              </div>
            </Card>

            <Card className="space-y-4 border border-white/10 bg-white/[0.02]">
              <p className="eyebrow">Informação</p>
              <div className="grid gap-4">
                {[
                  "Usa dados verdadeiros e atualizados para validação interna.",
                  "O carregamento do documento fica guardado em modo simulado com nome e metadados do ficheiro.",
                  "O pedido entra diretamente no painel interno com estado e histórico de submissão."
                ].map((item) => (
                  <div key={item} className="border border-white/5 bg-white/[0.01] p-4 text-sm leading-relaxed text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card as="form" onSubmit={handleSubmit} className="space-y-8 border border-white/10 bg-white/[0.02] p-8 md:p-12">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-white uppercase tracking-tight">
                  Formulário de Adesão
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Preenche todos os campos obrigatórios para avançar com o pedido.
                </p>
              </div>

              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Informação Pessoal</h3>
                  <p className="text-xs text-white/50">Dados pessoais básicos e identificação</p>
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

              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Informação de Morada</h3>
                  <p className="text-xs text-white/50">Detalhes da sua morada residencial</p>
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
                        <option key={option} className="bg-[#080401]">{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="council" className="label">Concelho</label>
                    <select id="council" name="council" value={form.council} onChange={handleChange} className="input" required disabled={!form.district}>
                      <option value="">Selecione o concelho</option>
                      {(form.district ? portugalData[form.district] : []).map((option) => (
                        <option key={option} className="bg-[#080401]">{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Informação de Contacto</h3>
                  <p className="text-xs text-white/50">Como podemos contactá-lo</p>
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

              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Situação Profissional/Académica</h3>
                  <p className="text-xs text-white/50">O seu estatuto profissional ou académico atual</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="field">
                    <label htmlFor="professionalStatus" className="label">Estado atual</label>
                    <select id="professionalStatus" name="professionalStatus" value={form.professionalStatus} onChange={handleChange} className="input">
                      {professionalStatusOptions.map((option) => (
                        <option key={option} className="bg-[#080401]">{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="registrationDistrict" className="label">Distrito de Registo</label>
                    <select id="registrationDistrict" name="registrationDistrict" value={form.registrationDistrict} onChange={handleChange} className="input" required>
                      <option value="">Selecione o distrito</option>
                      {allDistricts.map((option) => (
                        <option key={option} className="bg-[#080401]">{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="registrationCouncil" className="label">Concelho de Registo</label>
                    <select id="registrationCouncil" name="registrationCouncil" value={form.registrationCouncil} onChange={handleChange} className="input" required disabled={!form.registrationDistrict}>
                      <option value="">Selecione o concelho</option>
                      {(form.registrationDistrict ? portugalData[form.registrationDistrict] : []).map((option) => (
                        <option key={option} className="bg-[#080401]">{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field md:col-span-2">
                    <label htmlFor="referencedBy" className="label">Nome do membro que o referenciou</label>
                    <input id="referencedBy" name="referencedBy" value={form.referencedBy} onChange={handleChange} className="input" />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Carregamento de Documentos</h3>
                  <p className="text-xs text-white/50">Carregue as duas frentes do cartão de cidadão</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label htmlFor="ccFront" className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-white/10 bg-white/[0.02] px-6 py-8 text-center transition hover:border-jsd-orange hover:bg-white/[0.05]">
                    <input id="ccFront" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(e, "Front")} required />
                    <span className="font-display text-lg font-bold text-white">Frente do CC</span>
                    <span className="text-xs text-white/50">{form.documentFrontName || "PDF, JPG ou PNG"}</span>
                  </label>
                  <label htmlFor="ccBack" className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-white/10 bg-white/[0.02] px-6 py-8 text-center transition hover:border-jsd-orange hover:bg-white/[0.05]">
                    <input id="ccBack" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(e, "Back")} required />
                    <span className="font-display text-lg font-bold text-white">Verso do CC</span>
                    <span className="text-xs text-white/50">{form.documentBackName || "PDF, JPG ou PNG"}</span>
                  </label>
                </div>
              </section>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="btn-primary w-full py-5 text-sm font-extrabold uppercase tracking-widest"
              >
                Submeter Registo
              </motion.button>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
