import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  MetaFunction,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Camera } from "lucide-react";
import { createClient } from "~/libs/supabase";

export const meta: MetaFunction = () => {
  return [{ title: "Edit" }];
};

export async function action({ params, request }: ActionFunctionArgs) {
  const { id } = params;
  const form = await request.formData();
  const title = String(form.get("title"));
  const body = String(form.get("body"));
  const { supabase } = createClient(request);

  await supabase
    .from("note")
    .update({
      title,
      body,
    })
    .eq("id", id as string);

  return redirect(`/note/${id}`);
}

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

export default function CreatePage() {
  const { note } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <main className="w-full">
      <h1 className="font-bold text-2xl">Edit</h1>
      <Form className="w-full mt-10" method="POST">
        <fieldset disabled={state === "submitting"} className="w-full">
          <input
            defaultValue={note?.title}
            type="text"
            placeholder="your note title"
            name="title"
            required
            className="w-full py-2 px-4 border-b border-white/10 bg-transparent outline-none"
          />
          <textarea
            defaultValue={note?.body}
            placeholder="write that down"
            name="body"
            required
            className="w-full h-48 resize-none p-4 border-b border-white/10 bg-transparent outline-none"
          />
          <div className="mt-4 flex items-center justify-between">
            <button type="button" disabled>
              <Camera />
            </button>
            <button className="btn btn-outline flex items-center justify-center gap-1">
              {state === "submitting" ? (
                <span className="loading loading-sm" />
              ) : null}
              Update
            </button>
          </div>
        </fieldset>
      </Form>
    </main>
  );
}
