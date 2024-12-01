import * as React from "react";
import {useFormContext} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {FormValues} from "@/app/schema.ts";
import {backend} from "@/lib/backend";

const HomePage: React.FC = () => {
    const { control, handleSubmit } = useFormContext<FormValues>();

    const submit = async (data: FormValues) => {
        try {
            const response = await backend.post("/process", data);
            console.log("Response:", response);
        } catch (e) {
            console.log("Error submitting form:", e);
        }
    };

    return (
        <div>
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
            <Button onClick={handleSubmit(submit)}>Submit</Button>
        </div>
    );
};

export default HomePage;