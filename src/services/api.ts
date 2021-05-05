import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import { signOut } from '../hooks/useAuth';

let isRefreshing = false;
let failedRequestsQueue = [];

export const setupApiClient = (ctx = undefined) => {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['@Authentication:token']}`,
    },
  });

  api.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(ctx);

          const { '@Authentication:refreshToken': refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post('/refresh', {
                refreshToken,
              })
              .then(response => {
                const {
                  token,
                  refreshToken: responseRefreshToken,
                } = response.data;

                setCookie(ctx, '@Authentication:token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                });
                setCookie(
                  ctx,
                  '@Authentication:refreshToken',
                  responseRefreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/',
                  },
                );

                api.defaults.headers.Authorization = `Bearer ${token}`;

                failedRequestsQueue.forEach(request =>
                  request.onSuccess(token),
                );
                failedRequestsQueue = [];
              })
              .catch(err => {
                failedRequestsQueue.forEach(request => request.onError(err));
                failedRequestsQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });

            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({
                onSuccess: (token: string) => {
                  originalConfig.headers.Authorization = `Bearer ${token}`;

                  resolve(api(originalConfig));
                },
                onError: (err: AxiosError) => {
                  reject(err);
                },
              });
            });
          }
        } else if (process.browser) {
          signOut();
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};
