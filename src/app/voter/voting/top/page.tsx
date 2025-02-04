"use client";

import { genSignature, getChallenge, sendResponse } from "@/src/app/components/authentication";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import QRScanner from "@/src/app/components/QRScanner";


const VotingTop = () => {
    const router = useRouter();
    const [state, setState] = useState<string>("QRコードを読み取ってください");

    const saveData = (voterData: unknown):boolean => {
        sessionStorage.setItem("voterData", JSON.stringify({voterData}));
        return true
    };


    const handleDecode = async(data: string) => {
        console.log("QR Code:", typeof(data), "\n",data);
      console.log(data);
      const voter = JSON.parse(data);
      console.log("voter", voter);
  
      // 署名の生成
      const signKey = voter.signKey;
  
      // レスポンス生成
      const challenge = await getChallenge();
      if (!challenge) {
          console.log("Failed to get challenge");
          return;
      }

      const message: string = Buffer.from(challenge.toString()).toString("base64");
      const signature = await genSignature(message, signKey);
      if (!signature) {
          console.log("Failed to generate signature");
          return;
      }
      const voterData = {
          "name":voter.name,
          "Age":voter.Age,
          "Gender":voter.Gender,
          "pk": voter.verifyKey,
          "challenge": message,
          "signature": signature
      };
      const isSuccess = await sendResponse(voterData, '/voting/verifyVoter');
      if (isSuccess) {
          router.push("/voter/voting/candidate");
          console.log("Voter authentication successful!");
      } else {
          setState("認証に失敗しました");
          console.log("voter auth fail");
      }
      saveData(voterData);
    };

    return(
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1>認証を行なってください</h1>
            <p>{state}</p>
            {/* QRScannerコンポーネントを呼び出し */}
            <QRScanner onDecode={handleDecode} />
            {/* スキャンしたデータを表示 */}
            {/* <p>Scanned Data: {scannedData}</p> */}

        </div>
    )
}

export default VotingTop