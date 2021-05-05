import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { parseCookies } from 'nookies';

export function withSSRGuest<T>(fn: GetServerSideProps<T>) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx);

    if (cookies['@Authentication:token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    // eslint-disable-next-line no-return-await
    return await fn(ctx);
  };
}
