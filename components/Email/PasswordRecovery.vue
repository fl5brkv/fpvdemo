<template>
  <Html>
    <Head />
    <Body>
      <Section>
        {{ recoveryLink }}
      </Section>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import {Html, Head, Body, Section} from '@vue-email/components';

defineProps<{
  recoveryLink?: string;
}>();
</script>
