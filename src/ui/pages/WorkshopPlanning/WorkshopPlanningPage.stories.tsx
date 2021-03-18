import { action } from '@storybook/addon-actions';
import { WorkshopPlanningPage } from './WorkshopPlanningPage';

export default {
  title: 'Pages/Workshop Planning',
  component: WorkshopPlanningPage,
};

export const WorkshopPlanning = () => (
  <WorkshopPlanningPage
    createWorkshop={action('createWorkshop')}
  />
);
