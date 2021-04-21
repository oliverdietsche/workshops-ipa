import { action } from '@storybook/addon-actions';
import { MOCK_WORKSHOP } from '../../../mocks';
import { WorkshopPreviewList as WorkshopPreviewListComponent } from './WorkshopPreviewList';

export default {
  title: 'Components/Workshop Preview List',
  component: WorkshopPreviewListComponent,
};

export const WorkshopPreviewList = () => (
  <WorkshopPreviewListComponent
    workshops={[
      MOCK_WORKSHOP,
      MOCK_WORKSHOP,
      MOCK_WORKSHOP,
      MOCK_WORKSHOP,
      MOCK_WORKSHOP,
    ]}
    onClick={action('onClick')}
  />
);
