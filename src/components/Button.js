import React from "react";


export const Button = ({text, onPress, icon=null, style=null}) => {
  return (
    <div>
      <button className="create-group-container" style={style} onClick={onPress}>
        {icon}
        {text}
      </button>
    </div>
  )
};
