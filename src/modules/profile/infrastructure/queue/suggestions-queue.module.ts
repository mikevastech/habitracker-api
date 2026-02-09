import { Inject, Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { ProfileModule } from '../../profile.module';
import { SuggestionsProcessor } from './suggestions.processor';

const QUEUE_NAME = 'suggestions';
const GLOBAL_EVERY_MS = 60 * 60 * 1000; // 1h
const GRAPH_EVERY_MS = 30 * 60 * 1000; // 30 min

@Module({
  imports: [ProfileModule],
  providers: [
    SuggestionsProcessor,
    {
      provide: 'SUGGESTIONS_QUEUE',
      useFactory: (redis: Redis) =>
        new Queue(QUEUE_NAME, {
          connection: redis,
          defaultJobOptions: { removeOnComplete: { count: 100 } },
        }),
      inject: ['REDIS_CLIENT'],
    },
    {
      provide: 'SUGGESTIONS_WORKER',
      useFactory: (redis: Redis, processor: SuggestionsProcessor) =>
        new Worker(QUEUE_NAME, (job) => processor.handle(job), {
          connection: redis,
          concurrency: 1,
        }),
      inject: ['REDIS_CLIENT', SuggestionsProcessor],
    },
  ],
  exports: ['SUGGESTIONS_QUEUE'],
})
export class SuggestionsQueueModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('SUGGESTIONS_QUEUE') private readonly queue: Queue,
    @Inject('SUGGESTIONS_WORKER') private readonly worker: Worker,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add('global', {}, { repeat: { every: GLOBAL_EVERY_MS } });
    await this.queue.add('graph-proximity', {}, { repeat: { every: GRAPH_EVERY_MS } });
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
  }
}
