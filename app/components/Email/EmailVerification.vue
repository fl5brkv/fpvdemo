<template>
  <Tailwind>
    <Html>
      <Head>
        <title>Email Verification</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-gray-50 font-sans p-6">
        <Section
          class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
          <!-- App Name -->
          <Heading as="h1" class="text-2xl font-bold text-gray-800 mb-6">
            Welcome to MyApp
          </Heading>

          <!-- Verification Text -->
          <Text class="text-gray-600 text-lg mb-6">
            To complete your registration, please verify your email address by
            clicking the button below
          </Text>

          <!-- Verify Button -->
          <Row>
            <Column align="center">
              <Button
                :href="verificationLink"
                target="_blank"
                class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
                Verify My Email
              </Button>
            </Column>
          </Row>

          <Text class="mt-4 text-gray-600 text-lg">
            or by going to this link:
            <br />
            <span class="text-blue-600 break-words">{{
              verificationLink
            }}</span>
          </Text>

          <!-- Footer Text -->
          <Text class="mt-8 text-gray-500 text-sm">
            If you did not request this email, please ignore it.
          </Text>
        </Section>
      </Body>
    </Html>
  </Tailwind>
</template>

<script setup lang="ts">
import {
  Head,
  Body,
  Button,
  Html,
  Text,
  Section,
  Row,
  Column,
  Heading,
  Tailwind,
} from '@vue-email/components';

defineProps<{
  verificationLink: string;
}>();
</script>
