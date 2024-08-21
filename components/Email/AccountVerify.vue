<template>
  <Html>
    <Head />
    <Body>
      <Section>
        {{ verifyLink }}
      </Section>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { Html, Head, Body, Section } from '@vue-email/components';

defineProps<{
  verifyLink?: string;
}>();
</script>
