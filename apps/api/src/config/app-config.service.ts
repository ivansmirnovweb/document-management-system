import { Injectable } from '@nestjs/common';

type NodeEnv = 'development' | 'test' | 'production';

type AppConfigValues = {
  nodeEnv: NodeEnv;
  port: number;
  webOrigin: string;
  databaseUrl: string;
  jwtSecret: string;
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

  private parse(env: NodeJS.ProcessEnv): AppConfigValues {
    const nodeEnv = this.parseNodeEnv(env.NODE_ENV);
    const port = this.parsePort(env.PORT ?? '4000');
    const webOrigin = env.WEB_ORIGIN ?? 'http://localhost:3000';
    const databaseUrl =
      env.DATABASE_URL ??
      'postgres://postgres:postgres@localhost:5432/document_flow';
    const jwtSecret = env.JWT_SECRET ?? 'change-me-in-production';

    return { nodeEnv, port, webOrigin, databaseUrl, jwtSecret };
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
}
