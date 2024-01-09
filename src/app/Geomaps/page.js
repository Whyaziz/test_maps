import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { allGeoJson, getKelurahanJson } from 'geojson-indonesia';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';

const Geomaps = () => {
  const kelurahanJSON = getKelurahanJson();

  useEffect(() => {
    console.log(allGeoJson); // log data to console to verify
  }, []);

  const GeoJSONWithClick = () => {
    const map = useMap();

    const highlightStyle = { color: '#2262CC', weight: 3, opacity: 0.6, fillOpacity: 0.65, fillColor: '#2262CC' };
    const normalStyle = { color: 'blue', weight: 2, opacity: 0.6, fillOpacity: 0.65, fillColor: 'blue' };

    const onEachFeature = (feature, layer) => {
      layer.on({
        click: (e) => {
          e.originalEvent.stopPropagation();
          map.fitBounds(layer.getBounds());
          layer.setStyle(highlightStyle);
        }
      });
    };

    return <GeoJSON data={allGeoJson[0].data} onEachFeature={onEachFeature} style={normalStyle} />;
  };

  const initialPosition = [-2.548926, 118.0148634];
  const initialZoom = 5;

  return (
    <MapContainer center={initialPosition} zoom={initialZoom} style={{ height: "100vh", width: "100%" }} whenCreated={mapInstance => {
      mapInstance.on('click', () => {
        mapInstance.setView(initialPosition, initialZoom);
      });
    }}>
      <GeoJSONWithClick />
    </MapContainer>
  );
};

export default Geomaps;