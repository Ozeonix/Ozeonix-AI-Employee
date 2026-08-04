export interface VoiceCallPayload {
  toPhone: string;
  fromPhone?: string;
  initialGreeting?: string;
  agentRole?: 'RECEPTIONIST' | 'SALES_AGENT' | 'SUPPORT_SPECIALIST';
}

export interface VoiceCallStatus {
  callId: string;
  status: 'QUEUED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  durationSeconds?: number;
  transcript?: string;
  recordingUrl?: string;
}

export interface IVoiceDriver {
  initiateOutboundCall(payload: VoiceCallPayload): Promise<VoiceCallStatus>;
  handleInboundCall(callId: string, callerPhone: string): Promise<{ welcomeTwimlOrXml: string }>;
  synthesizeSpeechResponse(text: string, voiceId?: string): Promise<{ audioUrl: string }>;
}
