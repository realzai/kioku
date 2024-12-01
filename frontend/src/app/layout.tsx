import type {PropsWithChildren} from "react";
import * as React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {type FormValues, schema} from "@/app/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "./sidebar";

const AppLayout:React.FC<PropsWithChildren>= ({children}) =>{
    const methods = useForm<FormValues>({
        resolver:zodResolver(schema),
    })

    return <FormProvider {...methods}>
        <SidebarProvider>
            <AppSidebar/>
            {children}
        </SidebarProvider>
    </FormProvider>
}

export default AppLayout