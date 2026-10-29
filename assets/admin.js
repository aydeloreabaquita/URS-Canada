const KEY="blue_ember_demo_requests_v1";
const EMP_KEY="blue_ember_demo_employees_v1";
const EMAIL="admin@blueember.example";
const PASSWORD="BlueEmber-Demo-2026";

const employeeSeed=[
  {id:"EMP-001",name:"Jordan Lee",role:"Project Manager",phone:"250-555-0201"},
  {id:"EMP-002",name:"Alex Morgan",role:"Restoration Technician",phone:"250-555-0202"},
  {id:"EMP-003",name:"Taylor Singh",role:"Restoration Technician",phone:"250-555-0203"},
  {id:"EMP-004",name:"Chris Walker",role:"Estimator / Technician",phone:"250-555-0204"}
];

function dateISO(daysFromNow,hour=9){
  const d=new Date();
  d.setHours(hour,0,0,0);
  d.setDate(d.getDate()+daysFromNow);
  return d.toISOString().slice(0,10);
}
const seed=[
{id:"BE-A17QX",name:"Michael Chen",phone:"250-555-0198",email:"michael.chen@example.com",contactMethod:"Phone call",service:"Water Damage",urgency:"Emergency — immediate response",address:"North District",message:"Supply line failed overnight. Water has reached the main floor and basement ceiling.",status:"Scheduled",internalNotes:"Emergency visit confirmed.",scheduledDate:dateISO(0),scheduledTime:"10:30",employeeId:"EMP-002",createdAt:new Date(Date.now()-18*60000).toISOString()},
{id:"BE-K8L2P",name:"Sarah Thompson",phone:"250-555-0142",email:"sarah.t@example.com",contactMethod:"Email",service:"Mold Remediation",urgency:"Standard — within 1–2 business days",address:"Lakeside",message:"We found suspected mold behind drywall after a previous leak and would like an assessment.",status:"Contacted",internalNotes:"Left voicemail; follow-up email sent.",scheduledDate:"",scheduledTime:"",employeeId:"",createdAt:new Date(Date.now()-3.3*3600000).toISOString()},
{id:"BE-H4M9C",name:"David Wilson",phone:"250-555-0116",email:"dwilson@example.com",contactMethod:"Phone call",service:"Fire / Smoke Damage",urgency:"Urgent — today",address:"Riverbend",message:"Small kitchen fire is out. Need assessment for smoke and soot damage.",status:"Scheduled",internalNotes:"Assessment confirmed.",scheduledDate:dateISO(1),scheduledTime:"09:00",employeeId:"EMP-001",createdAt:new Date(Date.now()-22*3600000).toISOString()},
{id:"BE-P3D8R",name:"Emily Fraser",phone:"250-555-0133",email:"emily.f@example.com",contactMethod:"Text message",service:"Asbestos Abatement",urgency:"Standard — within 1–2 business days",address:"Mountain View",message:"Renovation project requires an asbestos assessment before work continues.",status:"Scheduled",internalNotes:"Site visit confirmed.",scheduledDate:dateISO(3),scheduledTime:"13:30",employeeId:"EMP-004",createdAt:new Date(Date.now()-30*3600000).toISOString()}
];

let memoryRequests=null;
function clone(v){return JSON.parse(JSON.stringify(v))}
function storageAvailable(){try{const t="__blue_ember_test__";localStorage.setItem(t,"1");localStorage.removeItem(t);return true}catch(e){return false}}
const HAS_STORAGE=storageAvailable();
function read(){
  if(HAS_STORAGE){
    try{
      const raw=localStorage.getItem(KEY),parsed=raw?JSON.parse(raw):null;
      if(Array.isArray(parsed)&&parsed.length)return parsed;
      const initial=clone(seed);localStorage.setItem(KEY,JSON.stringify(initial));return initial;
    }catch(e){}
  }
  if(!memoryRequests)memoryRequests=clone(seed);
  return memoryRequests;
}
function write(items){if(HAS_STORAGE){try{localStorage.setItem(KEY,JSON.stringify(items));return}catch(e){}}memoryRequests=items}
function employees(){return clone(employeeSeed)}
function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function ago(iso){const m=Math.floor((Date.now()-new Date(iso))/60000);if(m<60)return `${Math.max(1,m)}m ago`;const h=Math.floor(m/60);return h<24?`${h}h ago`:`${Math.floor(h/24)}d ago`}
function fmtDate(v){if(!v)return "Not scheduled";return new Date(v+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function employeeName(id){const e=employees().find(e=>e.id===id);return e?e.name:"Unassigned"}
function makeId(){return "BE-"+Math.random().toString(36).slice(2,7).toUpperCase()}

let selected=null;
let calendarCursor=new Date();
calendarCursor.setDate(1);

const login=document.getElementById("loginView"),dashboard=document.getElementById("dashboardView");
function setAuth(ok){login.hidden=ok;dashboard.hidden=!ok;if(ok){showTab("dashboardTab");renderAll()}}
document.getElementById("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  const ok=document.getElementById("loginEmail").value.trim()===EMAIL&&document.getElementById("loginPassword").value===PASSWORD;
  document.getElementById("loginError").hidden=ok;if(ok)setAuth(true)
});
document.getElementById("logoutBtn").onclick=()=>setAuth(false);
document.getElementById("resetDemo").onclick=()=>{write(clone(seed));selected=null;calendarCursor=new Date();calendarCursor.setDate(1);renderAll()};
document.getElementById("prevMonth").onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar(read())};
document.getElementById("nextMonth").onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar(read())};
["searchInput","statusFilter"].forEach(id=>document.getElementById(id).addEventListener("input",()=>renderRequests(read())));

