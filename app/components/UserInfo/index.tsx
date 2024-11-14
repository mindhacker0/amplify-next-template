import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { FC, useEffect, useState } from "react";

const UserEmail:FC = ()=>{
    const [email,setEmail] = useState<string>("");
    useEffect(()=>{
       fetchUserAttributes().then(res=>{setEmail(res.email||"");});
    },[])
    return (<>{"Signed in as "}{email}</>)
}

const UserInfo:FC<{}> = ()=>{
    const { signOut } = useAuthenticator();
    return (<div>
       <h2><span><UserEmail /></span></h2>
       <button onClick={signOut}>{"Sign out"}</button>
    </div>)
}

export default UserInfo;