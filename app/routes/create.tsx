import { ActionFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, redirect, useNavigation } from "@remix-run/react";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { createClient } from "~/libs/supabase";

export const meta: MetaFunction = () => {
  return [{ title: "Create" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createClient(request);
  const form = await request.formData();
  const title = String(form.get("title"));
  const body = String(form.get("body"));
  const image = form.get("image") as File;

  if (image.size > 0) {
    const { data } = await supabase.storage
      .from("notes")
      .upload(`/${image.name}`, image, { upsert: true });

    const url = supabase.storage
      .from("notes")
      .getPublicUrl(data?.path as string);

    await supabase.from("note").insert({
      title,
      body,
      image: url.data.publicUrl,
    });

    return redirect("/");
  }

  await supabase.from("note").insert({
    title,
    body,
  });

  return redirect("/");
}

export default function CreatePage() {
  const { state } = useNavigation();
  const [imagePick, setImagePick] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <main className="w-full">
      <h1 className="font-bold text-2xl">Create </h1>
      <Form
        className="w-full mt-10"
        method="POST"
        encType="multipart/form-data"
      >
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

          {imagePick ? (
            <div className="mt-4 w-full">
              <div className="w-6/12">
                <img
                  src={URL.createObjectURL(imagePick)}
                  alt="imagepick"
                  className="w-full rounded-md"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between">
            <input
              ref={inputRef}
              name="image"
              onChange={(e) => {
                if (!e.target.files) return;
                setImagePick(e.target.files[0]);
              }}
              type="file"
              accept="image/*"
              hidden
            />
            <button
              onClick={() => {
                inputRef.current?.click();
              }}
              type="button"
            >
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