document.querySelectorAll(".admin-tab").forEach(btn=>{
  btn.addEventListener("click",()=>showTab(btn.dataset.view));
});
function showTab(id){
  document.querySelectorAll(".tab-view").forEach(v=>v.hidden=v.id!==id);
  document.querySelectorAll(".admin-tab").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  const titles={
    dashboardTab:["Dashboard","Customer requests and confirmed schedules in one view."],
    employeesTab:["Employees","Employee assignments and scheduled customer visits."],
    managementTab:["Management","Add customer requests manually and manage intake."]
  };
  document.getElementById("pageTitle").textContent=titles[id][0];
  document.getElementById("pageSubtitle").textContent=titles[id][1];
  if(id==="employeesTab")renderEmployees(read());
}

function filtered(items){
  const q=document.getElementById("searchInput").value.trim().toLowerCase(),s=document.getElementById("statusFilter").value;
  return items.filter(x=>{const hay=[x.name,x.email,x.phone,x.service,x.address,x.id].join(" ").toLowerCase();return(!q||hay.includes(q))&&(!s||x.status===s)});
}
function renderMetrics(items){
  const stats=[
    ["Open Requests",items.filter(x=>x.status!=="Closed").length],
    ["Awaiting Contact",items.filter(x=>x.status==="New").length],
    ["Confirmed Visits",items.filter(x=>x.status==="Scheduled"&&x.scheduledDate).length],
    ["Employees Scheduled",new Set(items.filter(x=>x.status==="Scheduled"&&x.employeeId).map(x=>x.employeeId)).size]
  ];
  document.getElementById("metrics").innerHTML=stats.map(([k,v])=>`<div class="metric"><span>${k}</span><strong>${v}</strong></div>`).join("");
}
function renderRequests(items){
  const list=filtered(items);
  document.getElementById("requestCount").textContent=`${list.length} shown`;
  const el=document.getElementById("requestList");
  if(!list.length){el.innerHTML='<div class="no-results">No requests match these filters.</div>';return}
  el.innerHTML=list.map(x=>`
    <div class="request ${x.id===selected?"active":""}" data-id="${esc(x.id)}">
      <div>
        <h3>${esc(x.name)}</h3>
        <p>${esc(x.service)} · ${esc(x.address||"Address not provided")}</p>
        <div class="tags">
          <span class="tag ${x.status.toLowerCase()}">${esc(x.status)}</span>
          ${x.urgency.startsWith("Emergency")?'<span class="tag emergency">Emergency</span>':""}
          ${x.status==="Scheduled"&&x.scheduledDate?`<span class="tag">${esc(fmtDate(x.scheduledDate))}</span>`:""}
        </div>
      </div><span class="time">${ago(x.createdAt)}</span>
    </div>`).join("");
  el.querySelectorAll(".request").forEach(n=>n.onclick=()=>{selected=n.dataset.id;renderRequests(read());renderDetail(read())});
}
function renderDetail(items){
  const x=items.find(r=>r.id===selected),el=document.getElementById("detailPanel");
  if(!x){el.innerHTML='<div class="empty-state"><div class="empty-mark">BE</div><h3>Select a customer request</h3><p>Review customer details, assign an employee and schedule a confirmed visit.</p></div>';return}
  const employeeOptions=employees().map(e=>`<option value="${e.id}" ${e.id===x.employeeId?"selected":""}>${esc(e.name)} — ${esc(e.role)}</option>`).join("");
  el.innerHTML=`
    <div class="detail">
      <h2>${esc(x.name)}</h2><div class="detail-sub">${esc(x.id)} · submitted ${ago(x.createdAt)}</div>
      <div class="detail-section detail-grid">
        <div class="info"><span>Phone</span><strong>${esc(x.phone)}</strong></div>
        <div class="info"><span>Email</span><strong>${esc(x.email||"Not provided")}</strong></div>
        <div class="info"><span>Service</span><strong>${esc(x.service)}</strong></div>
        <div class="info"><span>Urgency</span><strong>${esc(x.urgency)}</strong></div>
        <div class="info"><span>Address</span><strong>${esc(x.address||"Not provided")}</strong></div>
        <div class="info"><span>Preferred Contact</span><strong>${esc(x.contactMethod)}</strong></div>
      </div>
      <div class="detail-section"><strong>Customer Message</strong><p>${esc(x.message||"No details provided.")}</p></div>
      <div class="detail-section">
        <strong>Schedule & Assignment</strong>
        <div class="schedule-form">
          <label>Status<select id="detailStatus">${["New","Contacted","Scheduled","Closed"].map(s=>`<option ${s===x.status?"selected":""}>${s}</option>`).join("")}</select></label>
          <label>Employee<select id="detailEmployee"><option value="">Unassigned</option>${employeeOptions}</select></label>
          <label>Visit Date<input id="detailDate" type="date" value="${esc(x.scheduledDate||"")}"></label>
          <label>Visit Time<input id="detailTime" type="time" value="${esc(x.scheduledTime||"")}"></label>
          <label class="wide">Internal Notes<textarea id="detailNotes" placeholder="Add call notes, assignment details or next steps...">${esc(x.internalNotes||"")}</textarea></label>
        </div>
        <div class="save-row"><button class="btn red" id="saveDetail">SAVE CHANGES</button><span id="savedFlash" class="saved"></span></div>
      </div>
    </div>`;
  document.getElementById("saveDetail").onclick=()=>{
    const all=read(),row=all.find(r=>r.id===selected);
    row.status=document.getElementById("detailStatus").value;
    row.employeeId=document.getElementById("detailEmployee").value;
    row.scheduledDate=document.getElementById("detailDate").value;
    row.scheduledTime=document.getElementById("detailTime").value;
    row.internalNotes=document.getElementById("detailNotes").value;
    if(row.scheduledDate&&row.employeeId&&row.status!=="Closed")row.status="Scheduled";
    write(all);renderAll();
    const f=document.getElementById("savedFlash");if(f){f.textContent="Saved";setTimeout(()=>f.textContent="",1200)}
  };
}

