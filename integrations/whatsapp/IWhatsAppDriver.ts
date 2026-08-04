export interface WhatsAppMessagePayload {
  toPhone: string;
  messageType: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO';
  content: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
}

export interface NormalizedWhatsAppEvent {
  eventId: string;
  eventType: 'MESSAGE_RECEIVED' | 'MESSAGE_STATUS_UPDATE' | 'SESSION_STATUS';
  fromPhone: string;
  toPhone: string;
  timestamp: Date;
  messageType: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO';
  content: string;
  mediaUrl?: string;
  externalMessageId?: string;
  status?: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  rawPayload?: any;
}

export interface IWhatsAppDriver {
  initializeSession(phoneNumber: string): Promise<boolean>;
  sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; externalMessageId: string }>;
  registerEventListener(callback: (event: NormalizedWhatsAppEvent) => Promise<void>): void;
  getStatus(): { isConnected: boolean; phoneNumber: string; sessionActive: boolean };
}
