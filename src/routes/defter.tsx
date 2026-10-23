import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/components/mycel/library";
import { Shell } from "@/components/mycel/shell";

export const Route = createFileRoute("/defter")({
  component: function DefterPage() {
    return (
      <Shell>
        <Library />
      </Shell>
    );
  },
});
