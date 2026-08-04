export interface AppConfig {
  env: string;
  port: number;
  apiPrefix: string;
  databaseUrl: string;
}

export interface UserContext {
  id: string;
  email: string;
  companyId: string;
  role: string;
}
