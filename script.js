const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

let isMovable=true;

let level=1, leaf=0;

function Arrow(n){
    if(isMovable)
        Move(current, n);
    if(isWaitSelect)
        switch(n){
            case 1: select=1;break;
            case 2: select=2;break;
            default: break;
        }
}


async function PushA(){
    if(isMovable && mapping[current-1].event.number!=0 && mapping[current-1].event.finish==0){
        isMovable=0;
        let e=mapping[current-1].event
        if(e.number==1){
            await Battle(e.monster, current);
        }else if(e.number==2){
            HP=playerStatus.HP;
            logWindow();
            btx.fillText(`妖精たちが`, 250, 395);
            btx.fillText(`HPを回復してくれた`, 250, 430);
            waitA=1;
            while(waitA==1)await sleep(50);
            btx.clearRect(0,0,960,540);
            mapping[current-1].event.finish=1;
            Reload(current);
            ctx.drawImage(player, 432, 222);
        }else if(e.number==3){
            leaf++;
            logWindow();
            btx.fillText(`やくそうをてにいれた`, 250, 395);
            waitA=1;
            while(waitA==1)await sleep(50);
            btx.clearRect(0,0,960,540);
            mapping[current-1].event.finish=1;
            Reload(current);
            ctx.drawImage(player, 432, 222);
        }
        isMovable=1;
    }else if(waitA==1){
        waitA=0;
    }
}

const status_Lv={BHP: 162, Batk:25, Bdef: 25, HP: 38, atk:25, def: 25};
let playerStatus={HP: 20, atk: 5, def: 5};
let HP=20;

let monsterList=[
    {id:"slime", name: "スライム", status:{BHP: 60, Batk:10, Bdef: 5, HP: 16, atk:5, def: 15}},
    {id:"otofu", name: "おとうふ", status:{BHP: 120, Batk:5, Bdef: 10, HP: 25, atk:7, def: 4}},
    {id:"firstpenguin", name: "ファーストペンギン", status:{BHP: 60, Batk:12, Bdef: 12, HP: 17, atk:10, def: 20}},
    {id:"pentapod", name: "ペンタポット", status:{BHP: 120, Batk:12, Bdef: 30, HP: 20, atk:8, def: 35}},
    {id:"sirocodile", name: "シロコダイル", status:{BHP: 90, Batk:18, Bdef: 25, HP: 18, atk:15, def: 20}},
    {id:"breadbullet", name: "ブレッドバレット", status:{BHP: 70, Batk:30, Bdef: 16, HP: 13, atk:25, def: 12}},
    {id:"akuma", name: "あくま", status:{BHP: 100, Batk:35, Bdef: 25, HP: 20, atk:16, def: 25}},
    {id:"dragon", name: "ドラゴン", status:{BHP: 200, Batk:40, Bdef: 30, HP: 30, atk:25, def: 30}},
];

let select=1;
let isWaitSelect=0;
let waitA=0;

