import { LoadingSpinner } from "@/shared/ui/loading-spinner";

export default function Loading() {
    return (
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
            <LoadingSpinner className="h-12 w-12" />
        </div>
    );
}
