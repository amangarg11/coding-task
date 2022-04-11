import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { response } from 'express';
import { CitiesService } from './cities.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';


@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  @Get('suggestions')
  async suggestions(
    @Query('q') name: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
    @Query('sort') sort: string,
  ) {
    if ((latitude && longitude) && !radius || !(latitude && longitude) && radius) {
      return response.status(403).json({
        message: 'coordinate and radius should be both sent'
      })
    }
    const lat = +latitude
    const long = +longitude
    radius = +radius

    return this.citiesService.suggestions(name, lat, long, radius, sort);
  }
}
