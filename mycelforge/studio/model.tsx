import { createFileRoute } from "@tanstack/react-router";
import { ModelPage } from "@/components/mycel/model-page";
import { Shell } from "@/components/mycel/shell";

export const Route = createFileRoute("/model")({
  component: function ModelRoute() {
    return (
      <Shell>
        <ModelPage />
      </Shell>
    );
  },
});
