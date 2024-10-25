<template>
  <!-- select -->
  <div class="p-4">
    <h1 class="text-xl font-semibold mb-4">Items List</h1>
    <table class="min-w-full border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b">Item ID</th>
          <th class="px-4 py-2 border-b">User ID</th>
          <th class="px-4 py-2 border-b">Item Name</th>
          <th class="px-4 py-2 border-b">Category</th>
          <th class="px-4 py-2 border-b">Status</th>
          <th class="px-4 py-2 border-b">Purchase Price</th>
          <th class="px-4 py-2 border-b">Purchase Date</th>
          <th class="px-4 py-2 border-b">Sale Price</th>
          <th class="px-4 py-2 border-b">Sale Date</th>
          <th class="px-4 py-2 border-b">Additional Info</th>
          <th class="px-4 py-2 border-b">Updated At</th>
          <th class="px-4 py-2 border-b">Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.itemId">
          <td class="px-4 py-2 border-b">{{ item.itemId }}</td>
          <td class="px-4 py-2 border-b">{{ item.userId }}</td>
          <td class="px-4 py-2 border-b">{{ item.itemName }}</td>
          <td class="px-4 py-2 border-b">{{ item.category }}</td>
          <td class="px-4 py-2 border-b">{{ item.status }}</td>
          <td class="px-4 py-2 border-b">{{ item.purchasePrice }}</td>
          <td class="px-4 py-2 border-b">{{ item.purchaseDate }}</td>
          <td class="px-4 py-2 border-b">{{ item.salePrice }}</td>
          <td class="px-4 py-2 border-b">{{ item.saleDate }}</td>
          <td class="px-4 py-2 border-b">{{ item.additionalInfo }}</td>
          <td class="px-4 py-2 border-b">{{ item.updatedAt }}</td>
          <td class="px-4 py-2 border-b">{{ item.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// select
const {data} = await useFetch('/api/item');

// const call = async () => {
//   try {
//     await $fetch('/api/item', {
//       method: 'POST',
//       body: {
//         itemRow: [
//           {
//             itemName: 'battery 1',
//             category: 'battery',
//           },
//           {
//             itemName: 'fpv drone 1',
//             category: 'fpv drone',
//           },
//           {
//             itemName: 'Goggles',
//             category: 'goggles',
//           },
//           {
//             itemName: 'fpv drone 2',
//             category: 'fpv drone',
//           },
//         ],
//         batteryRow: [
//           {
//             chargeCycles: 19,
//             fullyChargedDays: 1,
//           },
//           {
//             chargeCycles: 10,
//             fullyChargedDays: 2,
//           },
//         ],
//       },
//     });
//   } catch (err: any) {
//     console.log(err);
//   }
// };
</script>
