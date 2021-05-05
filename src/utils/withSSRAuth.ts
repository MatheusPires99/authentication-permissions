import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { destroyCookie, parseCookies } from 'nookies';

import { AuthTokenError } from '../services/errors';

export function withSSRAuth<T>(fn: GetServerSideProps<T>) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx);

    if (!cookies['@Authentication:token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      // eslint-disable-next-line no-return-await
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '@Authentication:token');
        destroyCookie(ctx, '@Authentication:refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
