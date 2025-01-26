"use client";

import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/src/config/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckInfo = () => {
    const router = useRouter();
    const [ballot, setBallot] = useState<string | null>("");
    const [dispBallot, setDispBallot] = useState<string | null>("");
    useEffect(() => {
        const sessionBallot = sessionStorage.getItem("ballot");
        setBallot(sessionBallot);
        if (sessionBallot != null){
            const ballotInfo = JSON.parse(sessionBallot);
            setDispBallot(ballotInfo.candidate);
        }
        // console.log(ballot)
    },[]);
    const handleSubmit = async() => {
        try {
            // console.log(JSON.parse(ballot));
            const response = await fetch(BACKEND_URL+"/voting/submitBallot",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420"
                },
                body: ballot});

            const data = await response.json();
            console.log(data)

            if(data.status == "success") {
                router.push("/voter/voting/complete");
            }
        }catch (error) {
            console.log("ballot sumbittion error", error)
        }
    }
    return(
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px"
        , wordWrap: 'break-word', wordBreak:"break-all", width: '80%', margin:"0 auto"}}>
            <h1>票を控えてください</h1>
            <p>{dispBallot}</p>
            <Button onClick={handleSubmit}>提出</Button>
        </div>
    )
};

export default CheckInfo;
