"use client"

import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/src/config/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

const BulletinBoard = () => {
    const [allBallots, setAllBallots] = useState<string[]>(["なし"]);
    const [revBallots, setRevBallots] = useState<string[]>(["なし"]);

    const getBulletinBoard = async() => {
        try{
            const response = await fetch(BACKEND_URL+"/BB/getBB", {
                headers: new Headers({
                      "ngrok-skip-browser-warning": "69420",
                }),
              });
            if (!response.ok) {
                console.log("BB fetch error");
            }
            const data = await response.json();
            console.log("BB rsponse", data);
            if (data.status == "success") {
                const all:string[] = data.allBallots;
                const rev:string[] = data.revBallots;
                console.log("BB all", all);
                console.log("BB rev", rev)
                setAllBallots(all);
                setRevBallots(rev);
            }else {
                console.log("BB response error");
            }
        } catch (error) {
            console.log("BB error", error);
        }
    };
    useEffect(() => {getBulletinBoard();},[]);
    return (
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px"
            , wordWrap: 'break-word', wordBreak:"break-all", width: '80%', margin:"0 auto"
        }}>

            <Button asChild variant="destructive">
            <Link href="/voter">トップページに戻る</Link>
            </Button>
            <h1>すべての票</h1>
            <ul>
                {Array.isArray(allBallots) && allBallots.map((item, index) => (
                    <li key={index}> {index}: {item}<br /></li>
                ))}
            </ul>
            {/* <p>{allBallots}</p> */}
            <h1>失効した票</h1>
            <ul>
                {Array.isArray(revBallots) && revBallots.map((item, index) => (
                    <li key={index}>{item}<br /></li>
                ))}
            </ul>
            {/* <p>{revBallots}</p> */}
        </div>
    )
};

export default BulletinBoard;