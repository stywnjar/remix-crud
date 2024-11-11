import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { createClient } from "~/libs/supabase";

export const meta: MetaFunction = () => {
  return [{ title: "Notes" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);
  const { data } = await supabase
    .from("note")
    .select("*")
    .order("created_at", { ascending: false });

  return json({ notes: data });
}

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Notes</h1>
        <Link to={"/create"} className="btn btn-outline">
          <PlusIcon /> New
        </Link>
      </div>
      <section className="grid grid-cols-2 gap-5 mt-5">
        {notes?.map((note) => (
          <Link
            key={note.id}
            to={`/note/${note.id}`}
            className="w-full h-full "
          >
            <div className="h-[200px] relative rounded-md border border-white/20 whitespace-pre-line ">
              {note.image ? (
                <img
                  src={note.image}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : null}
              <div className="w-full h-full absolute inset-0 z-10 flex flex-col items-end justify-between p-5 backdrop-blur bg-black/5">
                <div className="w-full">
                  <h4 className="font-bold mb-2">{note.title}</h4>
                  <p className="text-white/50 line-clamp-3 ">{note.body}</p>
                </div>
                <span className="text-sm text-white/30">
                  {DateTime.fromISO(note.created_at).toRelative()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
