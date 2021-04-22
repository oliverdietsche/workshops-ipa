import { action } from '@storybook/addon-actions';
import { WorkshopForm as WorkshopFormComponent } from './WorkshopForm';

export default {
  title: 'Components/Workshop Form',
  component: WorkshopFormComponent,
};

export const WorkshopForm = () => (
  <WorkshopFormComponent
    formTitle="Workshop Form"
    submitText="Submit Button"
    onSubmit={action('onSubmit')}
  />
);
