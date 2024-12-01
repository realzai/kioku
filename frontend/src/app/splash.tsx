import { useRouter } from "@tanstack/react-router";
import * as React from "react";

const SplashPage:React.FC = () => {
    const router = useRouter()
    const [loadingProgress, setLoadingProgress] = React.useState(0)


    React.useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                const newProgress = prev + Math.random() * 15
                return newProgress >= 100 ? 100 : newProgress
            })
        }, 500)

        const timeout = setTimeout(() => {
            router.navigate({
                to:"/home"
            })
        }, 4000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
            <div className="max-w-md space-y-12">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-extralight tracking-tight text-neutral-900">Wait pls</h1>
                    <p className="text-sm font-light text-neutral-500">Zai is too broke to use paid services</p>
                </div>
                
                <div className="space-y-2 w-full">
                    <div className="h-[1px] w-full bg-neutral-100 overflow-hidden">
                        <div
                            className="h-full bg-neutral-900 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                        <span>Loading</span>
                        <span>{Math.round(loadingProgress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashPage