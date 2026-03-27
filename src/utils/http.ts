import axios from "axios"

export function getApiErrorText(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      return "не хватает прав"
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message

    return message || "произошла ошибка"
  }

  return "произошла ошибка"
}