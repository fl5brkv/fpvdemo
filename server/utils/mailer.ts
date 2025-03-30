import {WorkerMailer} from 'worker-mailer';

export const mailerPromise = (async () => {
  return await WorkerMailer.connect({
    credentials: {
      username: 'fc0c4cc30eb910',
      password: '6e9b961643a33c',
    },
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
  });
})();
