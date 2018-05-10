var mapObj,pointObj;
var bIsMove=false;
var oldpos=curpos=pos={'x':0,'y':0};
var scaleValue=1.0;
var bIsExist = false;
var brLength=0.0;

function mapImg(mapId,pointId,mapsize){
	bIsExist = true;
	mapObj = document.getElementById(mapId);
	pointObj = document.getElementById(pointId);
	this.borderLength = mapsize?mapsize:'512px';
	mapObj.parentNode.style.width=this.borderLength;
	mapObj.parentNode.style.height=this.borderLength;
	mapObj.parentNode.style.border='2px solid black';
	mapObj.parentNode.style.overflow='hidden';
	mapObj.parentNode.style.position='relative';
	mapObj.parentNode.style.marginTop='5px';

	brLength = transPosition(this.borderLength);

	document.onmousedown = mouseMoveStart;
	document.onmouseup = mouseMoveEnd;
	document.onmousemove = mouseMove;

	this.currentPos = {'x':0,'y':0};

	this.drawPoint = false;

	this.setImg=function(imgname){
		mapObj.style.background = 'url('+imgname+')';
		mapObj.style.backgroundRepeat='no-repeat';
		mapObj.style.backgroundSize=this.borderLength+' '+this.borderLength;
		mapObj.style.width=this.borderLength;
		mapObj.style.height=this.borderLength;
		mapObj.style.cursor='move';
		mapObj.style.position = 'absolute';
	}
	this.drawPos=function(){
		this.drawPoint = true;
		pointObj.style.overflow = 'visible';
		pointObj.style.position = 'absolute';
		pointObj.style.cursor = 'pointer';
		pointObj.style.left = transPosition(this.borderLength)/2 + 'px';
		pointObj.style.top = transPosition(this.borderLength)/2 + 'px';

		pointObj.style.width='8px';
		pointObj.style.height='8px';
		pointObj.style.borderRadius='50%';
		pointObj.style.background='#056FC4';

		if(!pointObj.firstChild){
			var pointrange = document.createElement('span');
			pointrange.style.position = 'absolute';
			pointrange.style.borderRadius='50%';
			pointrange.style.background='#056FC4';
			pointrange.style.opacity='0.3';

			pointrange.style.width='16px';
			pointrange.style.height='16px';
			pointrange.style.left = '-4.5px';
			pointrange.style.top = '-4.5px';

			pointObj.append(pointrange);			
		}

	}

	this.setPos=function(ppos){
		if(this.drawPoint){
			this.currentPos = ppos;
			pointObj.style.left = ppos.x*scaleValue-transPosition(pointObj.style.width)/2 + 'px';
			pointObj.style.top = ppos.y*scaleValue-transPosition(pointObj.style.width)/2 + 'px';			
		}
	}

	this.scaleAdd=function(){
		if(scaleValue>1.99)
			return false;
		var bkSize = bksize(mapObj.style.backgroundSize);
		var bks = {'x':parseFloat(bkSize.x)+brLength*0.25,'y':parseFloat(bkSize.y)+brLength*0.25};
		mapObj.style.backgroundSize = bks.x + 'px ' + bks.y + 'px';
		mapObj.style.width=bks.x+'px';
		mapObj.style.height=bks.y+'px';
		bkSize = bksize(mapObj.style.backgroundSize);

		scaleValue = parseFloat(bkSize.x)/brLength;

		this.setPos(this.currentPos);
		return true;
	}
	this.scaleMinus=function(){
		if(scaleValue<1.01)
			return false;
		var bkSize = bksize(mapObj.style.backgroundSize);
		var bks = {'x':parseFloat(bkSize.x)-brLength*0.25,'y':parseFloat(bkSize.y)-brLength*0.25};
		mapObj.style.backgroundSize = bks.x + 'px ' + bks.y + 'px';
		mapObj.style.width=bks.x+'px';
		mapObj.style.height=bks.y+'px';
		bkSize = bksize(mapObj.style.backgroundSize);

		scaleValue = parseFloat(bkSize.x)/brLength;
		this.setPos(this.currentPos);	
		return true;	
	}
	this.scaleReset=function(){
		mapObj.style.backgroundSize = this.borderLength + ' ' + this.borderLength;
		mapObj.style.width=this.borderLength;
		mapObj.style.height=this.borderLength;

		scaleValue = 1;
		this.setPos(this.currentPos);
	}
}


function mousePosition(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX,y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop - document.body.clientTop
	};
}
function mouseMoveStart(ev){
	ev = ev || window.event;
	curpos = mousePosition(ev);
	if(ev.target.id == mapObj.id){
		bIsMove = true;
	}
}
function mouseMoveEnd(ev){
	ev = ev || window.event;
	curpos = mousePosition(ev);

	bIsMove = false;
}
function mouseMove(ev){
	if(!bIsMove)
		return;

	ev = ev || window.event;
	oldpos = curpos;
	curpos = mousePosition(ev);

	var bkSize = bksize(mapObj.style.backgroundSize);

	var pos_offset ={'x':curpos.x-oldpos.x,'y':curpos.y-oldpos.y};
	
	pos.x = pos.x+pos_offset.x;
	pos.y = pos.y+pos_offset.y;

	
	if(pos.x>0){
		pos.x = 0;
	}else if(pos.x<-(bkSize.x-brLength)){
		pos.x = -(bkSize.x-brLength);
	}
	if(pos.y>0){
		pos.y=0;
	}else if(pos.y<-(bkSize.y-brLength)){
		pos.y = -(bkSize.y-brLength);
	}

	var posStr = pos.x +"px "+pos.y + "px";
	mapObj.style.left = pos.x + 'px';
	mapObj.style.top = pos.y + 'px';
}
function bksize(sizeStr){
	var bksize = {'x':0,'y':0};
	sizeStr = sizeStr.replace('px','');
	sizeStr = sizeStr.replace('px','');
	var s = sizeStr.split(' ');
	bksize.x = s[0];
	bksize.y = s[1];
	return bksize;
}
function transPosition(posStr){
	var p = 0;
	posStr = posStr.replace('px','');
	p = parseFloat(posStr);
	return p;
}