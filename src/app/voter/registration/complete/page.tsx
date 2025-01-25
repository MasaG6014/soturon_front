import { Button } from "@/components/ui/button"
import Link from "next/link"

const CompletePage = () => {
    return(
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p>登録が完了しました！！</p>
            <Button asChild variant="destructive">
            <Link href="/voter">トップページに戻る</Link>
            </Button>
        </div>
    )
}

export default CompletePage