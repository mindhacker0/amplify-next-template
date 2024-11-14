import { ChangeEvent, CSSProperties, FC, MouseEvent, useEffect, useState } from "react";

export type InputValueType = string | number;

const Input:FC<{
    placeholder?: string;
    type?: string;
    style?: CSSProperties;
    value?: InputValueType;
    onChange?: (value:InputValueType)=>void;
}> = (props)=>{
    const [state, setState] = useState<InputValueType>("");
    useEffect(() => {
        setState(props?.value||"");
      }, [props?.value]);
    return (<input   
    placeholder={props?.placeholder}
    type={props?.type}
    value={state}
    style={props?.style}
    onChange={(e:ChangeEvent<HTMLInputElement>)=>{
        setState(e.target.value);
        if(typeof props?.onChange === "function") props.onChange(e.target.value);
    }}
    />)
}


export default Input;