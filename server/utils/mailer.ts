export const mailerPromise = (async () => {
  try {
    const {WorkerMailer} = await import('worker-mailer'); // ✅ Correct
    const config = useRuntimeConfig();

    return await WorkerMailer.connect({
      credentials: {
        username: config.mailerUsername,
        password: config.mailerPassword,
      },
      host: config.mailerHost || 'sandbox.smtp.mailtrap.io',
      port: Number(config.mailerPort) || 587,
      secure: false,
    });
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
})();
