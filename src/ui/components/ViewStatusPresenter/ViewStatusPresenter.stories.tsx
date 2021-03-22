import { action } from '@storybook/addon-actions';
import { ViewStatusPresenter as ViewStatusPresenterComponent } from './ViewStatusPresenter';

export default {
  title: 'Components/View Status Presenter',
  component: ViewStatusPresenterComponent,
};

const VIEW_STATUS_MESSAGES = {
  waiting: 'Du wirst dem Workshop hinzugefügt',
  success:
    'Deine Teilnahme wurde bestätigt. Du hast ein Mail erhalten und der Workshop ist deinem Kalender hinzugefügt worden.',
  error:
    'Beim Versuch deine Teilnahme zu registrieren ist ein Fehler unterlaufen.',
};

export const Active = () => (
  <ViewStatusPresenterComponent
    status={'ACTIVE'}
    setStatus={action('setStatus')}
    messages={VIEW_STATUS_MESSAGES}
  />
);

export const Waiting = () => (
  <ViewStatusPresenterComponent
    status={'WAITING'}
    setStatus={action('setStatus')}
    messages={VIEW_STATUS_MESSAGES}
  />
);

export const Success = () => (
  <ViewStatusPresenterComponent
    status={'SUCCESS'}
    setStatus={action('setStatus')}
    messages={VIEW_STATUS_MESSAGES}
  />
);

export const Error = () => (
  <ViewStatusPresenterComponent
    status={'ERROR'}
    setStatus={action('setStatus')}
    messages={VIEW_STATUS_MESSAGES}
  />
);
