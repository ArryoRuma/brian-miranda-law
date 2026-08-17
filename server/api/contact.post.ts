export default defineEventHandler(event => {
  setResponseStatus(event, 501);

  return {
    status: "not-configured",
    message:
      "Secure form handling is not configured. Contact Miranda Law by phone, text, WhatsApp, or email.",
  };
});
