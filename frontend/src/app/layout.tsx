import * as React from "react";
import {type PropsWithChildren} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {type FormValues, schema} from "@/app/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "./sidebar";
import {useAuth, UserButton} from "@clerk/clerk-react";
import {useRouter} from "@tanstack/react-router";

const AppLayout:React.FC<PropsWithChildren>= ({children}) =>{
    const router = useRouter()
    const methods = useForm<FormValues>({
        resolver:zodResolver(schema),
    })

    const {isLoaded, isSignedIn} = useAuth()

    React.useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.navigate({to: "/sign-in"})
        }
    }, [isLoaded, isSignedIn, router])

    return (<SidebarProvider>
            <AppSidebar/>
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
                <SidebarTrigger className="-ml-1" />

                <div>
                    <UserButton signInUrl={"/sign-in"}/>
                </div>
            </header>
            <FormProvider {...methods}>
                <main className={"flex flex-1 flex-col gap-4 p-4"}>
                    {children}
                </main>
            </FormProvider>
        </SidebarInset>

        </SidebarProvider>)

}

export default AppLayout