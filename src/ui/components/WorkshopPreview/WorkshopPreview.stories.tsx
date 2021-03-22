import { action } from '@storybook/addon-actions';
import { MOCK_WORKSHOP } from '../../../mocks';
import { WorkshopPreview as WorkshopPreviewComponent } from './WorkshopPreview';

export default {
  title: 'Components/Workshop Preview',
  component: WorkshopPreviewComponent,
};

export const ShortTitle = () => (
  <WorkshopPreviewComponent
    workshop={MOCK_WORKSHOP}
    onClick={action('onClick')}
  />
);

export const LongTitle = () => (
  <WorkshopPreviewComponent
    workshop={{
      ...MOCK_WORKSHOP,
      details: {
        ...MOCK_WORKSHOP.details,
        title: 'This is a Workshop with a very long title',
      },
    }}
    onClick={action('onClick')}
  />
);
