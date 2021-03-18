import { action } from '@storybook/addon-actions';
import { MOCK_WORKSHOP } from '../../../mocks';
import { OverviewPage } from './OverviewPage';

export default {
  title: 'Pages/Overview',
  component: OverviewPage,
};

export const Overview = () => (
  <OverviewPage
    workshops={[MOCK_WORKSHOP, MOCK_WORKSHOP]}
    redirectToWorkshopPage={action(
      'redirectToWorkshopPage'
    )}
    redirectToWorkshopPlanningPage={action(
      'redirectToWorkshopPlanningPage'
    )}
  />
);
