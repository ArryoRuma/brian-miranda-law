export async function useSiteCopy() {
  const { data, error } = await useAsyncData("site-copy", () =>
    queryCollection("site").first()
  );

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: "Website content could not be loaded",
      cause: error.value,
    });
  }

  return computed(() => {
    if (!data.value) {
      throw createError({
        statusCode: 500,
        statusMessage: "Website content is missing",
      });
    }

    return data.value;
  });
}
