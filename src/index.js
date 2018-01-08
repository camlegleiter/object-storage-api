import config from 'config';

import app from './app';

const port = config.get('port');

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
