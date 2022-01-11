import { KafkaMessage } from 'kafkajs';

import { IKafkaHandler } from '../core/KafkaHandler';

export const adaptKafkaHandler = (handler: IKafkaHandler) => {
  return async (message: KafkaMessage) => {
    if (message?.value) {
      await handler.handle(JSON.parse(message.value.toString()));
    }
  };
};
