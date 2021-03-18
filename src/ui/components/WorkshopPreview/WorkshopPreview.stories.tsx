import { action } from '@storybook/addon-actions';
import { MOCK_WORKSHOP } from '../../../mocks';
import { WorkshopPreview as WorkshopPreviewComponent } from './WorkshopPreview';

export default {
  title: 'Components/Workshop Preview',
  component: WorkshopPreviewComponent,
};

export const WorkshopPreview = () => (
  <WorkshopPreviewComponent
    workshop={MOCK_WORKSHOP}
    onClick={action('onClick')}
  />
);
