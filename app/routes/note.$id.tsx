import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { DeleteButton } from "~/components/delete-button";
import { EditButton } from "~/components/edit-button";
import { createClient } from "~/libs/supabase";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.note?.title }];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  const { supabase } = createClient(request);

  const { data } = await supabase
    .from("note")
    .select("*")
    .eq("id", id as string)
    .single();

  if (!data) return redirect("/");

  return json({ note: data });
}

export default function Note() {
  const { note } = useLoaderData<typeof loader>();
  return (
    <main>
      <div className="mb-5">
        <h4 className="font-bold text-xl">{note?.title}</h4>
        <span className="text-xs text-white/30">
          {DateTime.fromISO(note?.created_at as string).toRelative()}
        </span>
      </div>
      {note.image ? (
        <img src={note.image} className="w-full h-full rounded-md mb-4" />
      ) : null}
      <p className="whitespace-pre-line">{note?.body}</p>
      <div className="border-t border-white/5 mt-5 pt-5 flex items-end justify-end gap-2">
        <EditButton post_id={note?.id as string} />
        <DeleteButton post_id={note?.id as string} />
      </div>
    </main>
  );
}
