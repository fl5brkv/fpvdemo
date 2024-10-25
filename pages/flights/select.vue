<template>
    <div class="p-4">
      <h1 class="text-xl font-semibold mb-4">Flight Sessions List</h1>
      <table class="min-w-full border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border-b">Flight Session ID</th>
            <th class="px-4 py-2 border-b">User ID</th>
            <th class="px-4 py-2 border-b">Public Flight Session ID</th>
            <th class="px-4 py-2 border-b">Start Date & Time</th>
            <th class="px-4 py-2 border-b">End Date & Time</th>
            <th class="px-4 py-2 border-b">Location</th>
            <th class="px-4 py-2 border-b">Latitude</th>
            <th class="px-4 py-2 border-b">Longitude</th>
            <th class="px-4 py-2 border-b">Number of Flights</th>
            <th class="px-4 py-2 border-b">Time in Air (min)</th>
            <th class="px-4 py-2 border-b">Purpose</th>
            <th class="px-4 py-2 border-b">Additional Info</th>
            <th class="px-4 py-2 border-b">Updated At</th>
            <th class="px-4 py-2 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flightSession in data" :key="flightSession.flightSessionId">
            <td class="px-4 py-2 border-b">
              {{ flightSession.flightSessionId }}
            </td>
            <td class="px-4 py-2 border-b">{{ flightSession.userId }}</td>
            <td class="px-4 py-2 border-b">
              {{ flightSession.publicFlightSessionId }}
            </td>
            <td class="px-4 py-2 border-b">{{ flightSession.datetimeStart }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.datetimeEnd }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.location }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.lat }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.lng }}</td>
            <td class="px-4 py-2 border-b">
              {{ flightSession.numberOfFlights }}
            </td>
            <td class="px-4 py-2 border-b">{{ flightSession.timeInAir }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.purpose }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.additionalInfo }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.updatedAt }}</td>
            <td class="px-4 py-2 border-b">{{ flightSession.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  const {data} = await useFetch('/api/flight-session');
  </script>
  