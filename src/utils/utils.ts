import { Station } from "../types/Station.ts";
import geoJson from "../shared/stations.json";


export default class Utils {
  static mapJsonIntoStations = (): Station[] => {
    return geoJson.features.map(station => ({
      id: station.id,
      name: station.properties?.name,
      shortname: station.properties?.shortname,
      line: station.properties?.line,
      order: station.properties?.order,
      coordinates: station.geometry?.coordinates as [number, number]
    })) as Station[];
  }

  static fetchStationFromId = (id: string, stations?: Station[]): Station | undefined => {
    if(!stations) {
      stations = Utils.mapJsonIntoStations();
    }
    return stations.find((s: Station) => s.id === +id);
  }
  
  static fetchStationsFromIds = (ids: string[]): Station[] | [] => {
    if (!ids?.length) return [];
    
    const fetchedStations: Station[] = [];
    const stations: Station[] = Utils.mapJsonIntoStations();
    ids.forEach((id: string) => {
      const fetched = Utils.fetchStationFromId(id, stations);
      if (fetched)
        fetchedStations.push(fetched);
    })
    
    return fetchedStations;
  }
  
  static totalNumberOfStations = (): number => {
    return Utils.mapJsonIntoStations().length;
  }
  
  static numberOfStationsForLine = (line: string): number => {
    return Utils.mapJsonIntoStations().filter(s => s.line === line).length;
  }
}