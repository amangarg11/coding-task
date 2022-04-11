import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Schemas } from 'mongoose';

export type CityDocument = City & Document;

@Schema()
export class City {
  @Prop({type: Schemas.Types.String})
  name: string;

  @Prop({type: Schemas.Types.Number})
  lat: number;

  @Prop({type: Schemas.Types.Number})
  long: number;

}

export const CitySchema = SchemaFactory.createForClass(City);