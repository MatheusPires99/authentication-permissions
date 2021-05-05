import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { parseCookies } from 'nookies';

import { AuthTokenError } from '../services/errors';
import { removeAuthTokens } from './removeAuthTokens';

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
        removeAuthTokens(ctx);

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
