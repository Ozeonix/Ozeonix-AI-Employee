import { Request, Response, NextFunction } from 'express';
import { VoiceService } from '../../../integrations/voice/VoiceService.js';
import { initiateVoiceCallSchema } from './dto/voice.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class VoiceController {
  private voiceService: VoiceService;

  constructor(voiceService = new VoiceService()) {
    this.voiceService = voiceService;
  }

  public initiateCall = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = initiateVoiceCallSchema.parse(req.body);
      const callStatus = await this.voiceService.initiateOutboundCall(validated);
      res.status(200).json({
        success: true,
        message: 'AI Voice Call initiated successfully',
        data: callStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public handleInboundCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const callerPhone = (req.query.From as string) || (req.body.From as string) || '+917483509984';
      const callId = (req.query.CallSid as string) || `call_${Date.now()}`;

      const twiml = await this.voiceService.handleInboundCall(callId, callerPhone);
      res.type('text/xml');
      res.status(200).send(twiml.welcomeTwimlOrXml);
    } catch (err) {
      next(err);
    }
  };
}