function scheduled(items){return items.filter(x=>x.status==="Scheduled"&&x.scheduledDate).sort((a,b)=>(a.scheduledDate+a.scheduledTime).localeCompare(b.scheduledDate+b.scheduledTime))}
function renderCalendar(items){
  const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();
  document.getElementById("calendarLabel").textContent=calendarCursor.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const first=new Date(year,month,1),start=new Date(year,month,1-first.getDay());
  const sched=scheduled(items),cells=[];
  for(let i=0;i<42;i++){
    const d=new Date(start);d.setDate(start.getDate()+i);
    const iso=d.toISOString().slice(0,10),same=d.getMonth()===month,events=sched.filter(x=>x.scheduledDate===iso);
    cells.push(`<div class="calendar-day ${same?"":"other"}"><span class="day-number">${d.getDate()}</span>${events.map(e=>`<span class="calendar-event"><strong>${esc(e.scheduledTime||"Time TBD")} · ${esc(e.name)}</strong><span>${esc(employeeName(e.employeeId))}</span></span>`).join("")}</div>`);
  }
  document.getElementById("calendarGrid").innerHTML=cells.join("");
  renderUpcoming(items);
}
function renderUpcoming(items){
  const today=new Date().toISOString().slice(0,10),list=scheduled(items).filter(x=>x.scheduledDate>=today).slice(0,6);
  document.getElementById("upcomingList").innerHTML=list.length?list.map(x=>`
    <div class="upcoming-item"><div class="upcoming-date">${esc(fmtDate(x.scheduledDate))}<br>${esc(x.scheduledTime||"TBD")}</div><div><strong>${esc(x.name)} — ${esc(x.service)}</strong><span>${esc(employeeName(x.employeeId))} · ${esc(x.address||"Address not provided")}</span></div></div>`).join(""):'<div class="no-results">No upcoming visits.</div>';
}
function renderEmployees(items){
  const es=employees(),sched=scheduled(items);
  document.getElementById("employeesGrid").innerHTML=es.map(e=>{
    const visits=sched.filter(x=>x.employeeId===e.id);
    return `<article class="employee-card">
      <div class="employee-head"><div><h3>${esc(e.name)}</h3><span>${esc(e.role)} · ${esc(e.phone)}</span></div><strong>${visits.length} visit${visits.length===1?"":"s"}</strong></div>
      <div class="employee-visits">${visits.length?visits.map(v=>`<div class="employee-visit"><strong>${esc(fmtDate(v.scheduledDate))} · ${esc(v.scheduledTime||"TBD")} — ${esc(v.name)}</strong><span>${esc(v.service)} · ${esc(v.address||"Address not provided")}</span></div>`).join(""):'<div class="no-visits">No confirmed visits assigned.</div>'}</div>
    </article>`;
  }).join("");
}

document.getElementById("manualCustomerForm").addEventListener("submit",e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget),items=read();
  items.unshift({
    id:makeId(),name:fd.get("name"),phone:fd.get("phone"),email:fd.get("email"),contactMethod:fd.get("contactMethod"),
    service:fd.get("service"),urgency:fd.get("urgency"),address:fd.get("address"),message:fd.get("message"),
    status:"New",internalNotes:"Added manually by management.",scheduledDate:"",scheduledTime:"",employeeId:"",createdAt:new Date().toISOString()
  });
  write(items);e.currentTarget.reset();
  const s=document.getElementById("manualSuccess");s.hidden=false;setTimeout(()=>s.hidden=true,2500);
  renderAll();
});

function renderAll(){
  const items=read().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  renderMetrics(items);renderRequests(items);renderDetail(items);renderCalendar(items);renderEmployees(items);
}
setAuth(false);
