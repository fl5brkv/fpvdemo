export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task for items, drones, and batteries',
  },
  async run() {
    console.log('Running DB seed task...');

    const user = {
      email: 'mail@mail.mail',
      password: 'pass23',
      verifiedEmail: true,
    };

    const items = [
      {
        userId: 1,
        itemName: 'Battery',
        category: 'battery',
        status: 'active',
        additionalInfo: 'LiPo 1',
      },
      {
        userId: 1,
        itemName: 'FPV Drone',
        category: 'drone',
        status: 'new',
        additionalInfo: 'High-speed drone with HD camera.',
      },
      {
        userId: 1,
        itemName: 'Frame',
        category: 'frame',
        status: 'new',
        additionalInfo: 'frame used in build',
      },
    ];

    const flightSessions = [
      {
        userId: 1,
        flightName: 'FLIGHT-0012',
        date: '2024-10-01T10:00:00Z',
        location: 'Central Park, NY',
        landings: 3,
        timeInAir: 30, // in minutes
        additionalInfo: 'First flight of the new drone.',
      },
      {
        userId: 1,
        flightName: 'FLIGHT-0022',
        date: '2024-10-02T14:00:00Z',
        location: 'Brooklyn Bridge, NY',
        landings: 5,
        timeInAir: 45, // in minutes
        additionalInfo: 'Filming the sunset over the bridge.',
      },
      {
        userId: 1,
        flightName: 'FLIGHT-0032',
        date: '2024-10-03T09:30:00Z',
        location: 'Battery Park, NY',
        landings: 2,
        timeInAir: 25, // in minutes
        additionalInfo: 'Testing new drone features.',
      },
    ];

    await useDrizzle().insert(tables.users).values(user);

    // @ts-ignore
    await useDrizzle().insert(tables.items).values(items);

    // @ts-ignore
    await useDrizzle().insert(tables.flights).values(flights);

    return {result: 'success'};
  },
});
