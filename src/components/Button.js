import React from "react";
import {BaseButton} from "./BaseStyledComponents";

export const Button = ({text, onPress, icon=null, style=null}) => {
  return (
    <div>
      <BaseButton onClick={onPress}>
        {icon}
        {text}
      </BaseButton>
    </div>
  )
};