async function Battle(n, lv){
    ctx.fillStyle='rgba(0,0,0,0.1)';
    let monster=monsterList[n];
    select=1;
    let monsterStatus={
        HP: Math.floor((monster.status.BHP + monster.status.HP*lv)/10),
        atk: Math.floor((monster.status.Batk + monster.status.atk*lv)/10),
        def: Math.floor((monster.status.Bdef + monster.status.def*lv)/10)
    }
    for(let i=0; i<10; i++){
        ctx.fillRect(210, 0, 540, 540);
        await sleep(80)
    }
    monsterimg.onload=()=>btx.drawImage(monsterimg, 300, 0);
    monsterimg.src=`./image/monster_battle/${monster.id}.png`

    btx.lineWidth=5;
    while(1){
        btx.clearRect(0,0,960,540);
        btx.drawImage(monsterimg, 300, 0);
        waitA=1;
        isWaitSelect=1;
        btx.fillStyle='rgb(236, 236, 236)';
        btx.fillRect(245, 390, 180, 120);
        btx.fillRect(535, 390, 180, 120);
        btx.textBaseline='middle';
        btx.textAlign='center';
        btx.font= "36px serif";
        btx.fillStyle='rgb(0, 0, 0)';
        btx.fillText("たたかう",335, 450)
        btx.fillText("やくそう",625, 450)
        while(waitA==1){
            btx.strokeStyle='rgb(0, 0, 0)';
            btx.strokeRect(245, 390, 180, 120);
            btx.strokeRect(535, 390, 180, 120);
            btx.strokeStyle='rgb(255, 255, 0)';
            switch(select){
                case 1: btx.strokeRect(245, 390, 180, 120);break;
                case 2: btx.strokeRect(535, 390, 180, 120);break;
            }
            await sleep(50)
        }
        let damage;
        if(select==1){
            console.log(playerStatus.atk)
            console.log(monsterStatus.def)
            damage=Math.floor(playerStatus.atk*300/(300+monsterStatus.def)*(0.3*Math.random()+0.8));
            monsterStatus.HP-=damage;
            logWindow();
            btx.fillText(`${monster.name}に`, 250, 395);
            btx.fillText(`${damage}ダメージ！`, 250, 430);
            waitA=1;
            while(waitA==1)await sleep(50);
            if(monsterStatus.HP<=0){
                mapping[current-1].isStop=0;
                mapping[current-1].event.finish=1;
                btx.clearRect(0,0,960,540);
                logWindow();
                btx.fillText(`${monster.name}を`, 250, 395);
                btx.fillText(`たおした！`, 250, 430);
                Reload(current);
                if(level<lv){
                    level=lv;
                    let hptemp=playerStatus.HP;
                    playerStatus={
                        HP: Math.floor((status_Lv.BHP + status_Lv.HP*level)/10),
                        atk: Math.floor((status_Lv.Batk + status_Lv.atk*level)/10),
                        def: Math.floor((status_Lv.Bdef + status_Lv.def*level)/10)
                    }
                    HP+=playerStatus.HP-hptemp;
                }
                ctx.drawImage(player, 432, 222);
                ctx.fillStyle='rgba(0,0,0,0.6)';
                ctx.fillRect(210, 0, 540, 540);
                waitA=1;
                while(waitA==1)await sleep(50);
                btx.clearRect(0,0,960,540);
                Reload(current);
                ctx.drawImage(player, 432, 222);
                break;
            }
        }
        if(select==2){
            if(leaf<=0){
                logWindow();
                btx.fillText("やくそうがたりない！", 250, 395);
                
                waitA=1;
                while(waitA==1)await sleep(50);
                continue;
            }else{
                let heal=Math.floor((Math.random()/3+ 1/3)*playerStatus.HP);
                HP+=heal;
                leaf--;
                logWindow();
                if(HP>playerStatus.HP){
                    HP=playerStatus.HP
                    btx.fillText('HPがまんたんになった', 250, 395);
                }else
                    btx.fillText(`${heal}かいふくした`, 250, 395);
                waitA=1;
                while(waitA==1)await sleep(50);
            }
        }
        damage=Math.floor(monsterStatus.atk*300/(300+playerStatus.def)*(0.3*Math.random()+0.9));
        HP-=damage;
        logWindow();
        btx.fillText(`${monster.name}の`, 250, 395);
        btx.fillText(`こうげき！`, 250, 430);
        btx.fillText(`${damage}ダメージ！`, 250, 465);
        if(HP<0)HP=0;
        Reload(current);
        ctx.drawImage(player, 432, 222);
        ctx.fillStyle='rgba(0,0,0,0.6)';
        ctx.fillRect(210, 0, 540, 540);
        waitA=1;
        while(waitA==1)await sleep(50);
        if(HP==0){
            logWindow();
            btx.fillText(`まけてしまった！`, 250, 395);
            waitA=1;
            while(waitA==1)await sleep(50);
            logWindow();
            btx.fillText(`ゲームオーバー`, 250, 395);
            btx.fillText(`ページを再読み込みしてね`, 250, 445);
            while(1)await sleep(1000);
        }
    }
}

function logWindow(){
    btx.fillStyle='rgb(236, 236, 236)';
    btx.strokeStyle='rgb(0, 0, 0)';
    btx.fillRect(245, 390, 470, 120);
    btx.strokeRect(245, 390, 470, 120);
    btx.textBaseline='top';
    btx.textAlign='start';
    btx.font= "36px serif";
    btx.fillStyle='rgb(0, 0, 0)';
}

let floor=1;
let mapping=[]

