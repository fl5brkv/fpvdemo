<template>
 <NuxtRouteAnnouncer />
  <div class="flex flex-col min-h-screen">
    <TheHeader childClass="border-b-4 border-[#333333]" />
    <main class="flex-grow p-11"><NuxtPage /></main>
    <TheFooter childClass="border-t-4 py-1.5 border-[#333333] text-center" />
  </div>
</template>
