const SIGNUP_KEY="urs_demo_email_signups_v1";

function saveSignup(email){
  let signups=[];
  try{signups=JSON.parse(localStorage.getItem(SIGNUP_KEY))||[]}catch(e){}
  if(!signups.some(item=>item.email.toLowerCase()===email.toLowerCase())){
    signups.unshift({email,createdAt:new Date().toISOString()});
  }
  try{localStorage.setItem(SIGNUP_KEY,JSON.stringify(signups))}catch(e){}
}

const emailForm=document.getElementById("emailForm");
emailForm.addEventListener("submit",event=>{
  event.preventDefault();
  const email=new FormData(emailForm).get("email").trim();
  saveSignup(email);
  emailForm.reset();
  document.getElementById("signupSuccess").hidden=false;
});

const menuButton=document.querySelector(".menu-btn");
const navigation=document.querySelector(".site-header nav");
menuButton.addEventListener("click",()=>{
  const open=menuButton.getAttribute("aria-expanded")==="true";
  menuButton.setAttribute("aria-expanded",String(!open));
  navigation.style.display=open?"":"flex";
});
