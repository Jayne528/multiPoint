
window.onload = function() {

    //環境變數
    var updateFPS = 30;
    var showMouse = true;
    var time = 0;
    var bgcolor = "black";

    //控制
    var controls = {
        value : 0,
        angle:0,
        length:200,
        count:3,
        showSubPlanet: false,
    }

    var gui = new dat.GUI();
    gui.add(controls, "value", -2, 2).step(0.01).onChange(function(value) {

    });
    gui.add(controls, "angle", 0, 360).step(0.01).onChange(function(value) {

    });
    gui.add(controls, "length", 0, 250).step(0.01).onChange(function(value) {

    });
    gui.add(controls, "count", 1, 200).step(1).onChange(function(value) {

    });
    gui.add(controls, "showSubPlanet");

    //--------------vec2 向量------------------

    class Vec2 {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }

        set(x, y) {
            this.x = x;
            this.y = y;
        }
        
        move(x, y) {
            this.x += x;
            this.y += y;
        }

        add(v) {
            return new Vec2(this.x + v.x, this.y + v.y)
        }
        sub(v) {
            return new Vec2(this.x - v.x, this.y - v.y)
        }
        mul(s) {
            return new Vec2(this.x*s, this.y*s)
        }

        //新的向量長度
        set length(nv) {
            var temp = this.unit.mul(nv); //this.unit.mul(nv) 是1
            this.set(temp.x, this.y);
        }

        get length() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }

        clone() {
            return new Vec2(this.x, this.y);
        }
        //轉成字串
        toString() {
            // return "("+this.x+","+this.y+")";
            return `(${this.x}, ${this.y})`;
        }
        //比較
        equal(){
            return this.x == v.x && this.y == v.y;
        }

        get angle() {
            return Math.atan2(this.y, this.x);
        }

        get unit() {
            return this.mul(1/this.length);
        }


    }
//------------------------------------------------------------
    var canvas = document.getElementById("canvas");
    var cx = canvas.getContext("2d");
   
    //設定畫圓
    cx.circle = function(v, r) {
        this.arc(v.x, v.y, r, 0, Math.PI*2);
    }
    //設定畫線
    cx.line = function (v1, v2) {
        this.moveTo(v1.x, v1.y);
        this.lineTo(v2.x, v2.y);

    }

    // canvas的設定
    function initCanvas() {
 
        ww = canvas.width = window.innerWidth;
        wh = canvas.height =window.innerHeight;
    }
    initCanvas();


    //邏輯的初始化
    function init() {

    }

    //遊戲邏輯的更新
    function update() {

        time++;
    }

    //畫面更新
    function draw() {

        //清空背景
        cx.fillStyle = bgcolor;
        cx.fillRect(0, 0, ww, wh);

        //----在這繪製--------------------------------

        var degToPi = Math.PI/180;
        
        cx.beginPath();
        cx.moveTo(ww/2, 0);
        cx.lineTo(ww/2, wh);
        cx.moveTo(0, wh/2);
        cx.lineTo(ww,wh/2);
        cx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        cx.stroke();

        cx.save();
        cx.translate(ww/2, wh/2);
            var points = [];
            var angleSpan = Math.PI*2 / controls.count;
            for (var i = 0; i<controls.count; i++) {
                var angle = controls.angle * degToPi + i*angleSpan;
                var r = controls.length;

                points.push({angle: angle, r: r});
            }
            points.forEach(function(p, pid) {
                cx.beginPath();
                
                var x = p.r*Math.cos(p.angle);
                var y = p.r*Math.sin(p.angle);
                cx.arc(x, y, 5, 0, Math.PI*2);
                cx.fillStyle = "white";
                cx.fill();

                cx.beginPath();
                cx.moveTo(0, 0);
                cx.lineTo(x, y);
                cx.stroke();

                //畫小圈圈
                if(controls.showSubPlanet){
                    var  s = {r: 50 , angle: pid*10 + time/20};
                    cx.beginPath();
                    var sx = s.r*Math.cos(s.angle);
                    var sy = s.r*Math.sin(s.angle);
                    cx.arc(sx + x, sy + y, 3, 0, Math.PI*2);
                    cx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    cx.fill();

                    cx.beginPath();
                    cx.moveTo(x, y);
                    cx.lineTo(x + sx, y + sy);
                    cx.stroke();
                }
            })

            function toPoint(r, angle) {
                return new Vec2(r*Math.cos(angle), r*Math.sin(angle));
            }

            //所有點連線
            cx.beginPath();
            cx.strokeStyle = "white";
            cx.lineWidth = 2;
            points.forEach(function(p){
                var pxy = toPoint(p.r, p.angle);
                cx.lineTo(pxy.x, pxy.y);
            })
            cx.closePath();
            cx.stroke();


        cx.restore();







        //----------------------------------------

        //滑鼠
        cx.fillStyle = "red";
        cx.beginPath();
        cx.circle(mousePos,3);
        cx.fill();

        //滑鼠線
        cx.save();
            cx.beginPath();
            cx.translate(mousePos.x, mousePos.y);
              
                cx.strokeStyle = "red";
                var len = 20;
                cx.line(new Vec2(-len, 0), new Vec2(len, 0));

                cx.fillText (mousePos, 10, -10);
                cx.rotate(Math.PI/2);
                cx.line(new Vec2(-len, 0), new Vec2(len, 0));
                cx.stroke();

        cx.restore();




        requestAnimationFrame(draw)
    }

    //頁面載完依序呼叫
    function loaded() {

        initCanvas();
        init();
        requestAnimationFrame(draw);
        setInterval(update, 1000/updateFPS);
    }

    // window.addEventListener('load', loaded);
    //頁面縮放
    window.addEventListener('resize', initCanvas);


    //滑鼠 事件更新
    var mousePos = new Vec2(0, 0);
    var mousePosDown = new Vec2(0, 0);
    var mousePosUP = new Vec2(0, 0);

    window.addEventListener("mousemove",mousemove);
    window.addEventListener("mouseup",mouseup);
    window.addEventListener("mousedown",mousedown);

    function mousemove(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        

    }
    function mouseup(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosUP = mousePos.clone();
        
    }
    function mousedown(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosDown = mousePos.clone();
    }

    loaded();
}
