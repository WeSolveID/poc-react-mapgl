import { Suspense } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import MapView from "#/components/MapView";
import { parseISO, sub } from "date-fns";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const dateTarget = parseISO("2026-10-28T15:21:06Z");

    return {
      dateTarget,
    };
  },
});

function Home() {
  const data = Route.useLoaderData();
  const placeholder = <div style={{ width: 600, height: 400 }} />;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Map demo</h1>
      <p className="mt-4 text-lg">Click the map to see its coordinates.</p>

      <ClientOnly fallback={placeholder}>
        <Suspense fallback={placeholder}>
          <MapView
            startRecordedAt={sub(data.dateTarget, {
              hours: 1,
            })}
            endRecordedAt={data.dateTarget}
          />
          foo
        </Suspense>
      </ClientOnly>
    </div>
  );
}
