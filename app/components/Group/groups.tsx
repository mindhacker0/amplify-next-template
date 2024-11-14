import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { eventHub } from "../Common/utils";

const client = generateClient<Schema>();

const GroupList:FC<{
   setCurGroupId:Dispatch<SetStateAction<string>>;
   setCurGroupName:Dispatch<SetStateAction<string>>
}> = ({setCurGroupId,setCurGroupName})=>{
   const [group,setGroup] = useState<Array<{name:string,id:string}>>([]);
   const { user } = useAuthenticator();
   function queryList(){
      client.models.GroupUserRelation.list({filter:{userId:{eq:user.userId}}}).then(res=>{
         return Promise.all(res.data.map(v=>client.models.Group.get({id:v.groupId})));
      }).then(arr=>{
        setGroup(arr.map(v=>({name:v.data!.name,id:v.data!.id})));
        if(arr.length){
         setCurGroupId(arr[0].data!.id);// init group id.
         setCurGroupName(arr[0].data!.name);
        }
      });
   }
   useEffect(()=>{
      queryList();
      eventHub.addEventListener("groupUpdated",queryList);
      return ()=>{
         eventHub.removeEventListener("groupUpdated",queryList);
      }
   },[user]);
   const handleGroupClick = (id:string,name:string)=>{
      setCurGroupId(id);
      setCurGroupName(name);
   }
   return (<ul>{
      group.map((v)=>(<li style={{backgroundColor: "rgb(204, 204, 204)",cursor: "pointer"}} onClick={handleGroupClick.bind(null,v.id,v.name)} key={v.id}><span>{v.name}</span></li>))
   }</ul>)
}

export default GroupList;