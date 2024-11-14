"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
//todo:add data provider or other hocs.
const Template = function(context: Readonly<{
  children: React.ReactNode;
}>) {
  const {children} = context;
  return  (<Authenticator>
    {children}
  </Authenticator>)
}
export default Template;