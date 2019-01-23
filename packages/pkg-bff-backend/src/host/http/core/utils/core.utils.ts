import { Request } from 'express';

export interface IAuthHttpHeader {
  scheme: string;
  value: string;
}

export const parseAuthHeader = (hdrValue): IAuthHttpHeader | null => {
  if (typeof hdrValue !== 'string') return null;

  const matches = hdrValue.match(/(\S+)\s+(\S+)/);

  if (!matches) return null;

  return { scheme: matches[1].toLowerCase(), value: matches[2] };
};

export const getReqMetadataLite = (req: Request) => {
  return {
    ip: req.ip,
    ips: req.ips,
    originalUrl: req.originalUrl,
    userAgent: req.headers['user-agent'],
  };
};
