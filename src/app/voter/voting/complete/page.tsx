import { Button } from "@/components/ui/button"
import Link from "next/link"

const VotingCompletion = () => {
    return (
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1>投票が完了しました </h1>
            <Button asChild variant="destructive">
            <Link href="/voter">トップページに戻る</Link>
            </Button>
        </div>
    )
}

export default VotingCompletion