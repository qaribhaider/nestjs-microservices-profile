import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MetricsService {
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

    // TODO: Implement logic to record the user registration or login event
    if (event.event === 'user_registered') {
      // TODO: Handle user registered event
    } else if (event.event === 'user_logged_in') {
      // TODO: Handle user logged in event
    }
  }
}
