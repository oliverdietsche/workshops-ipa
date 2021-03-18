import { action } from '@storybook/addon-actions';
import { MOCK_WORKSHOP } from '../../../mocks';
import { WorkshopPage } from './WorkshopPage';

export default {
  title: 'Pages/Workshop',
  component: WorkshopPage,
};

export const Workshop = () => (
  <WorkshopPage
    workshop={MOCK_WORKSHOP}
    addAttendeeToWorkshop={action('addAttendeeToWorkshop')}
  />
);
