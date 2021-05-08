import { GetServerSideProps } from 'next';

import { setupApiClient } from '../services';
import { withSSRAuth } from '../utils';

export default function Metrics() {
  return (
    <>
      <h1>Métricas</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async ctx => {
    const apiClient = setupApiClient(ctx);
    const response = await apiClient.get('/me');

    return {
      props: {},
    };
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  },
);
