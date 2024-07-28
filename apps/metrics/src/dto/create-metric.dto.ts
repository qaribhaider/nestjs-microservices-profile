import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  eventData: object;
}
