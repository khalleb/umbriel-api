interface IKafkaHandler<T = any> {
  handle: (message: T) => Promise<void>;
}
export { IKafkaHandler };
