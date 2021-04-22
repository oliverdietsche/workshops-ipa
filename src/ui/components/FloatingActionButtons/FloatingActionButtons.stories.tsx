import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { action } from '@storybook/addon-actions';
import {
  FloatingActionButtons,
  IFloatingActionsButtonsProps,
} from './FloatingActionButtons';

export default {
  title: 'Components/Floating Action Buttons',
  component: FloatingActionButtons,
};

const FAB_ITEMS: IFloatingActionsButtonsProps['items'] = [
  {
    color: 'primary',
    icon: <AddIcon />,
    onClick: () => action('firstButtonClicked'),
  },
  {
    color: 'secondary',
    icon: <DeleteIcon />,
    onClick: () => action('secondButtonClicked'),
  },
];

export const OneButton = () => (
  <FloatingActionButtons items={[FAB_ITEMS[0]]} />
);

export const MultipleButtons = () => (
  <FloatingActionButtons items={FAB_ITEMS} />
);
