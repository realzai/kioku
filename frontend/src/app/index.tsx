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
import {type FormValues, modelOptions} from "@/app/schema.ts";
import { backend } from "@/lib/backend";
import { useAuth } from "@clerk/clerk-react";
import {Select,SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const HomePage: React.FC = () => {
    const [message,setMessage] = React.useState("");
  const { control, handleSubmit } = useFormContext<FormValues>();
  const { getToken } = useAuth();


  const submit = async (data: FormValues) => {
    const token = await getToken();
    try {
      const response = await backend.post("/process", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
    } catch (e) {
      console.log("Error submitting form:", e);
    }
  };


  const logToken = async () => {
      const token = await getToken();
        console.log("Token:", token);
  }


  return (
    <div className={"space-y-5"}>
        <div>{message}</div>
      <FormField
        control={control}
        name="groq_token"
        render={({ field }) => (
          <FormItem className="col-span-6">
            <FormLabel>Token</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter token" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
            name="model"
            control={control}
            render={({ field }) => (
                <FormItem className="col-span-6">
                    <FormLabel>Model</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select one" />
                            </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                            {modelOptions.map((option) => (
                                <SelectItem
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
        <Button onClick={logToken}>Log Token</Button>
      <Button onClick={handleSubmit(submit)}>Submit</Button>
    </div>
  );
};

export default HomePage;
