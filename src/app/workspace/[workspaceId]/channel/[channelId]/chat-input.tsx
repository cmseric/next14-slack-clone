import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      console.log({ body, image });
      setIsPending(true);

      await createMessage({
        workspaceId,
        channelId,
        body,
      }, { throwError: true })

      setEditorKey((preKey) => preKey + 1);
      
    } catch (error) {
      toast.error("Faild to send message");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        // variant="update"
      />
    </div>
  );
};