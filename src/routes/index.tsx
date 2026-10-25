import { Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import MapView from "#/components/MapView";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const placeholder = <div style={{ width: 600, height: 400 }} />;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Map demo</h1>
      <p className="mt-4 text-lg">Click the map to see its coordinates.</p>

      <ClientOnly fallback={placeholder}>
        <Suspense fallback={placeholder}>
          <MapView />
          foo
        </Suspense>
      </ClientOnly>
    </div>
  );
}
