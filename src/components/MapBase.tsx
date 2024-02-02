import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import geoJson from "../shared/stations.json";
import { FeatureCollection } from "geojson";
import { usePlayerProgress } from "../providers/PlayerProgress.tsx";
import { Station } from "../types/Station.ts";


function MapBase() {

  mapboxgl.accessToken = 'pk.eyJ1IjoiaXBwbGUiLCJhIjoiY2xuNmJhcTlhMGtkNDJvcW1qYmFtMjZpOSJ9.3A79oLKQGkqfzSIZNaoP0w';

  const featureCollection = geoJson as FeatureCollection;

  const {
    foundStations,
    clickedStation,
    updateMapLoaded,
  } = usePlayerProgress();

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/ipple/clokrj94w007z01qm7gtda2f3',
      center: [4.854731, 45.753792],
      bounds: [
        [4.75, 45.802],
        [4.95, 45.693]
      ],
      zoom: 12,
      maxZoom: 19
    });

    setMap(map);

    return map.on("load", () => {
      map.addSource(
        "lyon", {
          type: "geojson",
          data: featureCollection
        }
      );
      map.addLayer({
        id: "metro-circles",
        type: "circle",
        source: "lyon",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 2, 16, 6],
          "circle-color": ["case", ["to-boolean", ["feature-state", "found"]], ["get", "color"], "rgba(255, 255, 255, 0.8)"],
          "circle-stroke-width": 2
        }
      });
      map.addLayer({
        id: "metro-labels",
        type: "symbol",
        source: "lyon",
        minzoom: 11,
        layout: {
          "text-field": ["to-string", ["get", "name"]],
          "text-font": ["Open Sans Regular"],
          "text-anchor": "bottom",
          "text-offset": [0, -1],
          "text-size": 12,
        },
        paint: {
          "text-color": ["case", ["to-boolean", ["feature-state", "found"]], "rgb(29, 40, 53)", "rgba(0, 0, 0, 0)"],
          "text-halo-color": ["case", ["to-boolean", ["feature-state", "found"]], "rgba(255, 255, 255, 0.8)", "rgba(0, 0, 0, 0)"],
          "text-halo-blur": 1,
          "text-halo-width": 1
        }
      });
      updateMapLoaded(true);
    }), () => {
      map.remove()
    };


  }, []);

  useEffect(() => {
    if (!map) return;

    foundStations.map(s => {
      map.setFeatureState({
        source: 'lyon',
        id: s.id,
      }, {
        found: true
      });
    });
    // Handle fly to clicked station
    if (clickedStation) {
      flyToStation(map, clickedStation);
    }
  }, [foundStations, clickedStation]);


  const flyToStation = (map: mapboxgl.Map, station: Station) => {
    if (!station?.coordinates) return;

    map.flyTo({
      zoom: 13,
      center: station.coordinates
    })
  }

  return (
    <div id="map" className="map-container relative flex justify-center h-full grow"/>
  )
}

export default MapBase;
