import { Injectable } from '@nestjs/common';
import { City, CityDocument } from './schemas/cities';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CitiesService {
  constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>) { }

  public async suggestions(
    name: string,
    lat: number,
    long: number,
    radius: number,
    sort: string
  ) {
    const pipelineStages = []
    let distResult = []
    let sortResult = []
    const matchObjct = { $match: {} }
    //1. Match names by q 
    if (name) matchObjct['$match']['name'] = { '$regex': name, '$options': 'i' }
    pipelineStages.push(matchObjct)

    //last: return required fields only
    pipelineStages.push(
      {
        $project:
        {
          "name": 1,
          "lat": 1,
          "long": 1
        }
      }
    )
    const resultObject = await this.cityModel.aggregate(pipelineStages)
    // 2. Calculate radius 
    if (lat && long) {
      resultObject.forEach(resultObj => {
        let distance = this.calDistance(lat, long, resultObj.lat, resultObj.long);
        if (distance <= radius) {
          distResult.push({
            "name": resultObj.name,
            "latitude": resultObj.lat,
            "longitude": resultObj.long,
            "distance": Number(distance).toFixed(2)
          });
        }
      })
    } else distResult = resultObject;
    // 3. Sort
    if (sort) {
      sortResult = distResult.sort((a, b) => {
        if (sort == "distance")
          return parseFloat(a.distance) - parseFloat(b.distance)
        if (sort == "latitude")
          return parseFloat(a.latitude) - parseFloat(b.latitude)
        if (sort == "longitude")
          return parseFloat(a.longitude) - parseFloat(b.longitude)
      });
    } else sortResult = distResult;

    return {
      "suggestions":sortResult
    }
  }

  // Location Based Search
  public calDistance(lat1, lon1, lat2, lon2) {
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;
    // calculate the result
    return (c * r);
  }

}
