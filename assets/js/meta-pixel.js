/* Pixel da Meta · conjunto de dados "WasFit - Site" (BM WasFit) · criado em 05/10/2026
   Arquivo proprio (mesma origem): a CSP libera por 'self', sem hash.
   O site ja registra tudo no dataLayer; aqui cada evento vira o evento da Meta
   equivalente. Para mudar o mapeamento, mexa so em MAPA abaixo.
   Os UTMs da URL vao em todos os eventos (utm_source/medium/campaign/content). */
(function(){
  var PIXEL_ID='2358085358273598';
  if(!/(^|\.)wasfit\.com\.br$/.test(location.hostname))return; /* nao suja o pixel com testes locais */

  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('set','autoConfig',false,PIXEL_ID); /* sem rastreio automatico de botoes: so os eventos do MAPA */
  fbq('init',PIXEL_ID);
  fbq('track','PageView');

  var q=new URLSearchParams(location.search),UTM={};
  ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(function(k){var v=q.get(k);if(v)UTM[k]=v});
  function com(extra){var o={};for(var k in UTM)o[k]=UTM[k];for(var j in extra)o[j]=extra[j];return o}

  /* evento do dataLayer -> [tipo, nome da Meta, parametros]. tipo 't' = padrao, 'c' = personalizado */
  var MAPA={
    /* leads: a pessoa deixou nome e WhatsApp (vai para a planilha e a plataforma) */
    agendar_lead:       function(d){return['t','Lead',{content_name:'Agendar raio-x',content_category:'agendar_raiox',local:d.local||'',status:d.status||''}]},
    testar_lead:        function(d){return['t','Lead',{content_name:'Testar a IA',content_category:'testar_ia',local:d.local||'',status:'ok'}]},
    testar_lead_erro:   function(d){return['t','Lead',{content_name:'Testar a IA',content_category:'testar_ia',local:d.local||'',status:'erro'}]},
    testar_lead_timeout:function(d){return['t','Lead',{content_name:'Testar a IA',content_category:'testar_ia',local:d.local||'',status:'sem resposta'}]},
    raiox_lead:         function(d){return['t','Lead',{content_name:'Raio-x (pagina)',content_category:'raiox_pagina'}]},
    /* resultado do questionario */
    raiox_home:         function(d){return['t','ViewContent',{content_name:'Resultado raio-x (home)',content_category:'raiox',score:d.score}]},
    raiox_resultado:    function(d){return['t','ViewContent',{content_name:'Resultado raio-x (pagina)',content_category:'raiox',score:d.score}]},
    /* foi para o cadastro (7 dias gratis / vaga de fundador / plano) */
    clique_cadastro:    function(d){return['t','StartTrial',{content_name:'Cadastro',local:d.local||'',currency:'BRL',value:0,predicted_ltv:0}]},
    clique_plano:       function(d){return['t','StartTrial',{content_name:'Plano '+(d.plano||''),local:d.local||'',currency:'BRL',value:0,predicted_ltv:0}]},
    /* conversa direta com a WasFit no WhatsApp */
    clique_whatsapp:    function(d){return['t','Contact',{content_name:'WhatsApp',local:d.local||''}]},
    raiox_whatsapp:     function(d){return['t','Contact',{content_name:'WhatsApp apos raio-x (pagina)'}]},
    clique_reuniao:     function(d){return /^agendar_/.test(d.local||'')?['t','Contact',{content_name:'WhatsApp apos agendar',local:d.local}]:null}, /* abrir a janela ja conta em abriu_agendar */
    /* intencao (abriu a janela, ainda nao preencheu) */
    abriu_agendar:      function(d){return['c','AbriuAgendar',{local:d.local||''}]},
    abriu_testar:       function(d){return['c','AbriuTestarIA',{local:d.local||''}]},
    qr_testar:          function(d){return['c','QRTestarIA',{}]},
    clique_compartilhar:function(d){return['c','CompartilhouComGestor',{local:d.local||''}]}
  };

  function envia(d){
    if(!d||typeof d!=='object'||!d.event||!MAPA[d.event])return;
    try{var r=MAPA[d.event](d);if(r)fbq(r[0]==='t'?'track':'trackCustom',r[1],com(r[2]))}catch(e){}
  }
  var dl=window.dataLayer=window.dataLayer||[];
  dl.forEach(envia);
  var orig=dl.push;
  dl.push=function(){for(var i=0;i<arguments.length;i++)envia(arguments[i]);return orig.apply(dl,arguments)};
})();