function MakeMap(){
    mapping=[
        {n:1, next:[2, null, null], come:[], event:{number:0}, isStop:0},
    ]

    for(let i=2; i<=98; i++)
        mapping.push({n:i, next:[null, null, null], come:[], event:{number:0}, isStop:0});

    mapping.push({n:99, next:[100, null, null], come:[], event:{number:0}, isStop:0});
    mapping.push({n:100, next:['end', null, null], come:[], event:{number:0}, isStop:0});

    for(let i=2; i<=11; i++){
        let index, location;
        for(let j=0; j<3; j++){
            index=Math.floor(Math.random()*3);
            if(j==0) location=(i-1)-Math.floor(Math.random()*10);
            else if(j==1) location=i+Math.floor(Math.random()*5);

            if(location<=1 || 100<=location || location==i)location=null;

            if(j==2){
                location=i+1;
            }

            mapping[i-1].next[index]=location;
        }
        for(let j=0; j<3; j++)
            if(mapping[i-1].next[j]!=null)mapping[mapping[i-1].next[j]-1].come.push(i);
    }

    for(let i=12; i<=98; i++){
        let index, location;
        for(let j=0; j<3; j++){
            index=Math.floor(Math.random()*3);
            if(j==0) location=(i-1)-Math.floor(Math.random()*50);
            else if(j==1) location=i+Math.floor(Math.random()*25)-10;

            if(location<=1 || 100<=location || location==i)location=null;

            if(j==2){
                location=i+1;
                if(Math.random()<0.5){
                    location=(i+1)+Math.floor(Math.random()*5);
                    if(location<=1 || 100<=location)location=i+1;
                }
            }

            mapping[i-1].next[index]=location;
        }
        for(let j=0; j<3; j++)
            if(mapping[i-1].next[j]!=null)mapping[mapping[i-1].next[j]-1].come.push(i);
    }
}

let tf=1;
while(tf){
    tf=0;
    MakeMap();
    for(let i=2; i<99; i++){
        if(mapping[i].come.length==0)
            tf+=1;
    }
}

mapping[1].event={number:1, monster:0, finish:0};
mapping[1].isStop=1;

for(i=0; i<5; i++){
    while(1){
        let r=Math.floor(Math.random()*18)+2;
        if(mapping[r].event.number==0){
            mapping[r].event={number:1, monster:Math.floor(Math.random()*2), finish:0};
            mapping[r].isStop=1;
            break;
        }
    }
}
for(i=0; i<4; i++){
    while(1){
        let r=Math.floor(Math.random()*20)+20;
        if(mapping[r].event.number==0){
            mapping[r].event={number:1, monster:Math.floor(Math.random()*2)+1, finish:0};
            mapping[r].isStop=1;
            break;
        }
    }
}
for(i=0; i<4; i++){
    while(1){
        let r=Math.floor(Math.random()*20)+40;
        if(mapping[r].event.number==0){
            mapping[r].event={number:1, monster:Math.floor(Math.random()*2)+2, finish:0};
            mapping[r].isStop=1;
            break;
        }
    }
}
for(i=0; i<4; i++){
    while(1){
        let r=Math.floor(Math.random()*20)+60;
        if(mapping[r].event.number==0){
            mapping[r].event={number:1, monster:Math.floor(Math.random()*2)+3, finish:0};
            mapping[r].isStop=1;
            break;
        }
    }
}
for(i=0; i<3; i++){
    while(1){
        let r=Math.floor(Math.random()*17)+80;
        if(mapping[r].event.number==0){
            mapping[r].event={number:1, monster:Math.floor(Math.random()*2)+4, finish:0};
            mapping[r].isStop=1;
            break;
        }
    }
}

while(1){
    let r=Math.floor(Math.random()*20)+30;
    if(mapping[r].event.number==0){
        mapping[r].event={number:2, finish:0};
        break;
    }
}

while(1){
    let r=Math.floor(Math.random()*60)+30;
    if(mapping[r].event.number==0){
        mapping[r].event={number:2, finish:0};
        break;
    }
}

for(i=0; i<5; i++){
    while(1){
        let r=Math.floor(Math.random()*18)+2;
        if(mapping[r].event.number==0){
            mapping[r].event={number:3, finish:0};
            break;
        }
    }
}

for(i=2; i<=97; i++){
    if(mapping[i].event.number==0){
        if(Math.random()*3 >=2){
            mapping[i].event={number:3, finish:0};
        }
    }
}

mapping[98].event={number:2, finish:0};

mapping[99].event={number:1, monster:7, finish:0};
mapping[99].isStop=1;


let current=1;
let back=[];
function Next(n, i){
    let r=mapping[n-1].next[i];
    if(r==null)return n;
    back.push([n,i]);
    n=r;
    Reload(n);
    return n;
}

