export interface IMessageDTO {
  template_id?: string;
  sender_id: string;
  tags: string[];
  subject: string;
  body?: string;
}
