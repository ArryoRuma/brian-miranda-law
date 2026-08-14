import type { FormEvent } from "react";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { PageShell } from "@/components/site/PageShell";

type Locale = "en" | "es" | "pt";

const COPY = {
  en: {
    lang: "en",
    title: "English Estate Planning Questionnaire",
    meta: "Organize your family, estate-planning goals, and consultation preferences before speaking with Miranda Law.",
    eyebrow: "Estate-planning questionnaire",
    heading: "Create a clear plan for the people you love.",
    lead: "Answer a few questions about your family and planning goals, then review what happens during a free consultation with Miranda Law.",
    trust: [
      "Free initial consultation",
      "Serving North Jersey families",
      "English, Spanish, and Portuguese",
      "Clear, personalized guidance",
    ],
    statusTitle: "Questionnaire scaffold",
    statusBody:
      "Secure form delivery is not connected yet. This page demonstrates the approved intake structure and does not transmit answers. Do not enter confidential information during this stage.",
    sections: {
      contact: "Start with your contact preferences",
      about: "About you",
      family: "Your family",
      planning: "Planning needs",
      documents: "Current documents and decisions",
      notes: "What should the legal team know?",
    },
    labels: {
      name: "Full name",
      email: "Email address",
      phone: "Mobile number",
      contact: "Preferred contact method",
      language: "Preferred language",
      city: "City",
      state: "State",
      marital: "Marital status",
      children: "Do you have children?",
      dependents: "Does anyone depend on you for care or financial support?",
      prompted: "What prompted you to consider estate planning now?",
      services: "Which services would you like to discuss?",
      existing: "Do you currently have estate-planning documents?",
      executor: "Have you considered who could serve as executor?",
      financial:
        "Have you considered a financial agent under a power of attorney?",
      healthcare: "Have you considered a health care representative?",
      timing: "How soon would you like assistance?",
      notes: "Questions or context for the consultation",
      consent:
        "I understand that this questionnaire does not create an attorney-client relationship.",
    },
    options: {
      choose: "Choose an option",
      call: "Call",
      text: "Text",
      whatsapp: "WhatsApp",
      english: "English",
      spanish: "Spanish",
      portuguese: "Portuguese",
      yes: "Yes",
      no: "No",
      unsure: "Not sure yet",
      single: "Single",
      married: "Married",
      partnered: "Unmarried partnership",
      divorced: "Divorced or separated",
      widowed: "Widowed",
      soon: "As soon as possible",
      month: "Within a month",
      quarter: "Within three months",
      exploring: "I am gathering information",
    },
    serviceOptions: [
      "Will",
      "Trust",
      "Power of Attorney",
      "Health Care Directive",
      "Update an existing plan",
      "Not sure yet",
    ],
    preview: "Preview what happens next",
  },
  es: {
    lang: "es",
    title: "Cuestionario de Planificación Patrimonial",
    meta: "Organice la información sobre su familia, sus objetivos y sus preferencias antes de hablar con Miranda Law.",
    eyebrow: "Cuestionario de planificación patrimonial",
    heading: "Cree un plan claro para las personas que ama.",
    lead: "Responda algunas preguntas sobre su familia y sus objetivos, y luego conozca los próximos pasos para una consulta inicial gratuita con Miranda Law.",
    trust: [
      "Consulta inicial gratuita",
      "Atendemos a familias de North Jersey",
      "Inglés, español y portugués",
      "Orientación clara y personalizada",
    ],
    statusTitle: "Estructura preliminar del cuestionario",
    statusBody:
      "El envío seguro todavía no está conectado. Esta página demuestra la estructura de admisión y no transmite respuestas. No ingrese información confidencial en esta etapa.",
    sections: {
      contact: "Comience con sus preferencias de contacto",
      about: "Sobre usted",
      family: "Su familia",
      planning: "Necesidades de planificación",
      documents: "Documentos y decisiones actuales",
      notes: "¿Qué debe saber el equipo legal?",
    },
    labels: {
      name: "Nombre completo",
      email: "Correo electrónico",
      phone: "Número de teléfono móvil",
      contact: "Método de contacto preferido",
      language: "Idioma preferido",
      city: "Ciudad",
      state: "Estado",
      marital: "Estado civil",
      children: "¿Tiene hijos?",
      dependents:
        "¿Alguien depende de usted para recibir cuidado o apoyo económico?",
      prompted:
        "¿Qué le motivó a considerar la planificación patrimonial ahora?",
      services: "¿Qué servicios desea conversar?",
      existing: "¿Tiene actualmente documentos de planificación patrimonial?",
      executor: "¿Ha pensado quién podría actuar como albacea?",
      financial: "¿Ha pensado en un agente para asuntos financieros?",
      healthcare: "¿Ha pensado en un representante para decisiones médicas?",
      timing: "¿Cuándo desea recibir asistencia?",
      notes: "Preguntas o contexto para la consulta",
      consent:
        "Entiendo que este cuestionario no crea una relación abogado-cliente.",
    },
    options: {
      choose: "Seleccione una opción",
      call: "Llamada",
      text: "Mensaje de texto",
      whatsapp: "WhatsApp",
      english: "Inglés",
      spanish: "Español",
      portuguese: "Portugués",
      yes: "Sí",
      no: "No",
      unsure: "Aún no estoy seguro/a",
      single: "Soltero/a",
      married: "Casado/a",
      partnered: "Pareja no casada",
      divorced: "Divorciado/a o separado/a",
      widowed: "Viudo/a",
      soon: "Lo antes posible",
      month: "Dentro de un mes",
      quarter: "Dentro de tres meses",
      exploring: "Estoy recopilando información",
    },
    serviceOptions: [
      "Testamento",
      "Fideicomiso",
      "Poder notarial",
      "Directiva de atención médica",
      "Actualizar un plan existente",
      "Aún no estoy seguro/a",
    ],
    preview: "Ver los próximos pasos",
  },
  pt: {
    lang: "pt",
    title: "Questionário de Planejamento Patrimonial",
    meta: "Organize informações sobre sua família, seus objetivos e suas preferências antes de conversar com o Miranda Law.",
    eyebrow: "Questionário de planejamento patrimonial",
    heading: "Crie um plano claro para as pessoas que você ama.",
    lead: "Responda a algumas perguntas sobre sua família e seus objetivos e veja os próximos passos para uma consulta inicial gratuita com o Miranda Law.",
    trust: [
      "Consulta inicial gratuita",
      "Atendimento a famílias de North Jersey",
      "Inglês, espanhol e português",
      "Orientação clara e personalizada",
    ],
    statusTitle: "Estrutura preliminar do questionário",
    statusBody:
      "O envio seguro ainda não está conectado. Esta página demonstra a estrutura de atendimento e não transmite respostas. Não insira informações confidenciais nesta etapa.",
    sections: {
      contact: "Comece com suas preferências de contato",
      about: "Sobre você",
      family: "Sua família",
      planning: "Necessidades de planejamento",
      documents: "Documentos e decisões atuais",
      notes: "O que a equipe jurídica deve saber?",
    },
    labels: {
      name: "Nome completo",
      email: "E-mail",
      phone: "Número de celular",
      contact: "Forma de contato preferida",
      language: "Idioma preferido",
      city: "Cidade",
      state: "Estado",
      marital: "Estado civil",
      children: "Você tem filhos?",
      dependents: "Alguém depende de você para cuidados ou apoio financeiro?",
      prompted:
        "O que levou você a considerar o planejamento patrimonial agora?",
      services: "Quais serviços você gostaria de discutir?",
      existing: "Você já possui documentos de planejamento patrimonial?",
      executor: "Você já pensou em quem poderia atuar como executor?",
      financial: "Você já pensou em um agente para assuntos financeiros?",
      healthcare: "Você já pensou em um representante para decisões de saúde?",
      timing: "Em quanto tempo você gostaria de receber assistência?",
      notes: "Perguntas ou contexto para a consulta",
      consent:
        "Entendo que este questionário não cria uma relação advogado-cliente.",
    },
    options: {
      choose: "Selecione uma opção",
      call: "Ligação",
      text: "Mensagem de texto",
      whatsapp: "WhatsApp",
      english: "Inglês",
      spanish: "Espanhol",
      portuguese: "Português",
      yes: "Sim",
      no: "Não",
      unsure: "Ainda não tenho certeza",
      single: "Solteiro/a",
      married: "Casado/a",
      partnered: "União não formalizada",
      divorced: "Divorciado/a ou separado/a",
      widowed: "Viúvo/a",
      soon: "O mais rápido possível",
      month: "Dentro de um mês",
      quarter: "Dentro de três meses",
      exploring: "Estou reunindo informações",
    },
    serviceOptions: [
      "Testamento",
      "Trust",
      "Procuração",
      "Diretiva de cuidados de saúde",
      "Atualizar um plano existente",
      "Ainda não tenho certeza",
    ],
    preview: "Ver os próximos passos",
  },
} as const;

