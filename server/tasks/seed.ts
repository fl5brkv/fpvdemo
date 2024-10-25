export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task for items, drones, and batteries',
  },
  async run() {
    console.log('Running DB seed task...');

    const user = {
      email: 'mail@mail.mail',
      hashedPassword: 'heslo123',
      passwordSalt: 'salt123',
      verifiedEmail: true,
    };

    const items = [
      {
        userId: 1,
        itemName: 'Battery',
        category: 'battery',
        status: 'active',
        purchasePrice: 50,
        purchaseDate: '2024-09-15',
        salePrice: null,
        saleDate: null,
        additionalInfo: 'LiPo 1',
      },
      {
        userId: 1,
        itemName: 'FPV Drone',
        category: 'drone',
        status: 'new',
        purchasePrice: 300,
        purchaseDate: '2024-10-01',
        salePrice: null,
        saleDate: null,
        additionalInfo: 'High-speed drone with HD camera.',
      },
      {
        userId: 1,
        itemName: 'Frame',
        category: 'frame',
        status: 'new',
        purchasePrice: 20,
        purchaseDate: '2024-10-01',
        salePrice: null,
        saleDate: null,
        additionalInfo: 'frame used in build',
      },
    ];

    const flightSessions = [
      {
        userId: 1,
        publicFlightSessionId: 'FLIGHT-0012',
        datetimeStart: '2024-10-01T10:00:00Z',
        datetimeEnd: '2024-10-01T11:00:00Z',
        location: 'Central Park, NY',
        lat: 40.785091,
        lng: -73.968285,
        numberOfFlights: 3,
        timeInAir: 30, // in minutes
        purpose: 'recreational',
        additionalInfo: 'First flight of the new drone.',
      },
      {
        userId: 1,
        publicFlightSessionId: 'FLIGHT-0022',
        datetimeStart: '2024-10-02T14:00:00Z',
        datetimeEnd: '2024-10-02T15:30:00Z',
        location: 'Brooklyn Bridge, NY',
        lat: 40.7061,
        lng: -73.9969,
        numberOfFlights: 5,
        timeInAir: 45, // in minutes
        purpose: 'filming',
        additionalInfo: 'Filming the sunset over the bridge.',
      },
      {
        userId: 1,
        publicFlightSessionId: 'FLIGHT-0032',
        datetimeStart: '2024-10-03T09:30:00Z',
        datetimeEnd: '2024-10-03T10:15:00Z',
        location: 'Battery Park, NY',
        lat: 40.7033,
        lng: -74.017,
        numberOfFlights: 2,
        timeInAir: 25, // in minutes
        purpose: 'testing',
        additionalInfo: 'Testing new drone features.',
      },
    ];

    // await useDrizzle().insert(tables.users).values(user);

    // @ts-ignore
    await useDrizzle().insert(tables.items).values(items);

    // @ts-ignore
    await useDrizzle().insert(tables.flightSessions).values(flightSessions);

    return {result: 'success'};
  },
});
