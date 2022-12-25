import{r as k,o as _,i as Q,m as s,n as j,j as n,U as S,V as J,v as U,x as N,w as r,t as T,p as g,I as B,ab as H,z as K,A as q,L as C}from"./vendor.d1385716.js";import{f as b,H as G,T as Z,_ as $}from"./setting.8f418a66.js";import{F as ee,s as te,c as se}from"./index.ded8f101.js";import ie from"./index.e107bdd6.js";import{_ as oe}from"./index.45f5150f.js";import"./index.dca15d38.js";import"./index.d74b5101.js";const ae={name:"VideoPlay",components:{FileRemark:ee,FileInfo:ie},data(){return{selectColor:"#f13e49",textarea:"",lastJson:"",width:960,intervalTagLeft:0,intervalTagRight:0,height:400,rect:[],canvas:{},showMenu:!1,x:"",y:"",mouseFrom:{},mouseTo:{},drawType:null,canvasObjectIndex:0,textbox:null,rectangleLabel:"warning",drawWidth:2,color:"#E34F51",drawingObject:null,moveCount:1,doDrawing:!1,historyList:[],historyFallback:[],polygonMode:!1,pointArray:[],lineArray:[],activeShape:!1,activeLine:"",line:{},delectKlass:{},imgFile:{},imgTitle:"",imgSrc:"",tagList:[{currTime:[56.49848,73],currTimeType:"1",remark:"dsdsdsssd",sendTime:1652924662878,replyList:[],reply:"",tagData:'{"version":"5.2.1","objects":[{"type":"ellipse","version":"5.2.1","originX":"center","originY":"center","left":727.2,"top":340,"width":123,"height":90,"fill":"rgba(255, 255, 255, 0)","stroke":"#f13e49","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":61.5,"ry":45},{"type":"path","version":"5.2.1","originX":"left","originY":"top","left":324.7,"top":150,"width":172,"height":104,"fill":"#f13e49","stroke":"#f13e49","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",325.7000045776367,255],["L",469.847476313198,161.00579670511308],["L",466.8210096239132,156.00048641129592],["L",497.7000045776367,151],["L",478.9268763810524,176.02172758656462],["L",475.9004096917676,171.01641729274746],["Z"]]},{"type":"path","version":"5.2.1","originX":"left","originY":"top","left":521.7,"top":187,"width":103,"height":58,"fill":"#f13e49","stroke":"#f13e49","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",522.7000045776367,188],["L",612.521072338105,234.63105504870876],["L",614.2089095302061,231.63368900066706],["L",625.7000045776367,246],["L",607.4575607618016,243.6231531928338],["L",609.1453979539027,240.6257871447921],["Z"]]},{"type":"path","version":"5.2.1","originX":"left","originY":"top","left":669.7,"top":92,"width":47,"height":116,"fill":"#f13e49","stroke":"#f13e49","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",670.7000045776367,209],["L",707.5404645304563,108.37542766807236],["L",704.1647901462541,107.00769752964557],["L",717.7000045776367,93],["L",717.6674876830632,112.47861808335271],["L",714.2918132988609,111.11088794492592],["Z"]]}]}'},{currTime:[81.42428,91],currTimeType:"1",remark:"dsddsddsdsd",sendTime:1652924729117,replyList:[],reply:"",tagData:'{"version":"5.2.1","objects":[{"type":"path","version":"5.2.1","originX":"left","originY":"top","left":443.2,"top":49.5,"width":169,"height":119,"fill":null,"stroke":"#f13e49","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",481.69900457763674,68],["Q",481.7000045776367,68,481.7000045776367,67.5],["Q",481.7000045776367,67,483.7000045776367,67],["Q",485.7000045776367,67,486.2000045776367,67],["Q",486.7000045776367,67,489.7000045776367,67],["Q",492.7000045776367,67,495.2000045776367,67],["Q",497.7000045776367,67,500.2000045776367,67],["Q",502.7000045776367,67,508.2000045776367,66.5],["Q",513.7000045776367,66,519.7000045776367,66],["Q",525.7000045776367,66,529.7000045776367,66],["Q",533.7000045776367,66,537.2000045776367,66],["Q",540.7000045776367,66,543.2000045776367,66],["Q",545.7000045776367,66,549.2000045776367,66],["Q",552.7000045776367,66,556.7000045776367,66],["Q",560.7000045776367,66,563.2000045776367,66],["Q",565.7000045776367,66,567.7000045776367,66.5],["Q",569.7000045776367,67,571.2000045776367,67],["Q",572.7000045776367,67,574.2000045776367,67.5],["Q",575.7000045776367,68,576.7000045776367,69],["Q",577.7000045776367,70,578.2000045776367,70.5],["Q",578.7000045776367,71,580.2000045776367,71.5],["Q",581.7000045776367,72,582.2000045776367,73],["Q",582.7000045776367,74,583.7000045776367,74.5],["Q",584.7000045776367,75,585.7000045776367,76.5],["Q",586.7000045776367,78,587.7000045776367,79],["Q",588.7000045776367,80,589.7000045776367,81.5],["Q",590.7000045776367,83,592.2000045776367,84.5],["Q",593.7000045776367,86,593.7000045776367,86.5],["Q",593.7000045776367,87,594.2000045776367,88],["Q",594.7000045776367,89,594.7000045776367,89.5],["Q",594.7000045776367,90,595.2000045776367,90.5],["Q",595.7000045776367,91,595.7000045776367,92],["Q",595.7000045776367,93,595.7000045776367,94],["Q",595.7000045776367,95,595.7000045776367,95.5],["Q",595.7000045776367,96,595.7000045776367,97.5],["Q",595.7000045776367,99,595.7000045776367,99.5],["Q",595.7000045776367,100,595.2000045776367,102],["Q",594.7000045776367,104,593.7000045776367,106.5],["Q",592.7000045776367,109,591.2000045776367,111.5],["Q",589.7000045776367,114,587.7000045776367,116.5],["Q",585.7000045776367,119,583.7000045776367,122.5],["Q",581.7000045776367,126,580.2000045776367,128.5],["Q",578.7000045776367,131,576.2000045776367,132.5],["Q",573.7000045776367,134,571.2000045776367,136.5],["Q",568.7000045776367,139,567.2000045776367,140.5],["Q",565.7000045776367,142,562.7000045776367,144],["Q",559.7000045776367,146,557.2000045776367,147],["Q",554.7000045776367,148,552.2000045776367,149.5],["Q",549.7000045776367,151,548.2000045776367,151.5],["Q",546.7000045776367,152,544.2000045776367,153],["Q",541.7000045776367,154,539.2000045776367,154.5],["Q",536.7000045776367,155,533.2000045776367,156],["Q",529.7000045776367,157,527.7000045776367,157],["Q",525.7000045776367,157,524.2000045776367,157],["Q",522.7000045776367,157,520.7000045776367,157],["Q",518.7000045776367,157,516.2000045776367,157],["Q",513.7000045776367,157,511.7000045776367,157],["Q",509.7000045776367,157,507.2000045776367,156.5],["Q",504.7000045776367,156,503.2000045776367,156],["Q",501.7000045776367,156,499.7000045776367,155],["Q",497.7000045776367,154,495.7000045776367,152.5],["Q",493.7000045776367,151,491.7000045776367,150],["Q",489.7000045776367,149,488.2000045776367,148],["Q",486.7000045776367,147,481.7000045776367,142],["Q",476.7000045776367,137,475.2000045776367,135],["Q",473.7000045776367,133,472.7000045776367,130.5],["Q",471.7000045776367,128,470.7000045776367,126.5],["Q",469.7000045776367,125,469.7000045776367,124],["Q",469.7000045776367,123,469.2000045776367,121.5],["Q",468.7000045776367,120,468.7000045776367,117.5],["Q",468.7000045776367,115,468.7000045776367,113],["Q",468.7000045776367,111,468.7000045776367,109.5],["Q",468.7000045776367,108,468.7000045776367,105.5],["Q",468.7000045776367,103,470.2000045776367,100.5],["Q",471.7000045776367,98,473.7000045776367,94.5],["Q",475.7000045776367,91,478.2000045776367,89],["Q",480.7000045776367,87,483.7000045776367,83],["Q",486.7000045776367,79,490.2000045776367,76.5],["Q",493.7000045776367,74,498.2000045776367,72],["Q",502.7000045776367,70,506.2000045776367,67.5],["Q",509.7000045776367,65,514.7000045776367,63.5],["Q",519.7000045776367,62,525.7000045776367,59.5],["Q",531.7000045776367,57,534.7000045776367,56.5],["Q",537.7000045776367,56,543.2000045776367,55],["Q",548.7000045776367,54,551.7000045776367,54],["Q",554.7000045776367,54,558.2000045776367,54],["Q",561.7000045776367,54,563.7000045776367,54],["Q",565.7000045776367,54,569.7000045776367,54.5],["Q",573.7000045776367,55,575.7000045776367,56.5],["Q",577.7000045776367,58,579.7000045776367,58.5],["Q",581.7000045776367,59,583.2000045776367,60],["Q",584.7000045776367,61,586.2000045776367,62],["Q",587.7000045776367,63,590.2000045776367,65.5],["Q",592.7000045776367,68,593.2000045776367,69],["Q",593.7000045776367,70,595.7000045776367,72.5],["Q",597.7000045776367,75,598.7000045776367,77.5],["Q",599.7000045776367,80,600.7000045776367,83],["Q",601.7000045776367,86,602.2000045776367,87.5],["Q",602.7000045776367,89,602.7000045776367,92],["Q",602.7000045776367,95,603.2000045776367,97.5],["Q",603.7000045776367,100,603.7000045776367,103],["Q",603.7000045776367,106,603.7000045776367,108],["Q",603.7000045776367,110,602.7000045776367,112.5],["Q",601.7000045776367,115,599.7000045776367,119],["Q",597.7000045776367,123,593.7000045776367,128],["Q",589.7000045776367,133,587.7000045776367,135.5],["Q",585.7000045776367,138,581.7000045776367,140.5],["Q",577.7000045776367,143,573.7000045776367,146],["Q",569.7000045776367,149,566.2000045776367,151.5],["Q",562.7000045776367,154,559.2000045776367,156.5],["Q",555.7000045776367,159,552.2000045776367,160.5],["Q",548.7000045776367,162,546.7000045776367,162.5],["Q",544.7000045776367,163,540.2000045776367,165],["Q",535.7000045776367,167,532.7000045776367,167],["Q",529.7000045776367,167,525.2000045776367,168],["Q",520.7000045776367,169,517.7000045776367,169],["Q",514.7000045776367,169,513.7000045776367,169],["Q",512.7000045776367,169,499.2000045776367,165.5],["Q",485.7000045776367,162,483.2000045776367,160.5],["Q",480.7000045776367,159,477.2000045776367,156.5],["Q",473.7000045776367,154,471.2000045776367,152],["Q",468.7000045776367,150,466.7000045776367,148],["Q",464.7000045776367,146,461.2000045776367,143.5],["Q",457.7000045776367,141,456.2000045776367,138.5],["Q",454.7000045776367,136,452.2000045776367,133.5],["Q",449.7000045776367,131,449.2000045776367,130],["Q",448.7000045776367,129,447.2000045776367,127],["Q",445.7000045776367,125,445.2000045776367,123.5],["Q",444.7000045776367,122,444.2000045776367,120.5],["Q",443.7000045776367,119,443.7000045776367,117],["Q",443.7000045776367,115,444.7000045776367,112],["Q",445.7000045776367,109,447.2000045776367,106],["Q",448.7000045776367,103,450.7000045776367,100],["Q",452.7000045776367,97,455.7000045776367,93],["Q",458.7000045776367,89,461.7000045776367,86],["Q",464.7000045776367,83,468.7000045776367,80],["Q",472.7000045776367,77,475.2000045776367,75],["Q",477.7000045776367,73,484.2000045776367,69.5],["Q",490.7000045776367,66,495.7000045776367,64],["Q",500.7000045776367,62,504.2000045776367,60.5],["Q",507.7000045776367,59,513.2000045776367,57],["Q",518.7000045776367,55,533.2000045776367,52.5],["Q",547.7000045776367,50,557.7000045776367,50],["Q",567.7000045776367,50,572.7000045776367,50],["Q",577.7000045776367,50,579.7000045776367,50.5],["Q",581.7000045776367,51,585.7000045776367,51.5],["Q",589.7000045776367,52,593.7000045776367,54],["Q",597.7000045776367,56,600.2000045776367,57.5],["Q",602.7000045776367,59,604.2000045776367,60],["Q",605.7000045776367,61,607.2000045776367,62],["Q",608.7000045776367,63,609.2000045776367,64.5],["Q",609.7000045776367,66,610.2000045776367,66.5],["Q",610.7000045776367,67,611.2000045776367,67],["Q",611.7000045776367,67,612.2000045776367,68.5],["L",612.7010045776367,70.001]]},{"type":"path","version":"5.2.1","originX":"left","originY":"top","left":448.7,"top":208,"width":172,"height":54.51,"fill":"#f13e49","stroke":"#f13e49","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",621.7000045776367,209],["L",476.03929949743303,258.49975679435204],["L",477.55253284207544,263.5050670881692],["L",449.7000045776367,261],["L",471.49959946350583,243.48382591290053],["L",473.01283280814823,248.48913620671772],["Z"]]},{"type":"ellipse","version":"5.2.1","originX":"center","originY":"center","left":651.2,"top":329.5,"width":73,"height":49,"fill":"rgba(255, 255, 255, 0)","stroke":"#f13e49","strokeWidth":2,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":36.5,"ry":24.5}]}'}],player:null,isPlay:!1,fps:"",onPlayTime:0,onPlayPercent:0,chooseTime:[],showChooseTime:!1,workTime:[],playerDuration:0,activeRightTab:"opinion",isActiveTag:null,isMouseTag:"",clientHeight:"",speedTab:0,timeFormat:"b",playbackRate:"1.0",isLoop:!1,dialogKeyboard:!1}},props:{msg:String},watch:{drawType(){this.canvas.selection=!this.drawType},width(e){console.log("val-------",e),this.canvas.setWidth(this.width)},height(){this.canvas.setHeight(this.height)}},mounted(){this.canvas=new b.fabric.Canvas("canvas",{}),this.canvas.selectionColor="rgba(0,0,0,0.05)",this.canvas.on("mouse:down",this.mousedown),this.canvas.on("mouse:move",this.mousemove),this.canvas.on("mouse:up",this.mouseup),document.onkeydown=e=>{e.keyCode==46&&this.deleteObj(),e.keyCode==90&&e.ctrlKey&&this.canvas.remove(this.canvas.getObjects()[this.canvas.getObjects().length-1])},this.tcAdapterInit(),this.clientHeight=document.body.clientHeight,this.$nextTick(()=>{document.addEventListener("keyup",e=>{e.key==="Escape"&&this.upEscape()})})},methods:{xgplayInit(e){let t=this;this.player=new G({id:"xgplayer",fitVideoSize:"fixWidth",url:e,videoInit:!0,controls:!1,screenShot:{saveImg:!0,quality:.92,type:"image/png",format:".png"},rotate:{innerRotate:!0,clockwise:!1}}),this.player.once("canplay",()=>{t.playerDuration=t.player.duration}),this.player.on("play",function(){t.isPlay=!0}),this.player.on("pause",function(){t.isPlay=!1}),this.player.on("requestFullscreen",()=>{t.player.controls=!0,console.log("requestFullscreen",t.player)}),this.player.on("exitFullscreen",()=>{t.player.controls=!1,console.log("exitFullscreen",this.player)}),this.player.on("timeupdate",this.onTimeChange)},playPause(){let e=document.getElementById("xgplayer").getElementsByTagName("video")[0].clientWidth;console.log("--\u5BBD\u5EA6-",e),this.isPlay?this.player.pause():this.player.play()},onTimeChange(){if(this.workTime.length>0&&this.workTime[1]-this.workTime[0]>1&&(this.player.currentTime>=this.workTime[1]||this.player.currentTime<=this.workTime[0])&&(this.player.currentTime=this.workTime[0]),this.chooseTime.length===0||this.chooseTime[1]-this.chooseTime[0]<=1){const t=this.player.currentTime;this.chooseTime=[t,t]}this.onPlayTime=this.player.currentTime;let e=this.onPlayTime/this.player.duration;this.onPlayPercent=e*100},currentTime(e){this.player.currentTime=this.player.currentTime+e*1},currentZhen(e){this.fps=24;const t=(1/this.fps).toFixed(5)*1;console.log("---zhen---",t),e?this.currentTime(t):this.currentTime(-t)},loopChange(e){this.isLoop=e,this.player.loop=e},fullScreenFun(){this.player.getFullscreen(this.player.root)},rotatePlayer(e){this.player.rotate(!0,!0,1)},showKeyboard(){this.$confirm('<img width="400" src="https://xinyue-public-new.oss-cn-hangzhou.aliyuncs.com/web_static_resources/keyboard-win.png">',"\u952E\u76D8\u5FEB\u6377\u952E",{dangerouslyUseHTMLString:!0,showConfirmButton:!1,showCancelButton:!1})},playPerChange(e){this.player.currentTime=e/100*this.player.duration,this.workTime.length===0&&(this.isActiveTag=null,this.chooseTime=[],this.canvas.clear())},mousemovePer(e){this.speedTab=e.offsetX/this.$refs.videoRunway.clientWidth*100},throttle(e,t){let l,c;return function(o){let i=this,h=arguments,u=+new Date;l&&u<l+t?(clearTimeout(c),c=setTimeout(function(){l=u,e.apply(i,h)},t)):(l=u,e.apply(i,h))}},textClick(){if(this.player.pause(),this.showChooseTime=!0,this.chooseTime.length===0||this.chooseTime[1]-this.chooseTime[0]<=1){const e=this.player.currentTime;this.chooseTime=[e,e]}},texBlue(){console.log("--texBlue---"),this.showChooseTime=!1},chooseTimeChange(e,t){console.log("val--",e),e[1]-e[0]>1?(this.workTime=e,this.chooseTime=e):(this.workTime=[e[0],e[0]],this.chooseTime=[e[0],e[0]]),this.player.currentTime=e[0]},lineMouseover(e){this.isMouseTag=e},lineMouseleave(){this.isMouseTag=""},upEscape(){this.chooseTime=[],this.workTime=[],this.showChooseTime=!1},timeFormatChange(e){this.timeFormat=e},playbackRateChange(e){this.player.playbackRate=e,this.playbackRate=e},secondToDate(e){return te(e)},computedTime(e){return se(e)},tcAdapterInit(){const e=this;new Z("player-container-id",{fileID:"387702301073211649",appID:"1253889389",psign:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTI1Mzg4OTM4OSwiZmlsZUlkIjoiMzg3NzAyMzAxMDczMjExNjQ5IiwiY3VycmVudFRpbWVTdGFtcCI6MTY1MzI5NzUxOSwicGNmZyI6ImJhc2ljRHJtUHJlc2V0IiwidXJsQWNjZXNzSW5mbyI6e30sImRybUxpY2Vuc2VJbmZvIjp7fX0.gNWYzcCCXXdQXbE7D0uOC1KICchOR-bUndmwHh05RDk",hlsConfig:{}},()=>{}).on(Z.TcAdapterEvents.LEVEL_LOADED,l=>{e.xgplayInit(l.details.url)})},TcAdapterCallBack(){},clickItem(e,t){console.log(e),this.isActiveTag=t,console.log(this.isActiveTag),this.player.pause(),this.chooseTime=[],this.workTime=[],this.showChooseTime=!1,e.currTimeType==="1"?this.player.currentTime=e.currTime[0]:this.player.currentTime=e.currTime,this.canvas.loadFromJSON(e.tagData)},sendTag(){if(this.textarea===""){this.$message({message:"\u5BA1\u9605\u610F\u89C1\u4E0D\u80FD\u4E3A\u7A7A",type:"warning",center:!0,"show-close":!0});return}this.tagList.unshift({currTime:this.workTime.length?this.workTime:this.player.currentTime,currTimeType:this.workTime.length?"1":"0",remark:this.textarea,sendTime:new Date().getTime(),replyList:[],reply:"",tagData:JSON.stringify(this.canvas)}),this.textarea="",this.canvas.clear(),this.showChooseTime=!1,this.chooseTime=[0,1],this.workTime=[]},onRemarkFocus(){this.player.pause()},loadJson(){this.canvas.loadFromJSON(this.lastJson)},saveToJson(){this.lastJson=JSON.stringify(this.canvas),console.log(this.lastJson)},save(){var e=document.getElementById("canvas"),t=e.toDataURL("png");t=t.replace("image/png","image/octet-stream");var l="drawingboard_"+new Date().getTime()+".png";this.saveFile(t,l)},saveFile(e,t){var l=document.createElement("a");l.href=e,l.download=t;var c=document.createEvent("MouseEvents");c.initMouseEvent("click",!0,!1,window,0,0,0,0,0,!1,!1,!1,!1,0,null),l.dispatchEvent(c)},uploadImg(){document.getElementById("imgInput").click()},loadExpImg(){var e=document.getElementById("expImg"),t=new b.fabric.Image(e,{selectable:!1});this.canvas.add(t)},uploadImgChange(){var e=document.getElementById("imgInput");if(this.imgFile=e.files[0],/\.(jpe?g|png|gif)$/i.test(this.imgFile.name)){var t=new FileReader,l=this;t.addEventListener("load",function(){l.imgTitle=l.imgFile.name,l.imgSrc=this.result},!1),t.readAsDataURL(this.imgFile)}var c=document.getElementById("img");c.onload=()=>{this.width=c.width,this.height=c.height;var o=new b.fabric.Image(c,{zIndex:-1,selectable:!1});this.canvas.add(o)}},handleAction(){console.log(this.historyList);let e=[];switch(this.drawType){case"fallback":if(this.historyList.length==0)return;e=this.historyList.pop(),e.type=="deleteObjs"?e.data.forEach(t=>{this.canvas.add(t)}):e.data.forEach(t=>{this.canvas.remove(t)}),this.historyFallback.push(e);break;case"forward":if(this.historyFallback.length==0)return;e=this.historyFallback.pop(),e.type=="deleteObjs"?e.data.forEach(t=>{this.canvas.remove(t)}):e.data.forEach(t=>{this.canvas.add(t)}),this.historyList.push(e);break;case"clear":this.canvas.clear(),this.historyList=[],this.historyFallback=[];break}this.drawType=null},drawTypeChange(e){console.log("---e--",e),this.drawType=e,this.canvas.skipTargetFind=!!e,this.textbox&&(this.textbox.enterEditing(),this.textbox.hiddenTextarea.focus()),e=="pen"?(console.log(this.canvas),this.canvas.isDrawingMode=!0,this.canvas.freeDrawingBrush.color=this.selectColor):e=="fallback"||e=="forward"||e=="clear"?(this.handleAction(),this.canvas.isDrawingMode=!1):this.canvas.isDrawingMode=!1},mousedown(e){var t=e.pointer||this.transformMouse(e.e.offsetX,e.e.offsetY);if(this.mouseFrom.x=t.x,this.mouseFrom.y=t.y,this.doDrawing=!0,this.drawType=="text"&&this.drawing(),this.drawType===""){var l=this.canvas.getActiveObjects();l.length>0&&(this.selectColor=l[0].fill)}if(this.textbox&&(this.textbox.enterEditing(),this.textbox.hiddenTextarea.focus()),this.drawType=="polygon"){this.canvas.skipTargetFind=!1;try{this.pointArray.length>1&&e.target&&e.target.id==this.pointArray[0].id&&this.generatePolygon(),this.polygonMode&&this.addPoint(e)}catch(c){console.log(c)}}},mouseup(e){var t=e.pointer||this.transformMouse(e.e.offsetX,e.e.offsetY);if(this.mouseTo.x=t.x,this.mouseTo.y=t.y,this.moveCount=1,this.drawType=="pen"){var l=this.canvas._objects[this.canvas._objects.length-1];this.historyList.push({type:this.drawType,data:[l]}),this.historyFallback=[]}this.drawingObject&&(this.historyList.push({type:this.drawType,data:[this.drawingObject]}),this.drawingObject=null,this.historyFallback=[]),this.drawType!="polygon"&&(this.doDrawing=!1)},mousemove(e){if(!(this.moveCount%2&&!this.doDrawing)){this.moveCount++;var t=e.pointer||this.transformMouse(e.e.offsetX,e.e.offsetY);if(this.mouseTo.x=t.x,this.mouseTo.y=t.y,(this.drawType!="text"||this.drawType!="polygon")&&this.drawing(e),this.drawType=="polygon"){if(this.activeLine&&this.activeLine.class=="line"){var l=this.canvas.getPointer(e.e);this.activeLine.set({x2:l.x,y2:l.y});const c=this.activeShape.get("points");c[this.pointArray.length]={x:l.x,y:l.y,zIndex:1},this.activeShape.set({points:c}),this.canvas.renderAll()}this.canvas.renderAll()}}},deleteObj(){this.historyList.push({type:"deleteObjs",data:this.canvas.getActiveObjects()}),this.canvas.getActiveObjects().map(e=>{this.canvas.remove(e)})},transformMouse(e,t){return{x:e/1,y:t/1}},drawPolygon(){this.drawType="polygon",this.polygonMode=!0,this.pointArray=new Array,this.lineArray=new Array,this.canvas.isDrawingMode=!1},addPoint(e){var t=Math.floor(Math.random()*1e4),l=new Date().getTime()+t,c=new b.fabric.Circle({radius:5,fill:"#ffffff",stroke:"#333333",strokeWidth:.5,left:(e.pointer.x||e.e.layerX)/this.canvas.getZoom(),top:(e.pointer.y||e.e.layerY)/this.canvas.getZoom(),selectable:!1,hasBorders:!1,hasControls:!1,originX:"center",originY:"center",id:l,objectCaching:!1});this.pointArray.length==0&&c.set({fill:"red"});const o=[(e.pointer.x||e.e.layerX)/this.canvas.getZoom(),(e.pointer.y||e.e.layerY)/this.canvas.getZoom(),(e.pointer.x||e.e.layerX)/this.canvas.getZoom(),(e.pointer.y||e.e.layerY)/this.canvas.getZoom()];if(this.line=new b.fabric.Line(o,{strokeWidth:2,fill:"#999999",stroke:"#999999",class:"line",originX:"center",originY:"center",selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1}),this.activeShape){var i=this.canvas.getPointer(e.e);const u=this.activeShape.get("points");u.push({x:i.x,y:i.y});const f=new b.fabric.Polygon(u,{stroke:"#333333",strokeWidth:1,fill:"#cccccc",opacity:.3,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});this.canvas.remove(this.activeShape),this.canvas.add(f),this.activeShape=f,this.canvas.renderAll()}else{var h=[{x:(e.pointer.x||e.e.layerX)/this.canvas.getZoom(),y:(e.pointer.y||e.e.layerY)/this.canvas.getZoom()}];const u=new b.fabric.Polygon(h,{stroke:"#333333",strokeWidth:1,fill:"#cccccc",opacity:.3,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1});this.activeShape=u,this.canvas.add(u)}this.activeLine=this.line,this.pointArray.push(c),this.lineArray.push(this.line),this.canvas.add(this.line),this.canvas.add(c)},generatePolygon(){const e=new Array;this.pointArray.map(l=>{e.push({x:l.left,y:l.top}),this.canvas.remove(l)}),this.lineArray.map(l=>{this.canvas.remove(l)}),this.canvas.remove(this.activeShape).remove(this.activeLine);const t=new b.fabric.Polygon(e,{stroke:this.selectColor,strokeWidth:this.drawWidth,fill:"rgba(255, 255, 255, 0)",opacity:1,hasBorders:!0,hasControls:!1});this.canvas.add(t),this.historyList.push({type:this.drawType,data:[t]}),this.historyFallback=[],this.activeLine=null,this.activeShape=null,this.polygonMode=!1,this.doDrawing=!1,this.drawType=null},drawing(e){const t=this.selectColor;this.drawingObject&&this.canvas.remove(this.drawingObject);let l=null;const[c,o,i,h]=[this.mouseFrom.x,this.mouseFrom.y,this.mouseFrom,this.mouseTo],[u,f,m,x]=[i.x,h.x,i.y,h.y];let L,M,I,y,p;switch(this.drawType){case"arrow":L=f-u,M=x-m,I=Math.sqrt(Math.pow(L,2)+Math.pow(M,2));var D=Math.cos(30*Math.PI/180)*(I/6),F=M/I,A=L/I,a=I*5/6*Math.tan(2*Math.PI/180),v=a*F,w=a*A,P=D*A,X=D*F;p=" M "+u+" "+m,p+=" L "+(f-P+v)+" "+(x-X-w),p+=" L "+(f-P+v*2)+" "+(x-X-w*2),p+=" L "+f+" "+x,p+=" L "+(f-P-v*2)+" "+(x-X+w*2),p+=" L "+(f-P-v)+" "+(x-X+w),p+=" Z",console.log(p),l=new b.fabric.Path(p,{stroke:t,fill:t,strokeWidth:this.drawWidth});break;case"pentagram":y=Math.sqrt(L*L+M*M);var O=Math.cos(18*Math.PI/180),Y=Math.sin(18*Math.PI/180),E=[u,m+y],z=[u+2*y*Y,m+y-2*y*O],R=[u-y*O,m+y*Y],V=[u+y*O,m+y*Y],W=[u-2*y*Y,m+y-2*y*O];p=" M "+E[0]+" "+E[1],p+=" L "+z[0]+" "+z[1],p+=" L "+R[0]+" "+R[1],p+=" L "+V[0]+" "+V[1],p+=" L "+W[0]+" "+W[1],p+=" Z",l=new b.fabric.Path(p,{stroke:t,fill:t,strokeWidth:this.drawWidth});break;case"ellipse":e.e.shiftKey&&(h.x-c>h.y-o?h.y=o+h.x-c:h.x=c+h.y-o),l=new b.fabric.Ellipse({left:(h.x-c)/2+c,top:(h.y-o)/2+o,stroke:t,fill:"rgba(255, 255, 255, 0)",originX:"center",originY:"center",rx:Math.abs(c-h.x)/2,ry:Math.abs(o-h.y)/2,strokeWidth:this.drawWidth});break;case"rectangle":e.e.shiftKey&&(h.x-c>h.y-o?h.y=o+h.x-c:h.x=c+h.y-o),p="M "+i.x+" "+i.y+" L "+h.x+" "+i.y+" L "+h.x+" "+h.y+" L "+i.x+" "+h.y+" L "+i.x+" "+i.y+" Z",l=new b.fabric.Path(p,{stroke:t,strokeWidth:this.drawWidth,fill:"rgba(255, 255, 255, 0)",hasControls:!1});break;case"text":this.textbox=new b.fabric.Textbox("",{left:i.x,top:i.y-10,fontSize:16,borderColor:t,fill:t,hasControls:!1}),this.canvas.add(this.textbox),this.textbox.enterEditing(),this.textbox.hiddenTextarea.focus(),this.historyList.push({type:this.drawType,data:[this.textbox]}),this.historyFallback=[];break}l&&(this.canvas.add(l),this.drawingObject=l)},colorSelect(e){this.selectColor=e,this.canvas.freeDrawingBrush.color=e},addDomain(){dynamicValidateForm.domains.push({key:Date.now(),value:""})}}},d=e=>(K("data-v-b24e9284"),e=e(),q(),e),le={class:"panel-body"},ne={class:"container-left"},re=d(()=>s("div",{style:{position:"absolute",display:"none"}},[s("video",{id:"player-container-id",width:"500",preload:"auto",playsinline:"","webkit-playsinline":""})],-1)),ce={style:{position:"absolute",top:"0"}},he=["width","height"],de={class:"slider__runway"},pe={style:{position:"absolute",width:"100%","z-index":"100",top:"0"}},ue={class:"time-choose"},me={class:"indicatorGuide"},fe={key:0},ge={key:1},ye=["onClick","onMouseenter"],ve=["onMouseenter"],we=["onClick","onMouseenter"],ke={class:"esc-tip"},be={class:"play-box"},Te={class:"play-box-left"},_e=d(()=>s("i",{class:"play-icon icon-prev"},null,-1)),Qe=[_e],Ce=d(()=>s("i",{class:"play-icon icon-next"},null,-1)),xe=[Ce],Le={class:"time-format-box"},Me={class:"el-dropdown-link"},Ie={key:0},De={key:1},Fe={key:2},Ae=C("\u6807\u51C6"),Pe=C("\u5E27"),Xe=C("\u65F6\u95F4\u7801"),Oe={class:"play-box-right"},Ye={class:"el-dropdown-link"},je=C("2.0"),Se=C("1.5"),Ee=C("1.25"),ze=C("1.0"),Re=C("0.75"),Ve=C("0.5"),We=C("0.25"),Je={class:"setting-content"},Be=d(()=>s("i",{class:"setting-icon icon-loop"},null,-1)),Ze=d(()=>s("span",{class:"setting-title"},"\u5FAA\u73AF\u64AD\u653E",-1)),Ue=d(()=>s("i",{class:"setting-icon icon-rotate"},null,-1)),Ne=d(()=>s("span",{class:"setting-title"},"\u65CB\u8F6C\u753B\u9762",-1)),He=[Ue,Ne],Ke=d(()=>s("i",{class:"setting-icon icon-keyboard"},null,-1)),qe=d(()=>s("span",{class:"setting-title"},"\u952E\u76D8\u5FEB\u6377\u952E",-1)),Ge=[Ke,qe],$e=d(()=>s("div",null,[s("i",{class:"play-icon icon-setting"})],-1)),e0=d(()=>s("i",{class:"play-icon icon-full"},null,-1)),t0=[e0],s0={class:"annota-group"},i0={class:"draw-btn-group"},o0=d(()=>s("i",{class:"draw-icon icon-mouse"},null,-1)),a0=[o0],l0=d(()=>s("i",{class:"draw-icon icon-7"},null,-1)),n0=[l0],r0=d(()=>s("i",{class:"draw-icon icon-3"},null,-1)),c0=[r0],h0=d(()=>s("i",{class:"draw-icon icon-4"},null,-1)),d0=[h0],p0=d(()=>s("i",{class:"draw-icon icon-1"},null,-1)),u0=[p0],m0=d(()=>s("i",{class:"draw-icon icon-2"},null,-1)),f0=[m0],g0={class:"shader-wrapper"},y0=d(()=>s("div",{class:"shader-ball",style:{background:"rgb(241, 62, 73)"}},null,-1)),v0=d(()=>s("div",{class:"shader-ball",style:{background:"rgb(255, 157, 60)"}},null,-1)),w0=d(()=>s("div",{class:"shader-ball",style:{background:"rgb(0, 187, 108)"}},null,-1)),k0=d(()=>s("div",{class:"shader-ball",style:{background:"rgb(52, 104, 254)"}},null,-1)),b0=d(()=>s("i",{class:"draw-icon icon-8"},null,-1)),T0=[b0],_0=d(()=>s("i",{class:"draw-icon icon-9"},null,-1)),Q0=[_0],C0=d(()=>s("i",{class:"draw-icon icon-10"},null,-1)),x0=[C0],L0={class:"annota-cont"},M0={class:"container-right"},I0=d(()=>s("p",null,"dskdksdds",-1)),D0=d(()=>s("p",null,"dskdksdds",-1)),F0=d(()=>s("img",{src:$,alt:""},null,-1)),A0=d(()=>s("img",{style:{width:"500px",height:"300px"},src:"https://xinyue-public-new.oss-cn-hangzhou.aliyuncs.com/web_static_resources/keyboard-win.png",alt:"\u5FEB\u6377\u952E"},null,-1)),P0=d(()=>s("p",null,"dskdksdds",-1)),X0=d(()=>s("p",null,"dskdksdds",-1));function O0(e,t,l,c,o,i){const h=k("el-slider"),u=k("el-popover"),f=k("el-tooltip"),m=k("el-dropdown-item"),x=k("el-dropdown-menu"),L=k("el-dropdown"),M=k("el-switch"),I=k("FileRemark"),y=k("el-scrollbar"),p=k("el-tab-pane"),D=k("FileInfo"),F=k("el-tabs"),A=k("el-dialog");return _(),Q("div",le,[s("div",ne,[s("div",{id:"xgplayer",class:"video-box",style:j({width:o.width+"px",height:o.height+"px"})},[re,s("div",ce,[s("canvas",{id:"canvas",width:o.width,height:o.height},null,8,he)])],4),s("div",de,[s("div",pe,[n(h,{modelValue:o.onPlayPercent,"onUpdate:modelValue":t[0]||(t[0]=a=>o.onPlayPercent=a),onChange:i.playPerChange},null,8,["modelValue","onChange"])])]),s("div",ue,[s("div",me,[S(n(h,{modelValue:o.chooseTime,"onUpdate:modelValue":t[1]||(t[1]=a=>o.chooseTime=a),range:"",onChange:i.chooseTimeChange,max:o.playerDuration},null,8,["modelValue","onChange","max"]),[[J,o.showChooseTime]])]),s("div",{class:"time-tag-content",style:j({"pointer-events":o.showChooseTime?"none":"auto"})},[(_(!0),Q(U,null,N(o.tagList,(a,v)=>(_(),Q("div",{key:v},[n(u,{placement:"top",width:200,trigger:"hover"},{default:r(()=>[s("p",null,"\u7528\u6237\u540D "+T(i.computedTime(a.sendTime)),1),a.currTimeType=="1"?(_(),Q("p",fe,T(i.secondToDate(a.currTime[0]))+" - "+T(i.secondToDate(a.currTime[1])),1)):(_(),Q("p",ge,T(i.secondToDate(a.currTime)),1)),s("p",null,T(a.remark),1)]),reference:r(()=>[a.currTimeType=="1"?(_(),Q("div",{key:0,class:g(["time-tag-sect",{activeTagSect:o.isActiveTag===v||o.isMouseTag===v}]),style:j({"margin-left":a.currTime[0]/o.playerDuration*100+"%",width:(a.currTime[1]-a.currTime[0])/o.playerDuration*100+"%"})},[s("span",{class:"time-tag-left",onClick:B(w=>i.clickItem(a,v),["prevent"]),style:{"z-index":"110"},onMouseenter:w=>i.lineMouseover(v),onMouseleave:t[2]||(t[2]=(...w)=>i.lineMouseleave&&i.lineMouseleave(...w))},"\u8D75",40,ye),s("span",{class:"time-tag-line",onMouseenter:w=>i.lineMouseover(v),onMouseleave:t[3]||(t[3]=(...w)=>i.lineMouseleave&&i.lineMouseleave(...w))},null,40,ve)],6)):(_(),Q("div",{key:1,class:g(["time-tag-sect",{activeTagSect:o.isActiveTag===v||o.isMouseTag===v}]),style:j({"margin-left":a.currTime/o.playerDuration*100+"%"})},[s("span",{class:"time-tag-left",onClick:B(w=>i.clickItem(a,v),["prevent"]),style:{"z-index":"110"},onMouseenter:w=>i.lineMouseover(v),onMouseleave:t[4]||(t[4]=(...w)=>i.lineMouseleave&&i.lineMouseleave(...w))},"\u94B1",40,we)],6))]),_:2},1024)]))),128))],4),S(s("div",ke,[s("span",{onClick:t[5]||(t[5]=(...a)=>i.upEscape&&i.upEscape(...a))},"\u53D6\u6D88\u6279\u6CE8 Esc")],512),[[J,o.showChooseTime]])]),s("div",be,[s("div",Te,[n(f,{class:"box-item",effect:"light",content:o.isPlay?"\u6682\u505C":"\u64AD\u653E",placement:"top"},{default:r(()=>[s("div",{onClick:t[6]||(t[6]=(...a)=>i.playPause&&i.playPause(...a))},[s("i",{class:g(["play-icon",o.isPlay?"icon-pause":"icon-play"])},null,2)])]),_:1},8,["content"]),n(f,{class:"box-item",effect:"light",content:"\u540E\u90003\u79D2",placement:"top"},{default:r(()=>[s("div",{onClick:t[7]||(t[7]=a=>i.currentTime(-3))},"-3s")]),_:1}),n(f,{class:"box-item",effect:"light",content:"\u4E0A\u4E00\u5E27",placement:"top"},{default:r(()=>[s("div",{onClick:t[8]||(t[8]=a=>i.currentZhen(0))},Qe)]),_:1}),n(f,{class:"box-item",effect:"light",content:"\u4E0B\u4E00\u5E27",placement:"top"},{default:r(()=>[s("div",{onClick:t[9]||(t[9]=a=>i.currentZhen(1))},xe)]),_:1}),n(f,{class:"box-item",effect:"light",content:"\u524D\u8FDB3\u79D2",placement:"top"},{default:r(()=>[s("div",{onClick:t[10]||(t[10]=a=>i.currentTime(3))},"+3s")]),_:1})]),s("div",Le,[n(L,{placement:"top",onCommand:i.timeFormatChange},{dropdown:r(()=>[n(x,null,{default:r(()=>[n(m,{command:"b"},{default:r(()=>[Ae]),_:1}),n(m,{command:"z"},{default:r(()=>[Pe]),_:1}),n(m,{command:"s"},{default:r(()=>[Xe]),_:1})]),_:1})]),default:r(()=>[s("span",Me,[o.timeFormat==="z"?(_(),Q("span",Ie,T(i.secondToDate(o.player?o.player.currentTime:""))+"/"+T(i.secondToDate(o.player?o.player.duration:"")),1)):o.timeFormat==="s"?(_(),Q("span",De,T(i.secondToDate(o.player?o.player.currentTime:""))+"/"+T(i.secondToDate(o.player?o.player.duration:"")),1)):(_(),Q("span",Fe,T(i.secondToDate(o.onPlayTime))+"/"+T(i.secondToDate(o.playerDuration)),1))])]),_:1},8,["onCommand"])]),s("div",Oe,[n(L,{placement:"top",onCommand:i.playbackRateChange,trigger:"click"},{dropdown:r(()=>[n(x,null,{default:r(()=>[n(m,{command:"2.0"},{default:r(()=>[je]),_:1}),n(m,{command:"1.5"},{default:r(()=>[Se]),_:1}),n(m,{command:"1.25"},{default:r(()=>[Ee]),_:1}),n(m,{command:"1.0"},{default:r(()=>[ze]),_:1}),n(m,{command:"0.75"},{default:r(()=>[Re]),_:1}),n(m,{command:"0.5"},{default:r(()=>[Ve]),_:1}),n(m,{command:"0.25"},{default:r(()=>[We]),_:1})]),_:1})]),default:r(()=>[s("span",Ye," \u500D\u901F "+T(o.playbackRate),1)]),_:1},8,["onCommand"]),n(u,{placement:"top",width:156,teleported:!1,trigger:"hover"},{reference:r(()=>[$e]),default:r(()=>[s("div",Je,[s("div",null,[Be,Ze,n(M,{modelValue:o.isLoop,"onUpdate:modelValue":t[11]||(t[11]=a=>o.isLoop=a),size:"small",onChange:i.loopChange},null,8,["modelValue","onChange"])]),s("div",{onClick:t[12]||(t[12]=(...a)=>i.rotatePlayer&&i.rotatePlayer(...a))},He),s("div",{onClick:t[13]||(t[13]=(...a)=>i.showKeyboard&&i.showKeyboard(...a))},Ge)])]),_:1}),n(f,{class:"box-item",effect:"light",content:"\u5168\u5C4F",placement:"top"},{default:r(()=>[s("div",{onClick:t[14]||(t[14]=(...a)=>i.fullScreenFun&&i.fullScreenFun(...a))},t0)]),_:1})])]),s("div",s0,[s("div",i0,[s("div",{class:g({active:o.drawType==""}),title:"\u81EA\u7531\u9009\u62E9",onClick:t[15]||(t[15]=a=>i.drawTypeChange(""))},a0,2),s("div",{class:g({active:o.drawType=="pen"}),title:"\u7B14\u753B",onClick:t[16]||(t[16]=a=>i.drawTypeChange("pen"))},n0,2),s("div",{class:g({active:o.drawType=="ellipse"}),title:"\u753B\u5706",onClick:t[17]||(t[17]=a=>i.drawTypeChange("ellipse"))},c0,2),s("div",{class:g({active:o.drawType=="rectangle"}),title:"\u753B\u77E9\u5F62",onClick:t[18]||(t[18]=a=>i.drawTypeChange("rectangle"))},d0,2),s("div",{class:g({active:o.drawType=="arrow"}),title:"\u753B\u7BAD\u5934",onClick:t[19]||(t[19]=a=>i.drawTypeChange("arrow"))},u0,2),s("div",{class:g({active:o.drawType=="text"}),title:"\u6587\u672C\u8F93\u5165\u6846",onClick:t[20]||(t[20]=a=>i.drawTypeChange("text"))},f0,2),s("div",g0,[s("div",{class:"shader-ball-wrapper pointer",onClick:t[21]||(t[21]=a=>i.colorSelect("#f13e49"))},[s("div",{class:g(["shader-ani",{ballActive:o.selectColor==="#f13e49"}]),style:{background:"#f13e49"}},null,2),y0]),s("div",{class:"shader-ball-wrapper pointer",onClick:t[22]||(t[22]=a=>i.colorSelect("#ff9d3c"))},[s("div",{class:g(["shader-ani",{ballActive:o.selectColor==="#ff9d3c"}]),style:{background:"#ff9d3c"}},null,2),v0]),s("div",{class:"shader-ball-wrapper pointer",onClick:t[23]||(t[23]=a=>i.colorSelect("#00bb6c"))},[s("div",{class:g(["shader-ani",{ballActive:o.selectColor==="#00bb6c"}]),style:{background:"#00bb6c"}},null,2),w0]),s("div",{class:"shader-ball-wrapper pointer",onClick:t[24]||(t[24]=a=>i.colorSelect("#3468fe"))},[s("div",{class:g(["shader-ani",{ballActive:o.selectColor==="#3468fe"}]),style:{background:"#3468fe"}},null,2),k0])]),s("div",{class:g({active:o.drawType=="fallback"}),title:"\u56DE\u9000\u4E00\u6B65",onClick:t[25]||(t[25]=a=>i.drawTypeChange("fallback"))},T0,2),s("div",{class:g({active:o.drawType=="forward"}),title:"\u524D\u8FDB\u4E00\u6B65",onClick:t[26]||(t[26]=a=>i.drawTypeChange("forward"))},Q0,2),s("div",{class:g({active:o.drawType=="clear"}),title:"\u5168\u90E8\u6E05\u9664",onClick:t[27]||(t[27]=a=>i.drawTypeChange("clear"))},x0,2),s("div",null,[s("button",{onClick:t[28]||(t[28]=(...a)=>i.sendTag&&i.sendTag(...a))},"\u53D1\u9001")])]),s("div",L0,[S(s("textarea",{onClick:t[29]||(t[29]=(...a)=>i.textClick&&i.textClick(...a)),onBlue:t[30]||(t[30]=(...a)=>i.texBlue&&i.texBlue(...a)),class:"annota-input",placeholder:"\u8F93\u5165\u6279\u6CE8...","onUpdate:modelValue":t[31]||(t[31]=a=>o.textarea=a)},`
          `,544),[[H,o.textarea]])])])]),s("div",M0,[n(F,{class:"top-tabs",modelValue:o.activeRightTab,"onUpdate:modelValue":t[32]||(t[32]=a=>o.activeRightTab=a)},{default:r(()=>[n(p,{class:"file-remark-tabs",label:"\u5BA1\u9605\u610F\u89C1",name:"opinion"},{default:r(()=>[n(y,{class:"tag-scroll",height:o.clientHeight-110},{default:r(()=>[n(I,{remarkList:o.tagList,onClickItem:i.clickItem,isActiveTag:o.isActiveTag},null,8,["remarkList","onClickItem","isActiveTag"])]),_:1},8,["height"])]),_:1}),n(p,{class:"file-info-tabs",label:"\u6587\u4EF6\u4FE1\u606F",name:"fileinfo"},{default:r(()=>[n(y,{class:"tag-scroll",height:o.clientHeight-110},{default:r(()=>[n(D)]),_:1},8,["height"])]),_:1})]),_:1},8,["modelValue"])]),n(A,{modelValue:o.dialogKeyboard,"onUpdate:modelValue":t[33]||(t[33]=a=>o.dialogKeyboard=a),title:"\u952E\u76D8\u5FEB\u6377\u952E",width:"60%",center:"",top:"40%"},{default:r(()=>[I0,D0,F0,A0,P0,X0]),_:1},8,["modelValue"])])}var W0=oe(ae,[["render",O0],["__scopeId","data-v-b24e9284"]]);export{W0 as default};
