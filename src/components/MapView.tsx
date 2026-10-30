import MapCom, { Layer, Source } from "react-map-gl/maplibre";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { setWorkerUrl, type ExpressionSpecification } from "maplibre-gl";
import { env } from "#/lib/env";
import { useState } from "react";
import { formatISO } from "date-fns";

if (typeof window !== "undefined") {
  setWorkerUrl(workerUrl);
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
  ["%", ["to-number", ["get", "userID"]], PALETTE.length],
  ...PALETTE.flatMap((color, i) => [i, color]),
  "#888888", // fallback
] as ExpressionSpecification;

const defaultLineWidth = 3;

type Props = {
  startRecordedAt: Date;
  endRecordedAt: Date;
};

export default function MapView({ startRecordedAt, endRecordedAt }: Props) {
  const [lineWidth, setLineWidth] = useState(defaultLineWidth);

  const sp = new URLSearchParams({
    start_recorded_at: formatISO(startRecordedAt),
    end_recorded_at: formatISO(endRecordedAt),
  });

  return (
    <MapCom
      mapLib={maplibregl}
      initialViewState={{
        longitude: 106.85770682763189,
        latitude: -6.358889537379909,
        zoom: 13,
      }}
      interactiveLayerIds={["kuda-lumping", "kuda-lumping-last-loc"]}
      onZoom={(e) => {
        const zoomLevel = e.target.getZoom();
        if (zoomLevel > 17) {
          setLineWidth(18);
          return;
        }
        setLineWidth(3);
      }}
      onClick={(e) => {
        const asd = e.target.querySourceFeatures("kambing-jantan", {
          sourceLayer: "user-line-history",
        });

        const jkl = e.target.querySourceFeatures("kambing-jantan-point", {
          sourceLayer: "user-last-location",
        });

        console.debug("kambing", {
          asd,
          jkl,
          jaksldjalk: e.features,
        });

        console.debug("kambing date", {
          startRecordedAt,
          endRecordedAt,
          startRecordedAtISO: formatISO(startRecordedAt),
          endRecordedAtISO: formatISO(endRecordedAt),
          qs: sp.toString(),
        });

        const props = e.features?.[0]?.properties;
        if (props)
          console.debug("kambing user", props.userID, "name", props.userName);
      }}
      style={{ width: 1600, height: 600 }}
      // mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${env.VITE_MAPTILER_KEY}`}
      mapStyle={`https://tiles.openfreemap.org/styles/bright`}
    >
      <Source
        id="kambing-jantan"
        type="vector"
        tiles={[
          `${env.VITE_API_URL}/gis/user-line-history/{z}/{x}/{y}.pbf?${sp.toString()}`,
        ]}
        maxzoom={18}
      >
        <Layer
          id="kuda-lumping"
          type="line"
          source-layer="user-line-history"
          layout={{ "line-cap": "round", "line-join": "round" }}
          paint={{ "line-color": userColor, "line-width": 5 }}
        />
      </Source>

      <Source
        id="kambing-jantan-point"
        type="vector"
        tiles={[
          `${env.VITE_API_URL}/gis/user-last-location/{z}/{x}/{y}.pbf?${sp.toString()}`,
        ]}
        maxzoom={18}
      >
        <Layer
          id="kuda-lumping-last-loc"
          type="circle"
          source-layer="user-last-location"
          paint={{ "circle-radius": 10, "circle-color": userColor }}
        />
      </Source>
    </MapCom>
  );
}
