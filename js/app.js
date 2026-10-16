const WHATSAPP = "5585998159658";
const products = [
 {id:"kinder",name:"Kinder Bueno",desc:"Chocolate cremoso com um toque irresistível.",prices:{"200":15,"500":25},image:"assets/img/kinder-bueno.jpg",emoji:"🍫"},
 {id:"avela",name:"Avelã",desc:"Sabor marcante e textura crocante.",prices:{"200":12,"500":22},image:"assets/img/avela.jpg",emoji:"🌰"},
 {id:"ninho",name:"Leite Ninho",desc:"Cremosa, docinha e cheia de sabor.",prices:{"200":12,"500":22},image:"assets/img/leite-ninho.jpg",emoji:"🥛"},
 {id:"ovomaltine",name:"Ovomaltine",desc:"O sabor maltado que todo mundo reconhece.",prices:{"200":12,"500":22},image:"assets/img/ovomaltine.jpg",emoji:"🍿"},
 {id:"nutella",name:"Nutella",desc:"Consulte a disponibilidade e o valor pelo WhatsApp.",prices:{"200":null,"500":null},image:"assets/img/nutella.jpg",emoji:"🍫"}
];
const cart=[];
const money=value=>value==null?"Consulte":value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const productRoot=document.querySelector("#products");
products.forEach(p=>{
 const card=document.createElement("article");card.className="product";
 card.innerHTML=`<div class="product-art"><img src="${p.image}" alt="Pipoca gourmet sabor ${p.name}" onerror="this.remove();this.parentElement.insertAdjacentHTML('beforeend','<span class=&quot;emoji&quot;>${p.emoji}</span>')"></div>
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
  document.querySelector("#pedido").scrollIntoView({behavior:"smooth",block:"start"});
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
document.querySelector("#send").addEventListener("click",()=>{
 if(!cart.length){alert("Adicione pelo menos um sabor ao pedido.");return;}
 const name=document.querySelector("#customer").value.trim();
 if(!name){document.querySelector("#customer").focus();alert("Informe seu nome para continuar.");return;}
 const notes=document.querySelector("#notes").value.trim();
 const lines=cart.map(item=>`• ${item.qty}x ${item.name} (${item.size} ml) — ${money(item.unit*item.qty)}`);
 const total=cart.reduce((sum,item)=>sum+item.unit*item.qty,0);
 const message=[ "Olá! Quero fazer um pedido na J&P Gourmet.","",`Nome: ${name}`,"",...lines,"",`Total: ${money(total)}`,"","Retirada: Rua Rubi, 37, Mondubim, Fortaleza - CE","Pagamento: Pix, dinheiro ou cartão.",notes?`Observações: ${notes}`:"","Pode confirmar a disponibilidade e combinar a retirada?"].filter(Boolean).join("\n");
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
});
renderCart();