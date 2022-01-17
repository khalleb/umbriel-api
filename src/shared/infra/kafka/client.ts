import { Kafka, KafkaConfig } from 'kafkajs';

import { env } from '@shared/env';

const config: KafkaConfig = {
  clientId: 'umbriel',
  brokers: env.KAFKA_BROKERS.split(','),
};

if (env.KAFKA_USERNAME) {
  config.sasl = {
    mechanism: 'plain',
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
  };
}
export const kafka = new Kafka(config);
