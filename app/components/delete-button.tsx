import { Trash } from "lucide-react";
import { useFetcher } from "@remix-run/react";

export function DeleteButton({ post_id }: { post_id: string }) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "submitting";
  return (
    <fetcher.Form method="DELETE" action={`/note/${post_id}/delete`}>
      <button disabled={isLoading} type="submit" className="btn btn-sm">
        {isLoading ? <span className="loading loading-sm" /> : null}
        <Trash size={18} />
        Delete
      </button>
    </fetcher.Form>
  );
}
