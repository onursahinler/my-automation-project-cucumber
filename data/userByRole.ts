import { users, Credentials } from './users';

/**
 * userByRole
 * ----------
 * Gherkin senaryolarında kullanılan insan-okur rol adlarını
 * `data/users.ts`'teki kimlik bilgilerine eşler.
 *
 * Örn:  Eğer ki "kilitli" kullanıcısı ile giriş yaparım
 *        -> users.lockedOutUser
 */
export const userByRole: Record<string, Credentials> = {
  standart: users.standardUser,
  kilitli: users.lockedOutUser,
  problemli: users.problemUser,
  yavaş: users.performanceGlitchUser,
  hatalı: users.errorUser,
  geçersiz: users.invalidUser,
};
