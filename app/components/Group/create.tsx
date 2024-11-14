import { FC, useState } from "react";
import Input from "../Common/Input";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { eventHub } from "../Common/utils";

const client = generateClient<Schema>();

const CreateGroup:FC = ()=>{
    const [groupName,setGroupName] = useState<string>("");
    const { user } = useAuthenticator();
    const handleJoin = async()=>{//create group
        let groupId:string;
        const group = await client.models.Group.list({filter:{name:{eq:groupName}}});//group exist?
        console.log(client,groupName,group)
        if(group.data.length === 0){
           const createGroup = await client.models.Group.create({
                name: groupName
            });
            console.log(createGroup)
            groupId = createGroup.data!.id;
        }else{
            groupId = group.data[0].id;
        }
        console.log(groupId)
        // user has aready join?
        const relation = await client.models.GroupUserRelation.get({groupId:groupId!,userId:user.userId});
        if(relation.data === null){// create relations
            await client.models.GroupUserRelation.create({groupId:groupId!,userId:user.userId});
        }
        eventHub.emit("groupUpdated");
        console.log("relation",relation);
    }
    return (<div>
        <h2><span>{"Join group"}</span></h2>
        <div>
            <Input
                placeholder="Enter group name"
                type="text"
                value={groupName}
                onChange={v=>setGroupName(v as string)}
                style={{marginBottom: "10px", padding: "5px", width: "100%"}}
            />
        </div>
        <button onClick={handleJoin}>{"Join group"}</button>
    </div>)
}

export default CreateGroup;