import {WorkerMailer} from 'worker-mailer';
import {useRuntimeConfig} from '#imports';

export const mailerPromise = (async () => {
  const config = useRuntimeConfig();

  return await WorkerMailer.connect({
    credentials: {
      username: config.mailerUsername,
      password: config.mailerPassword,
    },
    host: config.mailerHost || 'sandbox.smtp.mailtrap.io',
    port: config.mailerPort || 587,
    secure: false,
  });
})();
