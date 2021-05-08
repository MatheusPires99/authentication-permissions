import { GetServerSideProps } from 'next';

import { Can } from '../components/Can';
import { useAuth } from '../hooks';
import { setupApiClient } from '../services';
import { withSSRAuth } from '../utils';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <Can permissions={['metrics.list']}>
        <h2>Métricas</h2>
      </Can>
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
