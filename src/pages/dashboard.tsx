import { GetServerSideProps } from 'next';

import { useAuth, usePermissions } from '../hooks';
import { setupApiClient } from '../services';
import { withSSRAuth } from '../utils';

export default function Dashboard() {
  const { user } = useAuth();
  const userCanSeeMetrics = usePermissions({
    permissions: ['metrics.list'],
  });

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      {userCanSeeMetrics && <h2>Métricas</h2>}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupApiClient(ctx);
  const response = await apiClient.get('/me');

  console.log(response.data);

  return {
    props: {},
  };
});