function normalizeLocale(value: string | undefined): Locale {
  return value === "es" || value === "pt" ? value : "en";
}

function SelectField({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <select name={name} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function QuestionnairePage() {
  const params = useParams<{ locale?: string }>();
  const locale = normalizeLocale(params.locale);
  const copy = COPY[locale];
  const [, setLocation] = useLocation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocation(`/start/${locale}/what-happens-next`);
  };

  const yesNoOptions = [copy.options.yes, copy.options.no, copy.options.unsure];

  return (
    <PageShell
      title={copy.title}
      description={copy.meta}
      path={`/start/${locale}`}
      language={copy.lang}
      noIndex
    >
      <section className="questionnaire-hero">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> {copy.eyebrow}
          </p>
          <h1>{copy.heading}</h1>
          <p>{copy.lead}</p>
          <ul>
            {copy.trust.map(item => (
              <li key={item}>
                <Check size={16} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="questionnaire-intro-card">
          <LockKeyhole size={24} />
          <h2>{copy.statusTitle}</h2>
          <p>{copy.statusBody}</p>
        </div>
      </section>

      <form className="questionnaire-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>01 — {copy.sections.contact}</legend>
          <div className="form-grid">
            <label>
              <span>{copy.labels.name}</span>
              <input name="name" autoComplete="name" />
            </label>
            <label>
              <span>{copy.labels.email}</span>
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label>
              <span>{copy.labels.phone}</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <SelectField
              label={copy.labels.contact}
              name="contact-method"
              placeholder={copy.options.choose}
              options={[
                copy.options.call,
                copy.options.text,
                copy.options.whatsapp,
              ]}
            />
            <SelectField
              label={copy.labels.language}
              name="language"
              placeholder={copy.options.choose}
              options={[
                copy.options.english,
                copy.options.spanish,
                copy.options.portuguese,
              ]}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>02 — {copy.sections.about}</legend>
          <div className="form-grid">
            <label>
              <span>{copy.labels.city}</span>
              <input name="city" autoComplete="address-level2" />
            </label>
            <label>
              <span>{copy.labels.state}</span>
              <input
                name="state"
                defaultValue="NJ"
                autoComplete="address-level1"
              />
            </label>
            <SelectField
              label={copy.labels.marital}
              name="marital-status"
              placeholder={copy.options.choose}
              options={[
                copy.options.single,
                copy.options.married,
                copy.options.partnered,
                copy.options.divorced,
                copy.options.widowed,
              ]}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>03 — {copy.sections.family}</legend>
          <div className="form-grid">
            <SelectField
              label={copy.labels.children}
              name="children"
              placeholder={copy.options.choose}
              options={yesNoOptions}
            />
            <SelectField
              label={copy.labels.dependents}
              name="dependents"
              placeholder={copy.options.choose}
              options={yesNoOptions}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>04 — {copy.sections.planning}</legend>
          <label className="form-full-width">
            <span>{copy.labels.prompted}</span>
            <textarea name="prompted" rows={4} />
          </label>
          <div className="form-checkbox-grid">
            <span>{copy.labels.services}</span>
            {copy.serviceOptions.map(service => (
              <label key={service}>
                <input type="checkbox" name="services" value={service} />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>05 — {copy.sections.documents}</legend>
          <div className="form-grid">
            <SelectField
              label={copy.labels.existing}
              name="existing-documents"
              placeholder={copy.options.choose}
              options={yesNoOptions}
            />
            <SelectField
              label={copy.labels.executor}
              name="executor"
              placeholder={copy.options.choose}
              options={yesNoOptions}
            />
            <SelectField
              label={copy.labels.financial}
              name="financial-agent"
              placeholder={copy.options.choose}
              options={yesNoOptions}
            />
            <SelectField
              label={copy.labels.healthcare}
              name="healthcare-representative"
              placeholder={copy.options.choose}
              options={yesNoOptions}
            />
            <SelectField
              label={copy.labels.timing}
              name="timing"
              placeholder={copy.options.choose}
              options={[
                copy.options.soon,
                copy.options.month,
                copy.options.quarter,
                copy.options.exploring,
              ]}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>06 — {copy.sections.notes}</legend>
          <label className="form-full-width">
            <span>{copy.labels.notes}</span>
            <textarea name="notes" rows={6} />
          </label>
          <label className="consent-label">
            <input type="checkbox" name="consent" required />
            <span>{copy.labels.consent}</span>
          </label>
        </fieldset>

        <button
          className="button button-brass questionnaire-submit"
          type="submit"
        >
          {copy.preview} <ArrowRight size={18} />
        </button>
      </form>
    </PageShell>
  );
}
