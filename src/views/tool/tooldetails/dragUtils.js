export function scale (name,btn, bar,step,ondrag,mouseup) {
    if (step){
        step.style.backgroundPosition=0;
    }
    if (!btn||!bar){
        return;
    }
    let init = function () {
        let  g = document, b = window, m = Math;
        btn.onmousedown = function (e) {
            let x = (e || b.event).clientX;
            let l = btn.offsetLeft;
            let max = bar.offsetWidth - btn.offsetWidth;
            g.onmousemove = function (e) {
                let thisX = (e || b.event).clientX;
                let to = m.min(max, m.max(0, l + (thisX - x)));
                btn.style.left = to + 'px';
                ondrag(m.max(0, to / max), to,step,bar.offsetWidth,name);
                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
            };
            g.onmouseup = function () {
                g.onmousemove=null;
                mouseup(name);
                g.onmouseup=null;
            };
        };
    };
    init();
}


export function scaleMore(name,btn, bar,step,wof,offset,ondrag,mouseup) {
    if (step){
        step.style.backgroundPosition=0;
    }

    if (!btn||!bar){
        return;
    }
    let init = function () {
        let  g = document, b = window, m = Math;
        btn.onmousedown = function (e) {
            let x = (e || b.event).clientX+wof.offsetWidth+offset;
            let l = btn.offsetLeft;
            let max = bar.offsetWidth - btn.offsetWidth;
            g.onmousemove = function (e) {
                let thisX = (e || b.event).clientX;
                let to = m.min(max, m.max(0, l + (thisX - x)));
                btn.style.left = to + 'px';
                ondrag(m.max(0, to / max), to,step,bar.offsetWidth,name);
                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
            };
            g.onmouseup = function () {
                g.onmousemove=null;
                mouseup(name);
                g.onmouseup=null;
            };
        };
    };
    init();
}


