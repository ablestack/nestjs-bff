export const Env = (key: string, fallback: any = null) => {
  return process.env[key] == null ? fallback : process.env[key];
};
