import { Check, LockKeyhole } from "lucide-react";
import { useParams } from "wouter";
import { PrimaryContactActions } from "@/components/site/ContactActions";
import { PageShell } from "@/components/site/PageShell";

type Locale = "en" | "es" | "pt";

const COPY = {
  en: {
    lang: "en",
    title: "English Estate Planning Questionnaire",
    meta: "Organize your family, estate-planning goals, and consultation preferences before speaking with Miranda Law.",
    eyebrow: "Estate-planning questionnaire",
    heading: "Create a clear plan for the people you love.",
    lead: "Review the questions Miranda Law may discuss with you, then call or text when you are ready for a free consultation.",
    trust: [
      "Free initial consultation",
      "Serving North Jersey families",
      "English, Spanish, and Portuguese",
      "Clear, personalized guidance",
    ],
    statusTitle: "Questionnaire preview",
    statusBody:
      "This page previews the intake conversation. It does not collect or transmit answers, so you can review the topics without entering personal information.",
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
    preview: "What we may ask",
    contactTitle: "Ready to start the conversation?",
    contactBody:
      "Call or text Brian directly. Please do not include confidential or time-sensitive information until the firm confirms representation.",
    callCta: "Call Brian",
    textCta: "Text Brian",
  },
  es: {
    lang: "es",
    title: "Cuestionario de Planificación Patrimonial",
    meta: "Organice la información sobre su familia, sus objetivos y sus preferencias antes de hablar con Miranda Law.",
    eyebrow: "Cuestionario de planificación patrimonial",
    heading: "Cree un plan claro para las personas que ama.",
    lead: "Revise las preguntas que Miranda Law puede conversar con usted y llame o envíe un mensaje cuando esté listo para una consulta inicial gratuita.",
    trust: [
      "Consulta inicial gratuita",
      "Atendemos a familias de North Jersey",
      "Inglés, español y portugués",
      "Orientación clara y personalizada",
    ],
    statusTitle: "Vista previa del cuestionario",
    statusBody:
      "Esta página presenta los temas de la conversación inicial. No recopila ni transmite respuestas, por lo que puede revisarla sin ingresar información personal.",
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
    preview: "Lo que podemos preguntar",
    contactTitle: "¿Listo para comenzar la conversación?",
    contactBody:
      "Llame o envíe un mensaje a Brian. No incluya información confidencial o urgente hasta que la firma confirme la representación.",
    callCta: "Llamar a Brian",
    textCta: "Enviar mensaje",
  },
  pt: {
    lang: "pt",
    title: "Questionário de Planejamento Patrimonial",
    meta: "Organize informações sobre sua família, seus objetivos e suas preferências antes de conversar com o Miranda Law.",
    eyebrow: "Questionário de planejamento patrimonial",
    heading: "Crie um plano claro para as pessoas que você ama.",
    lead: "Revise as perguntas que o Miranda Law pode conversar com você e ligue ou envie uma mensagem quando estiver pronto para uma consulta inicial gratuita.",
    trust: [
      "Consulta inicial gratuita",
      "Atendimento a famílias de North Jersey",
      "Inglês, espanhol e português",
      "Orientação clara e personalizada",
    ],
    statusTitle: "Prévia do questionário",
    statusBody:
      "Esta página apresenta os assuntos da conversa inicial. Ela não coleta nem transmite respostas, então você pode revisar tudo sem inserir informações pessoais.",
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
    preview: "O que podemos perguntar",
    contactTitle: "Pronto para começar a conversa?",
    contactBody:
      "Ligue ou envie uma mensagem para Brian. Não inclua informações confidenciais ou urgentes até que o escritório confirme a representação.",
    callCta: "Ligar para Brian",
    textCta: "Enviar mensagem",
  },
} as const;

function normalizeLocale(value: string | undefined): Locale {
  return value === "es" || value === "pt" ? value : "en";
}

export default function QuestionnairePage() {
  const params = useParams<{ locale?: string }>();
  const locale = normalizeLocale(params.locale);
  const copy = COPY[locale];
  const previewGroups = [
    {
      title: copy.sections.contact,
      questions: [
        copy.labels.name,
        copy.labels.email,
        copy.labels.phone,
        copy.labels.contact,
        copy.labels.language,
      ],
    },
    {
      title: copy.sections.about,
      questions: [copy.labels.city, copy.labels.state, copy.labels.marital],
    },
    {
      title: copy.sections.family,
      questions: [copy.labels.children, copy.labels.dependents],
    },
    {
      title: copy.sections.planning,
      questions: [
        copy.labels.prompted,
        copy.labels.services,
        ...copy.serviceOptions,
      ],
    },
    {
      title: copy.sections.documents,
      questions: [
        copy.labels.existing,
        copy.labels.executor,
        copy.labels.financial,
        copy.labels.healthcare,
        copy.labels.timing,
      ],
    },
    {
      title: copy.sections.notes,
      questions: [copy.labels.notes, copy.labels.consent],
    },
  ];

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
                <Check size={16} aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="questionnaire-intro-card">
          <LockKeyhole size={24} aria-hidden="true" />
          <h2>{copy.statusTitle}</h2>
          <p>{copy.statusBody}</p>
        </div>
      </section>

      <section
        className="questionnaire-preview"
        aria-labelledby="preview-heading"
      >
        <div className="questionnaire-preview-heading">
          <p className="eyebrow dark">
            <span className="eyebrow-rule" /> {copy.preview}
          </p>
          <h2 id="preview-heading">{copy.statusTitle}</h2>
        </div>
        <ol className="questionnaire-preview-list">
          {previewGroups.map((group, index) => (
            <li key={group.title}>
              <details open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{group.title}</strong>
                </summary>
                <ul>
                  {group.questions.map(question => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <section className="questionnaire-preview-cta">
        <div>
          <h2>{copy.contactTitle}</h2>
          <p>{copy.contactBody}</p>
        </div>
        <PrimaryContactActions
          callLabel={copy.callCta}
          textLabel={copy.textCta}
        />
      </section>
    </PageShell>
  );
}
