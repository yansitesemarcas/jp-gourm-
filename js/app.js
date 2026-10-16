const WHATSAPP = "5585998159658";
const products = [
 {id:"kinder",name:"Kinder Bueno",desc:"Chocolate cremoso com um toque irresistível.",prices:{"200":15,"500":25},image:"assets/img/IMG_20261016_190852_456.jpg",emoji:"🍫"},
 {id:"avela",name:"Avelã",desc:"Sabor marcante e textura crocante.",prices:{"200":12,"500":22},image:"assets/img/IMG_20261016_190920_649.jpg",emoji:"🌰"},
 {id:"ninho",name:"Leite Ninho",desc:"Cremosa, docinha e cheia de sabor.",prices:{"200":12,"500":22},image:"assets/img/IMG_20261016_190938_773.jpg",emoji:"🥛"},
 {id:"ovomaltine",name:"Ovomaltine",desc:"O sabor maltado que todo mundo reconhece.",prices:{"200":12,"500":22},image:null,emoji:"🍿"},
 {id:"nutella",name:"Nutella",desc:"Consulte a disponibilidade e o valor pelo WhatsApp.",prices:{"200":null,"500":null},image:null,emoji:"🍫"}
];
const cart=[];
const money=value=>value==null?"Consulte":value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const productRoot=document.querySelector("#products");
products.forEach(p=>{
 const card=document.createElement("article");card.className="product";
 card.innerHTML=`<div class="product-art">${p.image ? `<img src="${p.image}" alt="Pipoca gourmet sabor ${p.name}" onerror="this.remove();this.parentElement.insertAdjacentHTML('beforeend','<span class=&quot;photo-soon&quot;>Foto em breve</span>')">` : '<span class="photo-soon">Foto em breve</span>'}</div>
 <div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="price" data-price>${money(p.prices["200"])}</div>
 <div class="controls"><select aria-label="Tamanho de ${p.name}" data-size><option value="200">200 ml</option><option value="500">500 ml</option></select><input aria-label="Quantidade de ${p.name}" data-qty type="number" min="1" max="99" value="1"></div>
 <button class="add" type="button">Adicionar ao pedido</button></div>`;
 const size=card.querySelector("[data-size]"),price=card.querySelector("[data-price]");
 size.addEventListener("change",()=>price.textContent=money(p.prices[size.value]));
 card.querySelector(".add").addEventListener("click",()=>{
  const amount=Math.max(1,Math.min(99,Number(card.querySelector("[data-qty]").value)||1));
  const priceValue=p.prices[size.value];
  if(priceValue==null){alert("O valor desse sabor ainda precisa ser confirmado. Consulte pelo WhatsApp antes de adicionar.");return;}
  cart.push({id:p.id,name:p.name,size:size.value,qty:amount,unit:priceValue});
  renderCart();
  document.querySelector("#carrinho").hidden=false;document.querySelector("#cart-toggle").setAttribute("aria-expanded","true");
 });
 productRoot.appendChild(card);
});
function renderCart(){
 const root=document.querySelector("#items");
 document.querySelector("#count").textContent=cart.reduce((sum,item)=>sum+item.qty,0);
 if(!cart.length){root.innerHTML='<p class="empty">Seu carrinho ainda está vazio.</p>';}
 else{root.innerHTML="";cart.forEach((item,index)=>{
  const row=document.createElement("div");row.className="cart-item";
  const detail=document.createElement("span");detail.textContent=`${item.qty}× ${item.name} • ${item.size} ml`;
  const right=document.createElement("span");right.textContent=money(item.unit*item.qty);
  const remove=document.createElement("button");remove.className="remove";remove.type="button";remove.textContent="Remover";remove.setAttribute("aria-label",`Remover ${item.name}`);
  remove.addEventListener("click",()=>{cart.splice(index,1);renderCart();});
  row.append(detail,right,remove);root.appendChild(row);
 });}
 const total=cart.reduce((sum,item)=>sum+item.unit*item.qty,0);
 document.querySelector("#total").textContent=money(total);
}
document.querySelector("#cart-toggle").addEventListener("click",()=>{const panel=document.querySelector("#carrinho");panel.hidden=!panel.hidden;document.querySelector("#cart-toggle").setAttribute("aria-expanded",String(!panel.hidden));});
document.addEventListener("click",event=>{const panel=document.querySelector("#carrinho");if(!panel.hidden&&!panel.contains(event.target)&&!event.target.closest("#cart-toggle")){panel.hidden=true;document.querySelector("#cart-toggle").setAttribute("aria-expanded","false");}});
const fulfillmentInputs=document.querySelectorAll('input[name="fulfillment"]');
const addressFields=document.querySelector("#address-fields");
const paymentSelect=document.querySelector("#payment");
const changeFields=document.querySelector("#change-fields");
fulfillmentInputs.forEach(input=>input.addEventListener("change",()=>{
 addressFields.hidden=document.querySelector('input[name="fulfillment"]:checked').value!=="Delivery";
}));
paymentSelect.addEventListener("change",()=>{changeFields.hidden=paymentSelect.value!=="Dinheiro";});
document.querySelector("#proceed").addEventListener("click",function(event){
 event.preventDefault();
 if(cart.length===0){
  alert("Adicione pelo menos um produto ao carrinho antes de prosseguir.");
  return;
 }
 const panel=document.getElementById("carrinho");
 const fields=document.getElementById("checkout-fields");
 const button=document.getElementById("proceed");
 if(!panel||!fields||!button){
  alert("Não consegui abrir a finalização. Atualize a página e tente novamente.");
  return;
 }
 panel.hidden=false;
 fields.hidden=false;
 button.style.display="none";
 fields.removeAttribute("hidden");
 fields.style.display="block";
 fields.scrollIntoView({behavior:"smooth",block:"start"});
});
document.querySelector("#send").addEventListener("click",()=>{
 if(!cart.length){alert("Adicione pelo menos um sabor ao pedido.");return;}
 const name=document.querySelector("#customer").value.trim();
 const phone=document.querySelector("#phone").value.trim();
 if(!name||!phone){alert("Preencha seu nome completo e WhatsApp.");return;}
 const fulfillment=document.querySelector('input[name="fulfillment"]:checked').value;
 const payment=paymentSelect.value;
 const notes=document.querySelector("#notes").value.trim();
 const total=cart.reduce((sum,item)=>sum+item.unit*item.qty,0);
 const lines=cart.map(item=>`• ${item.qty}x ${item.name} (${item.size} ml) — ${money(item.unit*item.qty)}`);
 const details=[];
 if(fulfillment==="Delivery"){
  const street=document.querySelector("#street").value.trim();
  const number=document.querySelector("#number").value.trim();
  const neighborhood=document.querySelector("#neighborhood").value.trim();
  const complement=document.querySelector("#complement").value.trim();
  if(!street||!number||!neighborhood){alert("Para delivery, preencha rua, número e bairro.");return;}
  details.push(`Endereço: ${street}, ${number}, ${neighborhood}`);
  if(complement)details.push(`Complemento: ${complement}`);
 }else{details.push("Retirada: Rua Rubi, 37, Mondubim, Fortaleza - CE");}
 details.push(`Pagamento: ${payment}`);
 if(payment==="Dinheiro"){
  const change=document.querySelector("#change").value.trim();
  details.push(change?`Troco solicitado para: ${change}`:"Troco: não precisa / não informado");
 }
 const message=["Olá! Quero fazer um pedido na J&P Gourmet.","",`Nome: ${name}`,`WhatsApp: ${phone}`,`Recebimento: ${fulfillment}`,"",...details,"",...lines,"",`Total: ${money(total)}`,notes?`Observações: ${notes}`:"","Pode confirmar meu pedido, por favor?"].filter(Boolean).join("\n");
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
});
renderCart();