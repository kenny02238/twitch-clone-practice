"use client";
import { onBlock, onUnBlock } from "@/actions/block";
import { onFollow, onUnFollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) => {
          toast.success(`You are now following ${data.following.username}!`);
        })
        .catch(() => {
          toast.error("Failed to follow");
        });
    });
  };
  const handleUnFollow = () => {
    startTransition(() => {
      onUnFollow(userId)
        .then((data) => {
          toast.success(`You have unfollowed ${data.following.username}!`);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  const onClick = () => {
    if (isFollowing) {
      handleUnFollow();
    } else {
      handleFollow();
    }
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) => {
          toast.success(`You have blocked ${data && data.blocked.username}`);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };
  const handleUnBlock = () => {
    startTransition(() => {
      onUnBlock(userId)
        .then((data) => {
          toast.success(`You have unblocked ${data.blocked.username}`);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <>
      <Button variant="primary" onClick={onClick} disabled={isPending}>
        {isFollowing ? "UnFollow" : "Follow"}
      </Button>
      <Button onClick={handleBlock} disabled={isPending}>
        Block
      </Button>
    </>
  );
};
