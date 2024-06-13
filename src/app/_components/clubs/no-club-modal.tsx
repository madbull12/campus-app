import React from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/app/_components/ui/credenza";
import { Button } from "@/app/_components/ui/button";
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
import { Input } from "@/app/_components/ui/input";
import { useParams } from "next/navigation";
import { useSession } from "../session-provider";
import moment from "moment";

export const NotificationSchema = z.object({
  reason: z.string(),
});

export type NotificationSchemaType = z.infer<typeof NotificationSchema>;

const NoActivityModal = ({ timeActivity }: { timeActivity: string }) => {
  const { id } = useParams();
  const user = useSession();

  const form = useForm<NotificationSchemaType>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      reason: "",
    },
  });
  const handleNotifyMentor = async () => {
    const response = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: id,
        reason: form.getValues("reason"),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  };
  const handleNotifyMembers = async () => {
    const response = await fetch("/api/members-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: id,
        reason: form.getValues("reason"),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  };

  function parseTime(time: string) {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes as string);
  }

  function isLater(time1: string, time2: string) {
    const minutes1 = parseTime(time1);
    const minutes2 = parseTime(time2);
    return minutes2 < minutes1;
  }
  return (
    <Credenza>
      <CredenzaTrigger asChild className="mt-4">
        <Button
          disabled={isLater(moment().format("HH:mm").slice(0, 5), timeActivity)}
        >
          I can't come
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Send absence notification</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormDescription>Your reason</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={
                  isLater(
                    moment().format("HH:mm").slice(0, 5),
                    timeActivity,
                  ) as boolean
                }
                className="mt-4"
                onClick={
                  user.isMentor ? handleNotifyMembers : handleNotifyMentor
                }
              >
                {user.isMentor ? "Notify members" : "Notify mentor"}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default NoActivityModal;