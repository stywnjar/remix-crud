import { Link } from "@remix-run/react";
import { PenBoxIcon } from "lucide-react";
export function EditButton({ post_id }: { post_id: string }) {
  return (
    <Link to={`/note/edit/${post_id}`}>
      <button className="btn btn-sm">
        <PenBoxIcon size={18} />
        Edit
      </button>
    </Link>
  );
}
