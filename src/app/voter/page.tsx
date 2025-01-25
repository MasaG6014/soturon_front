import Link from "next/link";
import { Button } from "@/components/ui/button";

const VoterTop = () => {
    return(
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1>トップページ</h1>
            <Button asChild variant="pink">
            <Link href="/voter/registration/top">対面登録する</Link>
            </Button>

            <Button asChild variant="pink">
            <Link href="/voter/registration/online">オンライン登録する</Link>
            </Button>

            <Button asChild variant="blue">
            <Link href="/voter/voting/top">投票する</Link>
            </Button>
            
        </div>
    )
}

export default VoterTop