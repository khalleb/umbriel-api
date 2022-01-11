import { AppLogger } from '@shared/logger';

import { kafka } from './client';

export const consumer = kafka.consumer({
  groupId: 'umbriel-consumer',
  allowAutoTopicCreation: true,
});

const topics = ['umbriel.subscribe-from-email'] as const;

type Topic = typeof topics[number];

export async function start() {
  await consumer.connect();

  await Promise.all(
    topics.map(topic => {
      return consumer.subscribe({ topic });
    }),
  );

  await consumer.run({
    async eachMessage({ topic, message }) {
      try {
        switch (topic as Topic) {
          case 'umbriel.subscribe-from-email':
            AppLogger.info({ message });
            // await subscribeUserHandler(message);
            break;
          default:
            AppLogger.error({ message: `Kafka topic not handled: ${topic}` });
            break;
        }
      } catch (error) {
        AppLogger.error({ message: error });
      }
    },
  });
}
