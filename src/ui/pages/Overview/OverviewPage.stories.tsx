import { action } from '@storybook/addon-actions';
import { formatRFC3339, subDays } from 'date-fns';
import { MOCK_WORKSHOP } from '../../../mocks';
import { OverviewPage } from './OverviewPage';

export default {
  title: 'Pages/Overview',
  component: OverviewPage,
};

const PAST_WORKSHOP: IWorkshop = {
  ...MOCK_WORKSHOP,
  details: {
    ...MOCK_WORKSHOP.details,
    start: formatRFC3339(subDays(new Date(), 3)),
  },
};

export const WithFutureAndPastWorkshops = () => (
  <OverviewPage
    workshops={[
      MOCK_WORKSHOP,
      PAST_WORKSHOP,
      PAST_WORKSHOP,
      PAST_WORKSHOP,
    ]}
    redirectToWorkshopPage={action(
      'redirectToWorkshopPage'
    )}
    redirectToWorkshopPlanningPage={action(
      'redirectToWorkshopPlanningPage'
    )}
  />
);

export const WithoutPastWorkshops = () => (
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

export const WithoutFutureWorkshops = () => (
  <OverviewPage
    workshops={[PAST_WORKSHOP]}
    redirectToWorkshopPage={action(
      'redirectToWorkshopPage'
    )}
    redirectToWorkshopPlanningPage={action(
      'redirectToWorkshopPlanningPage'
    )}
  />
);

export const WithoutAnyWorkshops = () => (
  <OverviewPage
    workshops={[]}
    redirectToWorkshopPage={action(
      'redirectToWorkshopPage'
    )}
    redirectToWorkshopPlanningPage={action(
      'redirectToWorkshopPlanningPage'
    )}
  />
);
