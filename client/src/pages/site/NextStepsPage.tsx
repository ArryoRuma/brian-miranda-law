import {
  ArrowUpRight,
  CalendarCheck,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { CONTACT, getPhoneHref, getWhatsAppHref } from "@/site/siteConfig";

type Locale = "en" | "es" | "pt";

const COPY = {
  en: {
    lang: "en",
    title: "What Happens Next",
    eyebrow: "What happens next",
    heading: "The next step is a conversation, not a commitment.",
    lead: "The questionnaire structure helps organize the consultation. Once secure intake is connected, the legal team will review the submitted information and help schedule a no-charge initial conversation.",
    steps: [
      [
        "Complete the initial questionnaire",
        "Share the family, planning, and contact information that helps the firm prepare.",
      ],
      [
        "Schedule your free consultation",
        "Choose a time to discuss your questions and the general scope of assistance.",
      ],
      [
        "Review possible options",
        "Brian explains what documents or next steps may fit your circumstances.",
      ],
    ],
    cta: "Return to the questionnaire",
  },
  es: {
    lang: "es",
    title: "Próximos Pasos",
    eyebrow: "Qué sucede después",
    heading: "El próximo paso es una conversación, no un compromiso.",
    lead: "El cuestionario ayuda a organizar la consulta. Cuando se conecte el sistema seguro, el equipo legal revisará la información enviada y ayudará a programar una consulta inicial sin costo.",
    steps: [
      [
        "Complete el cuestionario inicial",
        "Comparta la información familiar, de planificación y de contacto que ayuda al bufete a prepararse.",
      ],
      [
        "Programe su consulta gratuita",
        "Elija un momento para conversar sobre sus preguntas y el alcance general de la asistencia.",
      ],
      [
        "Revise las opciones posibles",
        "Brian explica qué documentos o próximos pasos pueden corresponder a sus circunstancias.",
      ],
    ],
    cta: "Volver al cuestionario",
  },
  pt: {
    lang: "pt",
    title: "Próximos Passos",
    eyebrow: "O que acontece depois",
    heading: "O próximo passo é uma conversa, não um compromisso.",
    lead: "O questionário ajuda a organizar a consulta. Quando o sistema seguro estiver conectado, a equipe jurídica revisará as informações enviadas e ajudará a agendar uma consulta inicial gratuita.",
    steps: [
      [
        "Preencha o questionário inicial",
        "Compartilhe as informações familiares, de planejamento e de contato que ajudam o escritório a se preparar.",
      ],
      [
        "Agende sua consulta gratuita",
        "Escolha um horário para conversar sobre suas dúvidas e o escopo geral da assistência.",
      ],
      [
        "Analise as opções possíveis",
        "Brian explica quais documentos ou próximos passos podem ser adequados às suas circunstâncias.",
      ],
    ],
    cta: "Voltar ao questionário",
  },
} as const;

function normalizeLocale(value: string | undefined): Locale {
  return value === "es" || value === "pt" ? value : "en";
}

const ICONS = [ClipboardCheck, CalendarCheck, MessageCircle] as const;

export default function NextStepsPage() {
  const params = useParams<{ locale?: string }>();
  const locale = normalizeLocale(params.locale);
  const copy = COPY[locale];

  return (
    <PageShell
      title={copy.title}
      description={copy.lead}
      path={`/start/${locale}/what-happens-next`}
      language={copy.lang}
      noIndex
    >
      <section className="next-steps-page">
        <div className="next-steps-heading">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> {copy.eyebrow}
          </p>
          <h1>{copy.heading}</h1>
          <p>{copy.lead}</p>
        </div>
        <ol>
          {copy.steps.map(([title, body], index) => {
            const Icon = ICONS[index];
            return (
              <li key={title}>
                <Icon size={25} />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </li>
            );
          })}
        </ol>
        <div className="next-steps-actions">
          <Link className="button button-brass" href={`/start/${locale}`}>
            {copy.cta} <ArrowUpRight size={17} />
          </Link>
          <a href={getPhoneHref()}>{CONTACT.phoneDisplay}</a>
          <a href={getWhatsAppHref()} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </section>
    </PageShell>
  );
}
