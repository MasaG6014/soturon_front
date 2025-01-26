// mixした後、集計作業のリクエストをバックエンドに投げて集計結果を得る
"use client"

import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/src/config/constants";
import { useState } from "react"
import electionData from "@/data/electionData.json" ;

const TallyBallots = () => {
    const [done, setDone] = useState<string>("結果の取得中");
    const[result, setResult] = useState<Candidate[]>([]);
    interface Candidate {
        id: string;
        name: string;
        votes: string;  // 票数を保持するプロパティ
      } 
    const handleClick = async () => {
        try{
            const response = await fetch(BACKEND_URL+"/tally/tallyBallots",{
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            });
            if (!response.ok) {
                throw new Error("era-dayo");
            }
            const data = await response.json();
            console.log("res data", data);
            if (data.status == "yet") {
                setDone("まだミックスが終わっていません")
            }{
            const candidateList = electionData.candidateList;
            const electionResult: Candidate[] = []; // 候補者のリスト
            candidateList.map(item => {
                const cand: Candidate = {id: item.index, name: item.name, votes: "0"};
                electionResult.push(cand)
            });
            const cand: Candidate = {id: "1", name: "無効票", votes: "0"};
            electionResult.push(cand);
            const keys = Object.keys(data.result);
            console.log("result", data.result);
            for (let i=0;i<keys.length;i++){
                for (let ii=0;ii<electionResult.length;ii++){
                    if (electionResult[ii].id == keys[i]) {
                        console.log("erid", electionResult[ii]);
                        console.log("key", data.result[keys[i]]);
                        console.log("type", typeof(data.result[keys[i]]))
                        electionResult[ii].votes = data.result[keys[i]].toString();
                    }
                }
            }
            console.log(electionResult)
            setResult(electionResult);}
            console.log(data);
        } catch (error) {
            console.log("tally error desu", error);
        }
    }

    return(
        <div  className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1>選挙結果</h1>
            <p>{done}</p>
            {result.map(candidate => (
                <p key={candidate.id}>
                    {candidate.name}: {candidate.votes}
                </p>
            ))}
            <Button onClick={handleClick}>tally</Button>
        </div>
    )
}

export default TallyBallots