import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cx } from "class-variance-authority";
import { CircleArrowUp } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  value: string | undefined;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  submitForm: () => void;
  className?: string;
}

export const ChatInput = (props: ChatInputProps) => {
  const { isLoading, submitForm, className } = props;
  const [value, setValue] = useState<string | undefined>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        handleSubmit();
      }
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.handleInput(event);
    setValue(event.target.value);
    adjustHeight();
  };

  const handleSubmit = () => {
    if (!isLoading) {
      submitForm();
      setValue("");
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  return (
    <form className="absolute bottom-0 w-full left-0 p-2">
      <div className="container max-w-2xl mx-auto relative w-full">
        <div className="rounded-md border border-input bg-background p-2 flex gap-2 flex-col">
          <Textarea
            ref={textareaRef}
            placeholder="Send a message..."
            value={value}
            onChange={handleInput}
            className={cx(
              "min-h-[24px] max-h-[calc(30dvh)] resize-none border-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              className
            )}
            autoFocus
            onKeyDown={onKeyDown}
          />
          <div className="flex">
            <div className="flex-1">{/* Left action buttons */}</div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="secondary"
                size="icon"
                className=""
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <CircleArrowUp />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
