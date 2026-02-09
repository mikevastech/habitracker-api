import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Server-side analytics: sends events to Mixpanel when MIXPANEL_PROJECT_TOKEN is set.
 * Respect user's analyticsEnabled (callers should check profile settings before calling).
 */
@Injectable()
export class AnalyticsService {
  private readonly token: string | undefined;
  private readonly enabled: boolean;

  constructor(private readonly config: ConfigService) {
    this.token = this.config.get<string>('MIXPANEL_PROJECT_TOKEN');
    this.enabled = Boolean(this.token);
  }

  /**
   * Track an event. No-op if Mixpanel is not configured.
   * @param distinctId – user id (or anonymous id from client)
   * @param eventName – e.g. "Task Completed", "Challenge Joined"
   * @param properties – optional extra props (e.g. taskType, challengeId)
   */
  track(
    distinctId: string,
    eventName: string,
    properties?: Record<string, string | number | boolean | undefined>,
  ): void {
    if (!this.enabled || !this.token) return;

    const payload = {
      event: eventName,
      properties: {
        token: this.token,
        distinct_id: distinctId,
        time: Math.floor(Date.now() / 1000),
        ...properties,
      },
    };

    const data = Buffer.from(JSON.stringify([payload])).toString('base64');
    fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data }),
    }).catch(() => {
      // fire-and-forget; avoid logging on every event
    });
  }

  /** Identify user (set profile). Optional; events already carry distinct_id. */
  identify(distinctId: string, traits?: Record<string, string | number | boolean>): void {
    if (!this.enabled || !this.token) return;
    // Mixpanel $identify can be sent as a special event or via people API; for simplicity we only track events
    this.track(
      distinctId,
      '$identify',
      traits as Record<string, string | number | boolean | undefined>,
    );
  }
}
