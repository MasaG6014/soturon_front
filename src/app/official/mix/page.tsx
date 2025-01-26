// バックエンドに、mixの命令をgetで飛ばして、結果を得る
"use client"

import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/src/config/constants";
import { useState } from "react";

const MixBallots = () => {
    const [status, setStatus] = useState<string>("");
    const handleClick = async () => {
        try{
            const response = await fetch(BACKEND_URL + "/mix/mixBallots", {
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "69420",
                        }),
                    });
            if (!response.ok) {
                console.log("mix fetch error");
            };
            const data = await response.json();
            if (data.status == "success") {
                setStatus("ミックスが成功しました")
            }
        }catch (error) {
            console.log("mix error", error);
        }
    };

    return(
        <div  className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1>票のミックス</h1>
            <p>{status}</p>
            <Button onClick={handleClick}>mix</Button>
        </div>
    )
    
}

export default MixBallots