function Reload(n){
    Display(n);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btx = document.getElementById("battle").getContext("2d");
const mapback = new Image();
mapback.src="./image/map/floor.png"
const rock=new Image();
rock.src="./image/map/rock.png"
const player=new Image();
player.src="./image/player/up.png"
const eventimg=new Image();
const monsterimg=new Image();
function Display(n){
    ctx.clearRect(0, 0, 960, 540)
    ctx.drawImage(mapback, 210, 0);
    if(n==1)ctx.drawImage(rock, 432, 444);
    for(let i=0; i<3; i++){
        if(mapping[n-1].next[i]==null)
            switch(i){
                case 0: ctx.drawImage(rock, 432, 0);break;
                case 1: ctx.drawImage(rock, 210, 222);break;
                case 2: ctx.drawImage(rock, 654, 222);break;
            }
    }
    if(mapping[n-1].event.number!=0 && mapping[n-1].event.finish==0){
        let e = mapping[n-1].event;
        if(e.number==1){
            eventimg.src=`./image/monster_icon/${monsterList[e.monster].id}.png`
        }else if(e.number==2){
            eventimg.src=`./image/event/fairy.png`;
        }
        else if(e.number==3){
            eventimg.src=`./image/event/leaf.png`;
        }
        ctx.drawImage(eventimg, 432, 162)
    }
    ctx.font = "48px serif";
    ctx.textBaseline='alphabetic';
    ctx.textAlign='start';
    ctx.fillStyle='rgba(0,0,0)';
    ctx.fillText(`Room${n}`, 0, 50);
    ctx.font = "36px serif";
    ctx.fillText(`Lv:${level}`, 755, 50);
    ctx.fillText(`HP:${HP}/${playerStatus.HP}`, 755, 100);
    ctx.fillText(`やくそう:${leaf}`, 755, 150);
}

async function Move(n, d){
    let r;
    if(d==3){
        if((r=back.pop())==undefined)return;
    }
    else if(mapping[n-1].next[d]==null||mapping[n-1].isStop)return;

    isMovable=0;
    let dx=0, dy=0;
    switch(d){
        case 0: player.src="./image/player/up.png";dy=-9;break;
        case 1: player.src="./image/player/left.png";dx=-9;break;
        case 2: player.src="./image/player/right.png";dx=9;break;
        case 3: player.src="./image/player/down.png";dy=9;break;
    }
    for(let i=0; i<30; i++){
        Reload(current);
        ctx.drawImage(player, 432+dx*i, 222+dy*i);
        await sleep(10);
    }
    if(mapping[n-1].next[d]=='end')await End();
    switch(d){
        case 3:
                current=r[0];
                dx=0; dy=0;
                switch(r[1]){
                    case 0: player.src="./image/player/down.png";dy-=9;break;
                    case 1: player.src="./image/player/right.png";dx=-9;break;
                    case 2: player.src="./image/player/left.png";dx=9;break;
                }
                for(let i=29; i>=0; i--){
                    Reload(current);
                    ctx.drawImage(player, 432+dx*i, 222+dy*i);
                    await sleep(10);
                }
                player.src="./image/player/up.png";
                ctx.drawImage(player, 432, 222);
                break;
        default: current=Next(n, d);
                player.src="./image/player/up.png"
                for(let i=0; i<30; i++){
                    Reload(current);
                    ctx.drawImage(player, 432, 492-9*i);
                    await sleep(10);
                }
                break;
    }
    isMovable=1;
    console.log(mapping[current-1]);
}

async function End(){
    ctx.fillStyle='rgba(255, 255, 255, 0.2)';
    for(let i=0; i<10; i++){
        ctx.fillRect(210, 0, 540, 540);
        await sleep(80)
    }
    ctx.fillStyle='rgb(255, 255, 255)';
    ctx.fillRect(210, 0, 540, 540);
    btx.textBaseline='middle';
    btx.textAlign='center';
    btx.font= "72px serif";
    btx.fillStyle='rgb(255, 255, 0)';
    btx.strokeStyle='rgb(0, 0, 0)';
    btx.fillText("クリア",460, 200)
    btx.strokeText("クリア",460, 200)
    logWindow();
    await sleep(1000);
    btx.fillText(`ゲームクリアおめでとう！`, 250, 395);
    btx.fillText(`ページを再読み込みしてね`, 250, 445);
    while(1)await sleep(1000);
}

player.onload=()=>{
    Reload(current);
    ctx.drawImage(player, 432, 222);
}
