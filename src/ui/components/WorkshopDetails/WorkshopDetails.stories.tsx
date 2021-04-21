import { action } from '@storybook/addon-actions';
import { MOCK_WORKSHOP } from '../../../mocks';
import { WorkshopDetails as WorkshopDetailsComponent } from './WorkshopDetails';

export default {
  title: 'Components/Workshop Details',
  component: WorkshopDetailsComponent,
};

export const WorkshopDetails = () => (
  <WorkshopDetailsComponent
    workshop={MOCK_WORKSHOP}
    redirectToWorkshopPlanningPage={action(
      'redirectToWorkshopPlanningPage'
    )}
    addAttendeeToWorkshop={action('addAttendeeToWorkshop')}
  />
);
