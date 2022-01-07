export type HttpResponseMessage = {
  message: string;
};
export function messageResponse(message: string): HttpResponseMessage {
  return {
    message,
  };
}
