import MapCom, { Layer, Source } from "react-map-gl/maplibre";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { ExpressionSpecification } from "maplibre-gl";
import { env } from "#/lib/env";
import { useState } from "react";

if (typeof window !== "undefined") {
  maplibregl.setWorkerUrl(workerUrl);
}

const PALETTE = [
  "#1f77b4",
  "#d62728",
  "#2ca02c",
  "#9467bd",
  "#ff7f0e",
  "#17becf",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
];

const userColor = [
  "match",
  ["%", ["to-number", ["get", "wf_user_id"]], PALETTE.length],
  ...PALETTE.flatMap((color, i) => [i, color]),
  "#888888", // fallback
] as ExpressionSpecification;

const defaultLineWidth = 3;

export default function MapView() {
  const [lineWidth, setLineWidth] = useState(defaultLineWidth);

  return (
    <MapCom
      mapLib={maplibregl}
      initialViewState={{
        longitude: 107.0249600917387,
        latitude: -6.301945394393446,
        zoom: 17,
      }}
      interactiveLayerIds={["tracks-line"]}
      onZoom={(e) => {
        const zoomLevel = e.target.getZoom();
        if (zoomLevel > 17) {
          setLineWidth(18);
          return;
        }
        setLineWidth(3);
      }}
      onClick={(e) => {
        //
        console.debug("kambing", {
          query: e.target.querySourceFeatures("tracks", {
            sourceLayer: "tracks",
          }),
          features: e.features,
        });

        const props = e.features?.[0]?.properties;
        if (props)
          console.debug("user", props.wf_user_id, "points", props.points);
      }}
      style={{ width: 600, height: 400 }}
      mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${env.VITE_MAPTILER_KEY}`}
    >
      <Source
        id="tracks"
        type="vector"
        tiles={[`${env.VITE_API_URL}/dummy/gis/{z}/{x}/{y}?day_interval=2`]}
        maxzoom={18}
      >
        <Layer
          id="tracks-line"
          type="line"
          source-layer="tracks"
          layout={{ "line-cap": "round", "line-join": "round" }}
          paint={{ "line-color": userColor, "line-width": lineWidth }}
        />
      </Source>
    </MapCom>
  );
}
