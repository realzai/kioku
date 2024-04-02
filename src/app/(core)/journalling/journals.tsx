"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useJournal } from "@/hooks/use-journal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchJournal } from "./_components/search-journal";

export const Journals = ({ items }: { items: any }) => {
  const { journals, setJournals, selectedJournal } = useJournal();

  return (
    <div>
      <SearchJournal />
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 p-4">
          {journals.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedJournal === item.id && "bg-muted",
              )}
              // onClick={() =>
              //   setJournals({
              //     ...journals,
              //     selected: item.id,
              //   })
              // }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      selectedJournal === item.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Hi
                    {/* {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })} */}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.subject}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.text.substring(0, 300)}
              </div>
              {item.labels.length ? (
                <div className="flex items-center gap-2">
                  {item.labels.map((label) => (
                    <Badge key={label} variant={"secondary"}>
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
