import axios from "axios";

interface NestErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as NestErrorBody | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (error.response?.status === 401) {
      return "Sessão expirada. Faça login novamente.";
    }

    if (error.response?.status === 403) {
      return "Você não tem permissão para esta ação.";
    }

    return error.message || "Erro ao comunicar com o servidor.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado. Tente novamente.";
}
