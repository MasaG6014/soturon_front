"use client";

import React, { useState} from "react";
import { BACKEND_URL } from "@/src/config/constants";
import electionData from "@/data/electionData.json";
import { useRouter } from "next/navigation";
import QRScanner from "@/src/app/components/QRScanner";

const CheckAuthority = () => {
    const router = useRouter();
    const [status, setStatus] = useState<string>("認証が成功しました！\nこの画面を職員にお見せください。");
    // const [signKey, setSignKeys] = useState<unknown>();
    let voterData;
    console.log("voterData", voterData)
    let challenge = 0;
    // いったんjsonからデータを読み出す

    // チャレンジを受け取る
    const getChallenge = async () => {
        try{
            const response = await fetch(BACKEND_URL+"/registration/challenge", {
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            });
            if (!response.ok) {
                console.log("errordayon")
            }
            const data = await response.json();
            challenge = data.challenge;
            console.log("challenge", challenge);
        }catch (error) {
            console.log('challenge error', error);
        }
    };
    const dataToSign = {
        "voterData": voterData,
        "challenge": challenge
    }
    // 署名の生成
    let signature: string = "";
    const message: string = Buffer.from(JSON.stringify(dataToSign)).toString("base64");
    const genSignature = async (signKey: string) => {
        const response = await fetch('/api/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,
                "ngrok-skip-browser-warning": "69420"},
            body: JSON.stringify({ "message": message, "signKey": signKey }),
        });
        // console.log("sigresponse:\n",response);
        const data = await response.json();
        signature = data.signature;
    };
    // レスポンス生成
    const sendResponse = async () => {
        const requestData = {
            "message": message,
            "signature": signature
        };
        console.log("requestData\n",requestData);
        try{
            const response = await fetch(BACKEND_URL+"/registration/verifyOfficial",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420"
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                throw new Error("Failed to submit data");
            }

            const data = await response.json();

            if(data.status == "success") {
                setStatus("success!!");
                router.push("/voter/registration/pin");
                console.log("success!!");
            }
        }catch (error) {
            console.log("response error", error);
        }
    };
    const handleProcess = async (data: string) => {
        voterData = sessionStorage.getItem("voterData");
        const json_data =JSON.parse(data);
        const signKey = json_data.signKey;
        console.log(data);
        await getChallenge();
        await genSignature(signKey);
        await sendResponse();
        sessionStorage.setItem("officialKeys", JSON.stringify(electionData.officialKey));
    };

    const handleDecode = async(data: string) => {
        console.log("QR Code:", typeof(data), "\n",data);
        handleProcess(data);
    };


    // useEffect(() => {
    //     voterData = sessionStorage.getItem("voterData");
    //     handleProcess()}, []);
    
    return (
        <div className="h-screen flex justify-center items-center"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1>Read Officials QR ode</h1>
            {/* QRScannerコンポーネントを呼び出し */}
            <QRScanner onDecode={handleDecode} />
            {/* スキャンしたデータを表示 */}
            {/* <p>Scanned Data: {scannedData}</p> */}
            <p>{status}</p>
        </div>
    )
};

export default CheckAuthority;