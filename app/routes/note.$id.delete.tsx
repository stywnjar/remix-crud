import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createClient } from "~/libs/supabase";

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  const { supabase } = createClient(request);

  await supabase
    .from("note")
    .delete()
    .eq("id", id as string);
  return redirect("/");
}
