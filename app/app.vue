<template>
 <NuxtRouteAnnouncer />
  <div class="flex flex-col min-h-screen">
    <TheHeader childClass="border-b-2 border-gray-200" />
    <main class="flex-grow p-11"><NuxtPage /></main>
    <TheFooter childClass="border-t-2 py-1.5 border-b border-gray-200 text-center" />
  </div>
</template>
