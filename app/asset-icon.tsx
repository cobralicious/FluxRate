'use client';
import {useState} from 'react';
import {Globe2} from 'lucide-react';
import {currencyFlag,cryptoIcon} from '@/lib/asset-icons';

export function Coin({code,id,kind='fiat',small=false}:{code:string;id?:string;kind?:string;small?:boolean}){
 const crypto=kind==='crypto'||!!id?.includes(':');
 const flag=crypto?null:currencyFlag(code);
 const src=crypto?cryptoIcon(code,id):flag?'/assets/flags/'+flag+'.svg':null;
 const [failed,setFailed]=useState<string|null>(null);
 const showImage=src&&failed!==src;
 return <span aria-hidden="true" dir="ltr" className={'coin asset-icon '+(crypto?'crypto-emblem':'fiat-emblem')+(small?' small':'')}>
   {showImage?<img src={src} alt="" width={40} height={32} loading="lazy" onError={()=>setFailed(src)}/>:crypto?<span className="crypto-monogram">{code.slice(0,3)}</span>:<Globe2 className="currency-region" size={24}/>}
   {!crypto&&<span className="currency-code">{code}</span>}
 </span>;
}
