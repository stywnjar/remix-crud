import { ActionFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, redirect, useNavigation } from "@remix-run/react";
import { Camera } from "lucide-react";
import { createClient } from "~/libs/supabase";

export const meta: MetaFunction = () => {
  return [{ title: "Create" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const title = String(form.get("title"));
  const body = String(form.get("body"));
  const { supabase } = createClient(request);

  await supabase.from("note").insert({
    title,
    body,
  });

  return redirect("/");
}

export default function CreatePage() {
  const { state } = useNavigation();

  return (
    <main className="w-full">
      <h1 className="font-bold text-2xl">Create </h1>
      <Form className="w-full mt-10" method="POST">
        <fieldset disabled={state === "submitting"} className="w-full">
          <input
            type="text"
            placeholder="your note title"
            name="title"
            required
            className="w-full py-2 px-4 border-b border-white/10 bg-transparent outline-none"
          />
          <textarea
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
              ) : null}{" "}
              Submit
            </button>
          </div>
        </fieldset>
      </Form>
    </main>
  );
}
