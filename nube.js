(()=>{const C=window.KE_CFG||{},D="@kioscoerick.app",$=i=>document.getElementById(i),LS=localStorage,esc=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
let S=null,h={},ver=0,tm=null,busy=false,stMsg="";try{S=JSON.parse(LS.getItem("ke_session")||"null")}catch{}
const hoy=()=>{let x=new Date();return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const hdr=t=>({apikey:C.key,"Content-Type":"application/json",...(t?{Authorization:"Bearer "+t}:{})});
const f=(u,o)=>{let c=new AbortController(),t=setTimeout(()=>c.abort(),8000);return fetch(u,{...o,signal:c.signal}).finally(()=>clearTimeout(t))};
async function j(r){let d=null;try{d=await r.json()}catch{}if(!r.ok)throw Object.assign(new Error(d?.msg||d?.error_description||d?.message||"Error "+r.status),{status:r.status});return d}
const keep=()=>S?LS.setItem("ke_session",JSON.stringify(S)):LS.removeItem("ke_session");
function setTok(d,u){S={access:d.access_token,refresh:d.refresh_token,exp:Date.now()+(d.expires_in-60)*1000,uid:d.user.id,usuario:u||S.usuario};keep()}
async function login(u,p){u=u.trim().toLowerCase();setTok(await j(await f(C.url+"/auth/v1/token?grant_type=password",{method:"POST",headers:hdr(),body:JSON.stringify({email:u.includes("@")?u:u+D,password:p})})),u)}
async function tok(){if(!S)throw Object.assign(new Error("Sin sesión"),{status:401});if(Date.now()<S.exp)return S.access;setTok(await j(await f(C.url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:hdr(),body:JSON.stringify({refresh_token:S.refresh})})));return S.access}
async function api(p,o={}){let t=await tok();return j(await f(C.url+"/rest/v1/"+p,{...o,headers:{...hdr(t),...(o.headers||{})}}))}
const ok=p=>{if(!p||!p.activo)return false;if(p.es_admin||p.permanente)return true;if(!p.vence||p.vence<hoy())return false;if(p.vence>hoy())return true;return !p.vence_hora||new Date().toTimeString().slice(0,8)<String(p.vence_hora).slice(0,8)};
const cached=()=>{try{return JSON.parse(LS.getItem("ke_perfil")||"null")}catch{return null}};
const ui=m=>{$("login").hidden=m!=="login";$("bloqueo").hidden=m!=="bloq"};
function bloquear(t,m){$("bqT").textContent=t;$("bqM").textContent=m;$("bqSalir").hidden=false;ui("bloq")}
const st=m=>{stMsg=m;if($("syncSt"))$("syncSt").textContent=m};
async function arrancar(){
 if(!C.key||C.key.startsWith("PEGAR"))return bloquear("Falta configurar","Falta la clave de Supabase en config.js");
 if(!S){ui("login");return}
 let p=null;
 try{let r=await api("perfiles?select=usuario,nombre,vence,vence_hora,permanente,activo,es_admin&id=eq."+S.uid);if(!r.length)return bloquear("Cuenta no habilitada","Contactá a Kiosco Erick para activar tu usuario.");p=r[0];LS.setItem("ke_perfil",JSON.stringify(p))}
 catch(e){if([400,401,403].includes(e.status)){S=null;keep();ui("login");return}p=cached()}
 if(!p)return bloquear("No se pudo verificar tu cuenta","Conectate a internet para verificarla.");
 if(!ok(p))return bloquear(p.activo?"Tu plan venció":"Cuenta suspendida","Contactá a Kiosco Erick para renovar. Tus datos siguen guardados.");
 ui("app");cuenta(p);sync()}
function cuenta(p){let perm=p.permanente||p.es_admin,dias=perm?null:Math.ceil((new Date(p.vence+"T00:00:00")-new Date(hoy()+"T00:00:00"))/864e5);
 $("cuentaBox").innerHTML=`<div class="item"><div class="info"><b>👤 ${esc(p.usuario)}</b><small>${perm?"Plan permanente":"Vence el "+p.vence.split("-").reverse().join("/")+(p.vence_hora?" a las "+String(p.vence_hora).slice(0,5):"")+" ("+dias+" días)"}</small><small id="syncSt">${esc(stMsg)}</small></div></div><button id="btnSync" class="wide">🔄 Sincronizar ahora</button><button id="btnSalir" class="wide">Cerrar sesión</button>`;
 $("btnSync").onclick=()=>sync(true);$("btnSalir").onclick=salir;if(!perm&&dias<=5&&h.toast)h.toast("Tu plan vence en "+dias+" días")}
const sinc=()=>S&&LS.getItem("ke_sync_uid")===S.uid?Number(LS.getItem("ke_sync_at")||0):0;
function marca(t){LS.setItem("ke_sync_uid",S.uid);LS.setItem("ke_sync_at",String(t));LS.setItem("ke_dirty","0")}
async function subir(){let v=ver,t=Date.now();await api("datos?on_conflict=user_id",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({user_id:S.uid,contenido:h.get(),actualizado:new Date(t).toISOString()})});LS.setItem("ke_sync_uid",S.uid);LS.setItem("ke_sync_at",String(t));if(v===ver)LS.setItem("ke_dirty","0")}
async function sync(manual){if(busy||!S||!navigator.onLine||!h.get)return;busy=true;
 try{let r=(await api("datos?select=contenido,actualizado&user_id=eq."+S.uid))[0],dirty=LS.getItem("ke_dirty")==="1",m=sinc(),d=h.get(),hay=d.products.length||d.sales.length;
  if(!r)await subir();
  else{let rt=Date.parse(r.actualizado),nube=null;
   if(!m)nube=hay?confirm("Hay datos en la nube y también en este celular.\n\nAceptar: usar los de la NUBE (se reemplazan los de este celular).\nCancelar: usar los de ESTE CELULAR (se reemplaza la nube)."):true;
   else if(rt>m)nube=dirty?confirm("Los datos cambiaron en otro dispositivo y también en este celular.\n\nAceptar: usar los de la NUBE.\nCancelar: usar los de ESTE CELULAR."):true;
   if(nube===true){h.aplicar(r.contenido||{});marca(rt)}else if(nube===false||dirty)await subir()}
  st("✓ Sincronizado "+new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}))}
 catch(e){st("Sin sincronizar"+(manual?": "+e.message:""))}
 busy=false}
