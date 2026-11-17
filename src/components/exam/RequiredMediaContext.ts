import {createContext} from 'react';
export const RequiredMediaContext=createContext<((id:string,state:'loading'|'ready'|'error')=>void)|null>(null);
