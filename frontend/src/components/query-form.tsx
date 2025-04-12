import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Eye, EyeOff } from "lucide-react";
import { modelOptions, type QueryPayload } from "@/schemas/querySchema.ts";

interface QueryFormProps {
  onSubmit: (data: QueryPayload) => void;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit } = useFormContext<QueryPayload>();
  const [showToken, setShowToken] = React.useState(false);

  return (
    <div className={"space-y-5 w-full flex-1"}>
      <FormField
        control={control}
        name="query"
        render={({ field }) => (
          <FormItem className="col-span-6">
            <FormLabel>Query</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter token" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="groq_token"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Token</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your API token"
                  type={showToken ? "text" : "password"}
                  className="pr-10"
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="model"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
    </div>
  );
};
