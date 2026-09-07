import { jwtDecode } from 'jwt-decode';
import { AffiliateTokenPayload } from '../types/affiliate.types';

export const decodeAffiliateToken = (token: string): AffiliateTokenPayload => {
  return jwtDecode<AffiliateTokenPayload>(token);
};
