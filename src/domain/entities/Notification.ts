export interface Notification {
  id: string;
  recipientUserId: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  referenceType: string;
  referenceId: string;
  createdAt: string;
  readAt: string | null;
}
