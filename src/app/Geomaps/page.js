import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { allGeoJson, getKelurahanJson } from 'geojson-indonesia';

const Geomaps = () => {
  const [GeoJSON, setGeoJSON] = useState(null);
  const [MapContainer, setMapContainer] = useState(null);
  const kelurahanJSON = getKelurahanJson();

  useEffect(() => {
    console.log(allGeoJson); // log data to console to verify

    import('react-leaflet').then(leaflet => {
      setGeoJSON(() => leaflet.GeoJSON);
      setMapContainer(() => leaflet.MapContainer);
    });
  }, []);

  if (!GeoJSON || !MapContainer) {
    return null; // or a loading spinner
  }

  return (
    <MapContainer center={[-2.548926, 118.0148634]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <GeoJSON data={allGeoJson[0].data} />
    </MapContainer>
  );
};

export default Geomaps;