import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import decode from 'jwt-decode';
import { parseCookies } from 'nookies';

import { AuthTokenError } from '../services/errors';
import { removeAuthTokens } from './removeAuthTokens';
import { PermissionsOptions, User } from '../types';
import { validateUserPermissions } from './validateUserPermissions';

export function withSSRAuth<T>(
  fn: GetServerSideProps<T>,
  options?: PermissionsOptions,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx);
    const token = cookies['@Authentication:token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<User>(token);
      const { permissions, roles } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
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
