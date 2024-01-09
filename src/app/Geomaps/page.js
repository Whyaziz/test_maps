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
        mouseover: () => layer.setStyle(highlightStyle),
        mouseout: () => layer.setStyle(normalStyle),
        click: () => {
          map.fitBounds(layer.getBounds());
          layer.setStyle(highlightStyle);
        }
      });
    };

    return <GeoJSON data={allGeoJson[0].data} onEachFeature={onEachFeature} style={normalStyle} />;
  };

  return (
    <MapContainer center={[-2.548926, 118.0148634]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <GeoJSONWithClick />
    </MapContainer>
  );
};

export default Geomaps;