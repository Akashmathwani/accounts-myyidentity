export type LoginData = {
  session: SessionData;
};

export type SessionData = {
  token: string;
  expires_at: number;
  status: string;
  provider: string;
};

export type SessionDataMap = {
  email: string;
  data: SessionData;
};
