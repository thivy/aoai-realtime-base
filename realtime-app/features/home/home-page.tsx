import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const HomePage = () => {
  return (
    <div className="container max-w-2xl mx-auto flex-1 flex items-center ">
      <div className="grid grid-cols-3 gap-3 items-stretch  flex-1">
        <Link href="/chat" className=" self-stretch">
          <Card className="hover:scale-105 transition-all">
            <CardHeader>Chat</CardHeader>
            <CardContent>
              <p>Welcome to Chat</p>
            </CardContent>
            <CardFooter className="justify-end">
              <ChevronRight />
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
};
