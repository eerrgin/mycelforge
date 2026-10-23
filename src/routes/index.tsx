import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/mycel/shell";
import { Studio } from "@/components/mycel/studio";

export const Route = createFileRoute("/")({
  component: function Home() {
    return (
      <Shell>
        <Studio />
      </Shell>
    );
  },
});
