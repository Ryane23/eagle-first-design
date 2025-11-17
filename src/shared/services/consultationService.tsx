export interface ConsultationSession {
  id: string;
  patientId: string;
  doctorId: string;
  roomId: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export class ConsultationService {
  private sessions: Map<string, ConsultationSession> = new Map();

  createSession(patientId: string, doctorId: string, roomId: string): ConsultationSession {
    const session: ConsultationSession = {
      id: `session_${Date.now()}`,
      patientId,
      doctorId,
      roomId,
      status: 'waiting'
    };

    this.sessions.set(session.id, session);
    return session;
  }

  startSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'waiting') {
      session.status = 'active';
      session.startTime = new Date();
      return true;
    }
    return false;
  }

  pauseSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'active') {
      session.status = 'paused';
      return true;
    }
    return false;
  }

  resumeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'paused') {
      session.status = 'active';
      return true;
    }
    return false;
  }

  endSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && (session.status === 'active' || session.status === 'paused')) {
      session.status = 'completed';
      session.endTime = new Date();
      if (session.startTime) {
        session.duration = session.endTime.getTime() - session.startTime.getTime();
      }
      return true;
    }
    return false;
  }

  getSession(sessionId: string): ConsultationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getActiveSessions(): ConsultationSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }
}

export const consultationService = new ConsultationService();