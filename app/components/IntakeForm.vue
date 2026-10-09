<script setup lang="ts">
const content = computed(() => useSiteCopy().value.contactPage.intake);
const form = reactive({
  name: "",
  contact: "",
  preferredChannel: "Email",
  message: "",
  website: "",
});
const status = ref<"idle" | "sending" | "success" | "error">("idle");

async function submit() {
  status.value = "sending";
  try {
    await $fetch("/api/intake", { method: "POST", body: form });
    status.value = "success";
    form.name = "";
    form.contact = "";
    form.message = "";
    form.website = "";
  } catch {
    status.value = "error";
  }
}
</script>

<template>
  <section class="intake-section" aria-labelledby="intake-title">
    <SectionEyebrow tone="dark">{{ content.eyebrow }}</SectionEyebrow>
    <h2 id="intake-title">{{ content.title }}</h2>
    <p>{{ content.body }}</p>
    <form class="intake-form" @submit.prevent="submit">
      <label>
        {{ content.nameLabel }}
        <input
          v-model="form.name"
          required
          maxlength="120"
          :placeholder="content.namePlaceholder"
          autocomplete="name"
        />
      </label>
      <label>
        {{ content.contactLabel }}
        <input
          v-model="form.contact"
          required
          maxlength="160"
          :placeholder="content.contactPlaceholder"
          autocomplete="email"
        />
      </label>
      <label>
        {{ content.preferredChannelLabel }}
        <select v-model="form.preferredChannel">
          <option
            v-for="option in content.preferredChannelOptions"
            :key="option"
          >
            {{ option }}
          </option>
        </select>
      </label>
      <label>
        {{ content.messageLabel }}
        <textarea
          v-model="form.message"
          required
          maxlength="3000"
          :placeholder="content.messagePlaceholder"
          rows="5"
        />
      </label>
      <label class="intake-honeypot" aria-hidden="true">
        Website
        <input v-model="form.website" tabindex="-1" autocomplete="off" />
      </label>
      <p class="content-note">{{ content.confidentiality }}</p>
      <button
        class="button button-primary"
        type="submit"
        :disabled="status === 'sending'"
      >
        {{ status === "sending" ? "Sending…" : content.submitLabel }}
      </button>
      <p v-if="status === 'success'" class="form-status" role="status">
        {{ content.successMessage }}
      </p>
      <p
        v-if="status === 'error'"
        class="form-status form-status-error"
        role="alert"
      >
        {{ content.errorMessage }}
      </p>
    </form>
  </section>
</template>
