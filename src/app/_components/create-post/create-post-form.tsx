"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema } from "@/lib/schemas/post";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { PlateEditor } from "./editor";

const CreatePostForm = () => {
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      desc: "",
    },
  });

  const { watch } = form;
  console.log(JSON.stringify(watch("desc")))

  function onSubmit(values: z.infer<typeof PostSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Hello..." {...field} />
              </FormControl>
              <FormDescription>
                This is going to be the title of your post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                {/* <Input placeholder="Hello..." {...field} /> */}
                <PlateEditor onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                This is going to be the description of your post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end text-white">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
