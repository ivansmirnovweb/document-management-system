import { Injectable } from '@nestjs/common';

type NodeEnv = 'development' | 'test' | 'production';

type AppConfigValues = {
  nodeEnv: NodeEnv;
  port: number;
  webOrigin: string;
  databaseUrl: string;
  jwtSecret: string;
  selfRegistrationEnabled: boolean;
};

@Injectable()
export class AppConfigService {
  private readonly values: AppConfigValues = this.parse(process.env);

  get nodeEnv(): NodeEnv {
    return this.values.nodeEnv;
  }

  get port(): number {
    return this.values.port;
  }

  get webOrigin(): string {
    return this.values.webOrigin;
  }

  get databaseUrl(): string {
    return this.values.databaseUrl;
  }

  get jwtSecret(): string {
    return this.values.jwtSecret;
  }

  get selfRegistrationEnabled(): boolean {
    return this.values.selfRegistrationEnabled;
  }

  private parse(env: NodeJS.ProcessEnv): AppConfigValues {
    const nodeEnv = this.parseNodeEnv(env.NODE_ENV);
    const port = this.parsePort(env.PORT ?? '4000');
    const webOrigin = env.WEB_ORIGIN ?? 'http://localhost:3000';
    const databaseUrl =
      env.DATABASE_URL ??
      'postgres://postgres:postgres@localhost:5432/document_flow';
    const jwtSecret = env.JWT_SECRET ?? 'change-me-in-production';
    const selfRegistrationEnabled = this.parseBoolean(
      env.AUTH_SELF_REGISTRATION_ENABLED,
      false,
    );

    return {
      nodeEnv,
      port,
      webOrigin,
      databaseUrl,
      jwtSecret,
      selfRegistrationEnabled,
    };
  }

  private parseNodeEnv(value: string | undefined): NodeEnv {
    if (value === 'development' || value === 'test' || value === 'production') {
      return value;
    }

    return 'development';
  }

  private parsePort(value: string): number {
    const port = Number(value);

    if (!Number.isInteger(port) || port <= 0) {
      throw new Error(`PORT must be a positive integer, got: ${value}`);
    }

    return port;
  }

  private parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (!value) {
      return fallback;
    }

    const normalized = value.trim().toLowerCase();

    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['0', 'false', 'no', 'off'].includes(normalized)) {
      return false;
    }

    throw new Error(
      `AUTH_SELF_REGISTRATION_ENABLED must be boolean-like, got: ${value}`,
    );
  }
}
