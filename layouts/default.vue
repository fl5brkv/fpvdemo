<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader childClass="border-b-4 p-3 border-gray-300" />
    <TheMain childClass="flex-grow mx-12 my-8"><slot /></TheMain>
    <TheFooter childClass="p-3 border-t-4" />
  </div>
</template>
