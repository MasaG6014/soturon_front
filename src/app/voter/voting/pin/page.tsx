"use client"

import electionData from "@/data/electionData.json";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ElgamalCipherText, ElgamalKeys, ElgamalPlainText, Parameters } from "@/src/app/tools/myPrimitives/elgamal";
import bigInt from "big-integer";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/src/config/constants";



const formSchema = z.object({
    PIN: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const PINpage = () => {
  const router = useRouter();
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      PIN: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try{
        // 公開鍵とPINの正しい組み合わせがデータベースに存在するかといあわせ
        // PINの暗号化
        const voterData = sessionStorage.getItem("voterData");
        console.log("votin pin vD", voterData);
        let pk;
        if (typeof(voterData) == "string") {
          pk = JSON.parse(voterData).voterData.pk;
        }
        console.log("voting pin pk", pk);
        const reqData =JSON.stringify({
          "pk": pk,
          "pin": values.PIN
        })
        console.log("votin pin reqdata",reqData);
        const pinExistanceResponse = await fetch(BACKEND_URL+"/voting/PINexistance",{
              method:"POST",
              headers: {
                  "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420"
              },
              body: reqData,
        }
        );
        if (!pinExistanceResponse.ok) {
          console.log("votin pin exs err")
        }
        const pinExistance = await pinExistanceResponse.json();
        const params = new Parameters();
        params.setParams(electionData.election_vars.parameters);
        const keys = new ElgamalKeys();
        keys.setKeys(electionData.election_vars.authKeys);
        const tallyKeys = new ElgamalKeys();
        tallyKeys.setKeys(electionData.election_vars.tallyKeys);

        const pin = new ElgamalPlainText(bigInt(values.PIN));
        const encPIN = new ElgamalCipherText();
        encPIN.encryption(params,keys,pin);
        // const ciphers = {
        //     c1: encPIN.ctxt[0].toString(), 
        //     c2: encPIN.ctxt[1].toString()
        // };
        const storageData = sessionStorage.getItem("encCandidate");
        let encCandidate;
        if (typeof(storageData) == "string"){
          encCandidate = JSON.parse(storageData).encCandidate;
        }

        console.log("pin exes", pinExistance)
        
        if(pinExistance.status == "no") {
          const zero = new ElgamalCipherText();
          encCandidate = zero.encryption(params, tallyKeys, new ElgamalPlainText(bigInt(1)));
        }
        console.log("enccandidate", encCandidate);
        let  ballot;
        if (typeof(voterData) == "string"){
        ballot = {
            pk: pk,
            pin: encPIN.ctxt,
            candidate: encCandidate.ctxt
        };}
        console.log("voting pin ballot ",ballot);
        // sessionStorage.setItem("encPIN", JSON.stringify(ciphers));
        sessionStorage.setItem("ballot", JSON.stringify(ballot));
        router.push("/voter/voting/checkinfo");
    }catch(error){
        console.log("pin code error", error)
    }
    console.log(values)
  }

  return (

    <div className="h-screen flex justify-center items-center"
    style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="PIN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PINコードを入力してください</FormLabel>
                <FormControl>
                  <Input placeholder="PINコードを入力" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">次へ</Button>
        </form>
      </Form>
    </div>
  )
}


export default PINpage