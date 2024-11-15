<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader childClass="border-b-4 border-[#333333]" />
    <TheMain childClass="flex-grow p-11"><slot /></TheMain>
    <TheFooter childClass="border-t-4 py-1.5 border-[#333333] text-center" />
  </div>
</template>
