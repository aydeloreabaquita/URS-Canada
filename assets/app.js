const STORAGE_KEY="urs_demo_requests_v3";

function storageAvailable(){
  try{
    const t="__urs_test__";
    localStorage.setItem(t,"1");
    localStorage.removeItem(t);
    return true;
  }catch(e){ return false; }
}
const HAS_STORAGE=storageAvailable();
let memoryRequests=[];

function readRequests(){
  if(HAS_STORAGE){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]}
    catch(e){}
  }
  return memoryRequests;
}
function writeRequests(items){
  if(HAS_STORAGE){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items));return}
    catch(e){}
  }
  memoryRequests=items;
}
function makeId(){return "URS-"+Math.random().toString(36).slice(2,7).toUpperCase()}

document.querySelectorAll(".service-select").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.getElementById("serviceSelect").value=btn.dataset.service||"";
    document.getElementById("contact").scrollIntoView({behavior:"smooth"});
  });
});

document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget);
  const row={
    id:makeId(),
    name:fd.get("name"),
    phone:fd.get("phone"),
    email:fd.get("email"),
    contactMethod:fd.get("contactMethod"),
    service:fd.get("service"),
    urgency:fd.get("urgency"),
    address:fd.get("address"),
    message:fd.get("message"),
    status:"New",
    internalNotes:"",
    createdAt:new Date().toISOString()
  };
  const items=readRequests();
  items.unshift(row);
  writeRequests(items);
  e.currentTarget.reset();
  const success=document.getElementById("formSuccess");
  success.hidden=false;
  success.scrollIntoView({behavior:"smooth",block:"nearest"});
});
