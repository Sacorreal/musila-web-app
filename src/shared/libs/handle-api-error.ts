export function handleApiError(
  error: unknown,
  defaultMessage: string
): never {
  if (typeof error === "object" && error !== null) {
    const err = error as any;

    const message =
      err.response?.data?.message ||
      err.message ||
      defaultMessage;

    throw new Error(message);
  }

  throw new Error(defaultMessage);
}