<script setup lang="ts">
import { Check, LockKeyhole } from "@lucide/vue";

type Locale = "en" | "es" | "pt";
const props = defineProps<{ locale: Locale }>();

const copy = {
  en: {
    title: "Estate Planning Questionnaire",
    meta: "Organize information about your family, goals, and preferences before speaking with Miranda Law.",
    eyebrow: "Estate planning questionnaire",
    heading: "Create a clear plan for the people you love.",
    lead: "Review the topics Miranda Law may discuss with you, then call or text when you are ready for a free initial consultation.",
    trust: [
      "Free initial consultation",
      "Serving North Jersey families",
      "English, Spanish, and Portuguese",
      "Clear, personal guidance",
    ],
    statusTitle: "Questionnaire preview",
    statusBody:
      "This page previews the initial conversation. It does not collect or transmit answers, so you can review it without entering personal information.",
    groups: [
      [
        "Contact preferences",
        "Name, email, mobile number, preferred contact method, and language",
      ],
      [
        "About you",
        "City, state, marital status, and the people who depend on you",
      ],
      [
        "Your family",
        "Children, dependents, guardians, and important relationships",
      ],
      [
        "Planning needs",
        "What prompted planning and which services you want to discuss",
      ],
      ["Current documents", "Existing documents and possible decision-makers"],
      ["Questions", "Timing, priorities, and context for the consultation"],
    ],
    cta: "Ready to start the conversation?",
  },
  es: {
    title: "Cuestionario de Planificación Patrimonial",
    meta: "Organice información sobre su familia, sus objetivos y sus preferencias antes de hablar con Miranda Law.",
    eyebrow: "Cuestionario de planificación patrimonial",
    heading: "Cree un plan claro para las personas que ama.",
    lead: "Revise los temas que Miranda Law puede conversar con usted y llame o envíe un mensaje cuando esté listo para una consulta inicial gratuita.",
    trust: [
      "Consulta inicial gratuita",
      "Atendemos a familias de North Jersey",
      "Inglés, español y portugués",
      "Orientación clara y personalizada",
    ],
    statusTitle: "Vista previa del cuestionario",
    statusBody:
      "Esta página presenta los temas de la conversación inicial. No recopila ni transmite respuestas, por lo que puede revisarla sin ingresar información personal.",
    groups: [
      [
        "Preferencias de contacto",
        "Nombre, correo, móvil, forma de contacto e idioma",
      ],
      ["Sobre usted", "Ciudad, estado y estado civil"],
      ["Su familia", "Hijos, dependientes y relaciones importantes"],
      [
        "Necesidades de planificación",
        "Qué motivó la planificación y servicios de interés",
      ],
      [
        "Documentos actuales",
        "Documentos existentes y posibles representantes",
      ],
      ["Preguntas", "Plazos, prioridades y contexto para la consulta"],
    ],
    cta: "¿Listo para comenzar la conversación?",
  },
  pt: {
    title: "Questionário de Planejamento Patrimonial",
    meta: "Organize informações sobre sua família, seus objetivos e suas preferências antes de conversar com o Miranda Law.",
    eyebrow: "Questionário de planejamento patrimonial",
    heading: "Crie um plano claro para as pessoas que você ama.",
    lead: "Revise os assuntos que o Miranda Law pode conversar com você e ligue ou envie uma mensagem quando estiver pronto para uma consulta inicial gratuita.",
    trust: [
      "Consulta inicial gratuita",
      "Atendimento a famílias de North Jersey",
      "Inglês, espanhol e português",
      "Orientação clara e personalizada",
    ],
    statusTitle: "Prévia do questionário",
    statusBody:
      "Esta página apresenta os assuntos da conversa inicial. Ela não coleta nem transmite respostas, então você pode revisar tudo sem inserir informações pessoais.",
    groups: [
      [
        "Preferências de contato",
        "Nome, e-mail, celular, forma de contato e idioma",
      ],
      ["Sobre você", "Cidade, estado e estado civil"],
      ["Sua família", "Filhos, dependentes e relações importantes"],
      [
        "Necessidades de planejamento",
        "O motivo do planejamento e serviços de interesse",
      ],
      ["Documentos atuais", "Documentos existentes e possíveis representantes"],
      ["Perguntas", "Prazo, prioridades e contexto para a consulta"],
    ],
    cta: "Pronto para começar a conversa?",
  },
} as const;

const content = computed(() => copy[props.locale]);

usePageSeo({
  title: content.value.title,
  description: content.value.meta,
  path: `/start/${props.locale}`,
  locale: props.locale,
  noIndex: true,
});
</script>

<template>
  <div>
    <section class="questionnaire-hero">
      <div>
        <SectionEyebrow>{{ content.eyebrow }}</SectionEyebrow>
        <h1>{{ content.heading }}</h1>
        <p>{{ content.lead }}</p>
        <ul>
          <li v-for="item in content.trust" :key="item">
            <Check :size="16" aria-hidden="true" /> {{ item }}
          </li>
        </ul>
      </div>
      <div class="questionnaire-intro-card">
        <LockKeyhole :size="24" aria-hidden="true" />
        <h2>{{ content.statusTitle }}</h2>
        <p>{{ content.statusBody }}</p>
      </div>
    </section>

    <section class="questionnaire-preview" aria-labelledby="preview-heading">
      <div class="questionnaire-preview-heading">
        <SectionEyebrow tone="dark">What we may ask</SectionEyebrow>
        <h2 id="preview-heading">{{ content.statusTitle }}</h2>
      </div>
      <ol class="questionnaire-preview-list">
        <li v-for="(group, index) in content.groups" :key="group[0]">
          <details :open="index === 0">
            <summary>
              <span>{{ String(index + 1).padStart(2, "0") }}</span>
              <strong>{{ group[0] }}</strong>
            </summary>
            <ul>
              <li>{{ group[1] }}</li>
            </ul>
          </details>
        </li>
      </ol>
    </section>

    <section class="questionnaire-preview-cta">
      <div>
        <h2>{{ content.cta }}</h2>
        <p>
          Please do not include confidential or time-sensitive information until
          the firm confirms representation.
        </p>
      </div>
      <ContactActions />
    </section>
  </div>
</template>
