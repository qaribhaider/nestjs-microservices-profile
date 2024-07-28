import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';

@Injectable()
export class MetricsService {
  constructor(private prismaService: PrismaService) {}

  getHello() {
    return {
      message: 'Welcome to metrics service',
      status: 'success',
    };
  }

  @RabbitSubscribe({
    exchange: 'auth_exchange',
    routingKey: '',
    queue: 'metrics_queue',
  })
  handleUserEvents(event: any) {
    Logger.log(`Received event: ${JSON.stringify(event)}`);

    const eventType = event.event;

    if (eventType === 'user_registered' || eventType === 'user_logged_in') {
      const userData = event.user;

      this.create({
        eventType,
        userId: userData.id,
        eventData: {
          name: userData.name,
          email: userData.email,
        },
      });
    } else {
      this.create({
        eventType,
        userId: event?.user?.id ?? '',
        eventData: {
          ...event,
        },
      });
    }
  }

  async create(createMetric: CreateMetricDto) {
    return this.prismaService.metric.create({
      data: createMetric,
    });
  }
}
