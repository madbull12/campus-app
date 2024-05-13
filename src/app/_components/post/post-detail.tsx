"use client";
import React from "react";
import PostActions from "./post-actions";
import ReactionsList from "./reactions-list";
import { api } from "@/trpc/react";
import { Comment, Profile, Reaction } from "@prisma/client";
import AvatarProfile from "../avatar-profile";
import Loading from "../loading";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/app/_components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema, CommentSchemaType } from "@/lib/schemas/comment";
import { Button } from "@/app/_components/ui/button";
import CommentComponent from "./comment";
import { CommentWithUser } from "@/types";

const PostDetailComponent = ({ id }: { id: string }) => {
  const { data: post, isLoading } = api.post.singlePost.useQuery({
    postId: id,
  });
  const utils = api.useUtils()

  const { mutateAsync: createComment,isLoading:isCreating } =
    api.comment.createComment.useMutation({
      onSettled() {
        // Sync with server once mutation has settled
        form.reset();
        utils.post.singlePost.invalidate({
          postId:id
        })
      },
    });
  const form = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: CommentSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { comment } = values;
    await createComment({
      comment,
      postId:id
    });
  }
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4  p-4  ">
          <div className="flex items-center gap-x-4">
            <AvatarProfile profile={post?.user.profile as Profile} />
            <p>{post?.user.profile?.fullName}</p>
          </div>
          <p className="text-lg font-bold ">{post?.title}</p>
          <div dangerouslySetInnerHTML={{ __html: post?.content as string }} />
          <PostActions postId={id} noComments={true} />
          <ReactionsList
            postId={id}
            reactions={post?.reactions as Reaction[]}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Write a comment" {...field} />
                    </FormControl>

                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  className=""
                  type="submit"
                  disabled={form.watch("comment").length <= 0 || isCreating}
                >
                  Comment
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-lg font-semibold">
            {post?.comments?.length} Comments
          </p>
          {post?.comments?.map((item)=><CommentComponent key={item.id} comment={item as CommentWithUser} />)}
        </div>
      )}
    </>
  );
};

export default PostDetailComponent;
