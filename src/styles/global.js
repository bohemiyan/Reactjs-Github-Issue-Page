import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
*{
margin: 0;
padding:0;
outline:0;
box-sizing: border-box;
}

html, body, #root{
  min-height:100%
}

body{
  background: #0d2636;
  font-size:14px;
  -webkit-font-smothig: antialiased !important;
}

body, input, button{
  color:#222;
  font-size:14px;
  font-family: Arial, Arial, Helvetica, sans-serif
}

button{
  cursor:pointer;
}
`;
