import { AadhaarLogin } from './AadhaarLogin';
import { OfficerLogin } from './OfficerLogin';

// Clean re-exports ensuring backward compatibility
export const CitizenLogin = AadhaarLogin;
export { AadhaarLogin, OfficerLogin };
export default AadhaarLogin;
