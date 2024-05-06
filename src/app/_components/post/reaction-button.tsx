import React from "react";
import { Button } from "@/app/_components/ui/button";
import { ReactionWithUser } from "@/types";
import { useSession } from "@/app/_components/session-provider";
import { cn } from "@/lib/utils";
type Props = {
  count: number;
  icon:string;
  items:ReactionWithUser[]
};
const ReactionButton = ({ count,icon,items }: Props) => {
  const { user } = useSession();
  const userReacted = items.find((item)=>item.userId === user.id)
  if (count <= 0) return null;
  return (
    <Button
      className={cn("flex h-6 items-center gap-x-1 text-xs",{
        "bg-accent" : !!userReacted
      })}
      variant="outline"
      size="icon"
    >
      <span>{icon}</span>
      <span>{count}</span>
    </Button>
  );
};

export default ReactionButton;
