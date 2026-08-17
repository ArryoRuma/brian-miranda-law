<script setup lang="ts">
import {
  ArrowUpRight,
  CalendarCheck,
  ClipboardCheck,
  MessageCircle,
} from "@lucide/vue";
import { CONTACT, getPhoneHref, getWhatsAppHref } from "~/data/site";

type Locale = "en" | "es" | "pt";
const props = defineProps<{ locale: Locale }>();

const copy = {
  en: {
    title: "What Happens Next",
    eyebrow: "What happens next",
    heading: "The next step is a conversation, not a commitment.",
    lead: "The questionnaire structure helps organize the consultation. Secure online intake is not connected yet; call or text the legal team to begin.",
    steps: [
      [
        "Review the initial questions",
        "Use the preview to organize family, planning, and contact information.",
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
    title: "Próximos Pasos",
    eyebrow: "Qué sucede después",
    heading: "El próximo paso es una conversación, no un compromiso.",
    lead: "La vista previa ayuda a organizar la consulta. El sistema seguro todavía no está conectado; llame o envíe un mensaje para comenzar.",
    steps: [
      [
        "Revise las preguntas iniciales",
        "Organice información familiar, de planificación y de contacto.",
      ],
      [
        "Programe su consulta gratuita",
        "Elija un momento para conversar sobre sus preguntas.",
      ],
      [
        "Revise las opciones posibles",
        "Brian explica qué documentos o próximos pasos pueden corresponder.",
      ],
    ],
    cta: "Volver al cuestionario",
  },
  pt: {
    title: "Próximos Passos",
    eyebrow: "O que acontece depois",
    heading: "O próximo passo é uma conversa, não um compromisso.",
    lead: "A prévia ajuda a organizar a consulta. O sistema seguro ainda não está conectado; ligue ou envie uma mensagem para começar.",
    steps: [
      [
        "Revise as perguntas iniciais",
        "Organize informações familiares, de planejamento e de contato.",
      ],
      [
        "Agende sua consulta gratuita",
        "Escolha um horário para conversar sobre suas dúvidas.",
      ],
      [
        "Analise as opções possíveis",
        "Brian explica quais documentos ou próximos passos podem ser adequados.",
      ],
    ],
    cta: "Voltar ao questionário",
  },
} as const;

const content = computed(() => copy[props.locale]);
const icons = [ClipboardCheck, CalendarCheck, MessageCircle];

usePageSeo({
  title: content.value.title,
  description: content.value.lead,
  path: `/start/${props.locale}/what-happens-next`,
  locale: props.locale,
  noIndex: true,
});
</script>

<template>
  <section class="next-steps-page">
    <div class="next-steps-heading">
      <SectionEyebrow>{{ content.eyebrow }}</SectionEyebrow>
      <h1>{{ content.heading }}</h1>
      <p>{{ content.lead }}</p>
    </div>
    <ol>
      <li v-for="(step, index) in content.steps" :key="step[0]">
        <component :is="icons[index]" :size="25" aria-hidden="true" />
        <span>{{ String(index + 1).padStart(2, "0") }}</span>
        <h2>{{ step[0] }}</h2>
        <p>{{ step[1] }}</p>
      </li>
    </ol>
    <div class="next-steps-actions">
      <NuxtLink class="button button-brass" :to="`/start/${locale}`">
        {{ content.cta }} <ArrowUpRight :size="17" aria-hidden="true" />
      </NuxtLink>
      <a :href="getPhoneHref()">{{ CONTACT.phoneDisplay }}</a>
      <a :href="getWhatsAppHref()" target="_blank" rel="noreferrer">WhatsApp</a>
    </div>
  </section>
</template>
