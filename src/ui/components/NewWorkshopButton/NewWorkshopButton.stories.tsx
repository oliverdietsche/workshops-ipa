import { action } from '@storybook/addon-actions';
import { NewWorkshopButton as NewWorkshopButtonComponent } from './NewWorkshopButton';

export default {
  title: 'Components/New Workshop Button',
  component: NewWorkshopButtonComponent,
};

export const NewWorkshopButton = () => (
  <NewWorkshopButtonComponent
    redirectToWorkshopPlanningPage={action(
      'redirectToWorkshopPlanningPage'
    )}
  />
);