function programar(){ver++;LS.setItem("ke_dirty","1");clearTimeout(tm);if(S)tm=setTimeout(sync,3000)}
async function salir(){if(navigator.onLine&&LS.getItem("ke_dirty")==="1"&&S)try{await subir()}catch{}
 let sin=LS.getItem("ke_dirty")==="1";if(!confirm(sin?"⚠ Hay cambios que NO se subieron a la nube y se perderían. ¿Cerrar sesión igual?":"Al cerrar sesión se borran los datos de este celular (quedan guardados en la nube). ¿Continuar?"))return;
 ["ke_products","ke_sales","ke_cash","ke_cfg","ke_fiado","ke_dirty","ke_sync_at","ke_sync_uid","ke_perfil","ke_undo","ke_session"].forEach(k=>LS.removeItem(k));location.reload()}
window.Nube={programar,login,arrancar,sync,
 iniciar(x){h=x;$("bqSalir").onclick=salir;$("lgPass").onkeydown=e=>{if(e.key==="Enter")$("lgBtn").click()};
  $("lgBtn").onclick=async()=>{let u=$("lgUser").value,p=$("lgPass").value,m=$("lgMsg");if(!u||!p)return m.textContent="Escribí usuario y contraseña";m.textContent="Entrando…";try{await login(u,p);$("lgPass").value="";m.textContent="";arrancar()}catch(e){m.textContent=e.status?"Usuario o contraseña incorrectos":"Sin conexión. Probá de nuevo con internet."}};
  addEventListener("online",()=>sync());
  let verificando=false;
  const cargarCuenta=async()=>{
   if(verificando)return;verificando=true;
   const titulo=$("bqT"),mensaje=$("bqM");
   titulo.textContent="Verificando cuenta…";mensaje.textContent="Esperá un momento mientras comprobamos tu acceso.";
   let retry=$("bqRetry");if(!retry){retry=document.createElement("button");retry.id="bqRetry";retry.className="wide";retry.textContent="Reintentar";retry.onclick=()=>{verificando=false;cargarCuenta()};$("bloqueo").querySelector(".gbox").appendChild(retry)}retry.hidden=true;
   let timer;
   try{
    await Promise.race([arrancar(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("timeout")),12000)})]);
   }catch(e){
    if(!$("bloqueo").hidden){
     titulo.textContent="No pudimos verificar la cuenta";
     mensaje.textContent=!navigator.onLine?"No hay conexión a internet. Conectate y reintentá.":(e.message==="timeout"?"El servidor tardó demasiado en responder. Revisá tu conexión y reintentá.":"No pudimos consultar tu cuenta. Revisá la conexión y reintentá.");
     retry.hidden=false;
    }
   }finally{clearTimeout(timer);verificando=false}
  };
  addEventListener("online",()=>{if(!$("bloqueo").hidden)cargarCuenta();else sync()});cargarCuenta()}};
})();
