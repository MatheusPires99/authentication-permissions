import { GetServerSidePropsContext } from 'next';

import { destroyCookie } from 'nookies';

export const removeAuthTokens = (ctx?: GetServerSidePropsContext) => {
  destroyCookie(ctx || undefined, '@Authentication:token');
  destroyCookie(ctx || undefined, '@Authentication:refreshToken');
};
