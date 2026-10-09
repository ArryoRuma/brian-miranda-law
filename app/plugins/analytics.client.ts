export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const measurementId = config.public.gaMeasurementId;
  if (!measurementId) return;

  useHead({
    script: [
      {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      },
      {
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}',{allow_google_signals:false,allow_ad_personalization_signals:false});`,
      },
    ],
  });
});
