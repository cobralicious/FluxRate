import {fiatCatalog,fiatRates,fiatHistory,nbp,coinbaseCatalog,coinbaseTicker,coinbaseHistory,gecko,MarketError} from '@/lib/providers';
import {parseMarketQuery} from '@/lib/market-query';
const clients=new Map<string,{time:number;n:number}>();
export async function GET(request:Request){
 try{
  let q:ReturnType<typeof parseMarketQuery>;
  try{q=parseMarketQuery(request.url)}catch{throw new MarketError('invalid',400,0)}
  const ip=request.headers.get('cf-connecting-ip')||'local',now=Date.now();
  let client=clients.get(ip);if(!client||now-client.time>=60000)client={time:now,n:0};
  if(++client.n>120)throw new MarketError('quota',429,Math.ceil((60000-(now-client.time))/1000));
  clients.set(ip,client);
  if(clients.size>5000){for(const [key,value] of clients)if(now-value.time>=60000)clients.delete(key);if(clients.size>5000)clients.delete(clients.keys().next().value!)}
  let data:any;
  switch(q.kind){
   case 'catalog':data=await fiatCatalog(q.legacy);break;
   case 'rates':data=await fiatRates();break;
   case 'history':data=await fiatHistory(q.base,q.quote,q.days,q.source);break;
   case 'nbp':data=await nbp();break;
   case 'crypto-catalog':data=await coinbaseCatalog();break;
   case 'ticker':data=await coinbaseTicker(q.crypto);break;
   case 'crypto-history':data=await coinbaseHistory(q.crypto,q.days);break;
   default:{
    let key=process.env.COINGECKO_DEMO_API_KEY||'';
    try{const {env}=await import('cloudflare:workers');key=(env as any).COINGECKO_DEMO_API_KEY||key}catch{}
    data=await gecko(key,q.kind.slice(6),q.page,q.category,q.coin,q.days,q.ids);
   }
  }
  return Response.json(data,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }catch(e){
  const err=e instanceof MarketError?e:new MarketError('provider');
  return Response.json({error:err.code},{status:err.status,headers:{'Cache-Control':'no-store','Retry-After':String(err.retry),'X-Content-Type-Options':'nosniff'}});
 }
}
