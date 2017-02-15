window.onload = function(){
	
	(function () {
		
		//顶部搜索
		var musicSearch = document.getElementById('musicSearch');
		var musicSearchInp = musicSearch.getElementsByTagName('input')[0];
		
		//左侧音乐列表
		var musicList = document.getElementById('musicList');
			musicList.onOff = false;
		var musicContent = musicList.getElementsByClassName('content')[0];
		var musicUl = musicList.getElementsByTagName('ul')[0];
			musicUl.status = 'bd';
		var musicLis = musicUl.getElementsByTagName('li');
		var musicClose = musicList.getElementsByClassName('close')[0];
		
		//左下音乐详情
		var musicDetail = document.getElementById('musicDetail');
		var musicListBtn = musicDetail.getElementsByClassName('music-list-btn')[0];
		var lyricBtn = musicDetail.getElementsByClassName('lyric-btn')[0];
			lyricBtn.onOff = false;
		var musicDetailMask = musicDetail.getElementsByClassName('musicDetail-mask')[0];
		var musicDetailMain = musicDetail.getElementsByClassName('music-detail-main')[0];
		var musicPlayMode = document.getElementById('musicPlayMode');
			musicPlayMode.mode = 'loop';
		
		//底部音乐进度
		var musicFunction = document.getElementById('musicFunction');
		var progress = musicFunction.getElementsByClassName('progress')[0];
		var progressMask = musicFunction.getElementsByClassName('progress-mask')[0];
		var progressAll = musicFunction.getElementsByClassName('progress-all')[0];
		
		var musicBtns = musicFunction.getElementsByClassName('music-btns')[0];
		var prevBtn = musicBtns.getElementsByClassName('music-prev-btn')[0];
		var playBtn = musicBtns.getElementsByClassName('music-play-btn')[0];
			playBtn.onOff = false;
		var nextBtn = musicBtns.getElementsByClassName('music-next-btn')[0];
		
		//中心歌词
		var lyric = document.getElementById('lyric');
			lyric.onOff = false;
		var lyricUl = lyric.getElementsByTagName('ul')[0];
			lyricUl.onOff = true;
			lyricUl.status = true;
		var lyricLis = null;
		
		//音乐播放器
		var oAudio = document.getElementById('oAudio');
		
		//歌词中线
		var lycCurrent = document.getElementById('lycCurrent');
		
		//歌词定时器
		lycTimer = null;
		
		//歌曲定时器
		songTimer = null;
		
		//歌词定位
		var index = 0;
		
		//歌曲定位
		var musicIndex = 0;
		
		//滚动条
		var scrollBar = document.getElementById('scrollBar');
		var scroll = scrollBar.getElementsByClassName('scroll')[0];
		
		//自适应高度+滚动条
		adapt();
		
		
		
		musicSearchInp.select();
		//搜索框点击
		move(musicSearch,{top:50},400,'linear',function(){
			move(musicDetailMask,{height:90,opacity:1},100,'linear')
			move(musicList,{height:(window.innerHeight - 90),opacity:1},100,'linear');
			musicList.onOff = true;

			musicSearchInp.onkeydown = function(ev){
				if ( ev.keyCode == 13 && this.value != '' ) {
					$.ajax({ 
					    type: "GET", 	
						url: "https://c.y.qq.com/soso/fcgi-bin/search_cp?remoteplace=txt.yqq.song&searchid=65816139054526899&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=" + this.value + "&g_tk=107398053&jsonpCallback=searchCallbacksong4917&loginUin=707804052&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",
						dataType : "jsonp",
						jsonpCallback : "searchCallbacksong4917",
						success: function(data) {
							
							musicUl.status = 'qq';
							if ( musicSearchInp.onOff ) {
								return;
							}
							musicSearchInp.onOff = true;
							move(musicDetailMask,{height:90,opacity:1},100,'linear')
							move(musicList,{height:(window.innerHeight - 90),opacity:1},100,'linear');
							setTimeout(function(){
								musicList.onOff = true;
								musicSearchInp.onOff = false;
							},600);
							
							var Data = data.data.song.list;
							//歌手
							var singer = [];
							//歌名
							var song = [];
							//歌曲id
							var songid = [];
							//歌曲mid
							var songmid = [];
							//封面
							var cover = [];
							var coverImg = [];
							//歌曲时间
							var songTime = [];
							
							for (var i = 0; i < Data.length; i++) {
								song.push(Data[i].songname);
								singer.push(Data[i].singer[0].name);
								songmid.push(Data[i].songmid);
								cover.push(Data[i].albummid);
								songTime.push(Data[i].interval);
								songid.push(Data[i].songid);
							}
							for (var i = 0; i < cover.length; i++) {
								var a = cover[i].charAt(cover[i].length - 2);
								var b = cover[i].charAt(cover[i].length - 1);
								coverImg.push('http://imgcache.qq.com/music/photo/mid_album_90/'+a+'/'+b+'/'+cover[i]+'.jpg');
							}
							
							var html = '';
							for (var i = 0; i < Data.length; i++) {
								var m = toZero(Math.floor(songTime[i]/60));
								var s = toZero(Math.floor(songTime[i]%60));
								html += '<li data-songid="'+songid[i]+'" data-songmid="'+songmid[i]+'" data-songTime="'+m+':'+s+'">'+
											'<div class="cover">'+
												'<img src="'+coverImg[i]+'"/>'+
											'</div>'+
											'<div class="song-info">'+
												'<p class="song">'+
													'<span class="text">'+song[i]+'</span>'+
												'</p>'+
												'<p class="singer">'+singer[i]+'</span></p>'+
												'<p class="song-time">'+m+':'+s+'</p>'+
											'</div>'+
											'<div class="play-btn">'+
												'<span class="play-icon"></span>'+
											'</div>'+
										'</li>';
							}
							musicUl.innerHTML = html;
							musicLis = musicUl.getElementsByTagName('li');
							for (var i = 0; i < musicLis.length; i++) {
								fnLisClick(i);
							}

							window.onresize();

						} 
					});

				}
			}
			
			
		});
		
		//传参点击
		for (var i = 0; i < musicLis.length; i++) {
			fnLisClick(i);
		}
		
		//歌曲点击
		function fnLisClick(n){
			musicLis[n].onclick = function(){
				//初始化
				musicIndex = n;
				playBtn.classList.add('play');
				if ( musicUl.status == 'bd' ) {//本地音乐
					oAudio.src = this.getAttribute('data-songUrl');
					load(this.getAttribute('data-songUrl'));
				} else if ( musicUl.status == 'qq' ) {//调qq数据
					$.ajax({ 
					    type: "GET", 	
						url: "https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid="+this.getAttribute('data-songmid')+"&tpl=yqq_song_detail&format=jsonp&callback=getOneSongInfoCallback&g_tk=5381&jsonpCallback=getOneSongInfoCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",
						dataType : "jsonp",
						jsonpCallback : "getOneSongInfoCallback",
						success: function(data) {
							data = JSON.stringify(data.url);
							var oUrl = data.split('":"')[1];
							oUrl = 'http://' + oUrl.substring(0,oUrl.length - 2);
							oAudio.pause();
							oAudio = document.createElement('audio');
							oAudio.src = oUrl;
							oAudio.autoplay = true;
						}
					});
					
				}
				
				//渲染歌词 + 歌词焦点状态
				fnlyric(this);
				
				//渲染歌曲详情信息 + 歌曲进度
				fnSong(this);
				
			}
		}
		
		//播放暂停控制
		playBtn.onclick = function(){
			if ( oAudio.currentSrc ) {
				if ( oAudio.paused ) {
					oAudio.play();
					playBtn.className = 'music-play-btn play';
				} else {
					oAudio.pause();
					playBtn.className = 'music-play-btn';
				}
			}
		}
		
		//上一曲
		prevBtn.onclick = function(){
			if ( oAudio.currentSrc ) {
				switch (musicPlayMode.mode){
					case 'loop':
						if ( musicLis[musicIndex - 1] ) {
							musicLis[musicIndex - 1].onclick();
						} else {
							musicLis[musicLis.length - 1].onclick();
						}
						break;
					case 'shuffle':
						var shuffle = Math.round(Math.random()*musicLis.length);
						musicLis[shuffle].onclick();
						break;
					case 'one':
						if ( musicLis[musicIndex - 1] ) {
							musicLis[musicIndex - 1].onclick();
						} else {
							musicLis[musicList.length - 1].onclick();
						}
						break;
				}
			}
		}
		
		//下一曲
		nextBtn.onclick = function(){
			if ( oAudio.currentSrc ) {
				switch (musicPlayMode.mode){
					case 'loop':
						if ( musicLis[musicIndex + 1] ) {
							musicLis[musicIndex + 1].onclick();
						} else {
							musicLis[0].onclick();
						}
						break;
					case 'shuffle':
						var shuffle = Math.round(Math.random()*musicLis.length);
						musicLis[shuffle].onclick();
						break;
					case 'one':
						if ( musicLis[musicIndex + 1] ) {
							musicLis[musicIndex + 1].onclick();
						} else {
							musicLis[0].onclick();
						}
						break;
				}
			}
		}
		
		//播放模式控制
		musicPlayMode.onclick = function(){
			switch (this.mode){
				case 'loop':
					this.className = 'music-play-shuffle';
					this.mode = 'shuffle';
					break;
				case 'shuffle':
					this.className = 'music-play-one';
					this.mode = 'one';
					break;
				case 'one':
					this.className = 'music-play-loop';
					this.mode = 'loop';
					break;
			}
		}

		//底部歌曲进度拖拽
		progressMask.onclick = function(ev){
			if ( oAudio.currentSrc ) {
				progress.style.width = ev.clientX;
				var scale = ev.clientX / window.innerWidth;
				oAudio.currentTime = scale * oAudio.duration;
			}
		}

		//歌词进度拖拽
		lyricUl.onmousedown = function(ev){//歌词进度拖拽
			if ( !oAudio.src ) {
				return;
			}
			if ( !this.onOff ) {
				return;
			}
			this.status = false;
			var disY = ev.clientY;
			var disT = parseInt(lyricUl.style.top);
			var thisTime = null;
			document.onmousemove = function(ev){
				lycCurrent.style.display = 'block';
				var T = disT + (ev.clientY - disY);
				lyricUl.style.top = T + 'px';
				for (var i = 0; i < lyricLis.length; i++) {
					if ( lyricLis[i].getBoundingClientRect().bottom > lycCurrent.getBoundingClientRect().top ) {
						for (var j = 0; j < lyricLis.length; j++) {
							lyricLis[j].className = '';
						}
						lyricLis[i].className = 'active';
						thisTime = lyricLis[i].getAttribute('data-time');
						break;
					}
				}
				
			}
			document.onmouseup = function(){
				lycCurrent.style.display = '';
				lyricUl.status = true;
				if ( !thisTime ) {
					document.onmousemove = null;
					document.onmouseup = null;
					return;
				}
				var m = thisTime.substring(0,2) * 60;
				var s = Number(thisTime.substring(3));
				oAudio.currentTime = m + s;
				//歌词焦点状态
				document.onmousemove = null;
				document.onmouseup = null;
			}
			
			return false;
		}

		//左侧列表关闭
		musicClose.onclick = function(){
			windowMove(this);
		}
		
		//左下音乐列表开关
		musicListBtn.onclick = function(){
			windowMove(this);
		}
		
		//左下歌词开关
		lyricBtn.onclick = function(){
			if ( this.onOff ) {
				return;
			}
			this.onOff = true;
			if ( lyric.onOff ) {
				move(lyric,{opacity:0},300,'linear');
			} else {
				move(lyric,{opacity:1},300,'linear');
			}
			setTimeout(function(){
				lyric.onOff = !lyric.onOff;
				lyricBtn.onOff = !lyricBtn.onOff;
			},500);
		}
		
		//渲染歌曲详情信息 + 歌曲进度
		function fnSong(obj){
			var html = '<div class="cover">'+
							'<img src="'+obj.getElementsByTagName('img')[0].src+'"/>'+
						'</div>'+
						'<div class="song-info">'+
							'<p class="song">'+
								'<span class="text-bg">'+obj.getElementsByClassName('text')[0].innerHTML+'</span>'+
								'<span class="text">'+obj.getElementsByClassName('text')[0].innerHTML+'</span>'+
							'</p>'+
							'<p class="singer">'+obj.getElementsByClassName('singer')[0].innerHTML+'</span></p>'+
							'<p class="song-time"><span>00:00</span> / '+obj.getElementsByClassName('song-time')[0].innerHTML+'</p>'+
						'</div>';
			musicDetailMain.innerHTML = html;
			
			var songNewTime = musicDetailMain.getElementsByClassName('song-time')[0].getElementsByTagName('span')[0];
			clearInterval(songTimer);
			songTimer = setInterval(function(){
				var time = Math.floor(oAudio.currentTime);
				var m = toZero(Math.floor(time/60));
				var s = toZero(Math.floor(time%60));
				songNewTime.innerHTML = m + ':' + s;
				
				var scale = oAudio.currentTime / oAudio.duration;
				progress.style.width = scale * window.innerWidth + 'px';
				
				if ( oAudio.ended ) {
					switch (musicPlayMode.mode){
						case 'loop':
							if ( musicLis[musicIndex + 1] ) {
								musicLis[musicIndex + 1].onclick();
							} else {
								musicLis[0].onclick();
							}
							break;
						case 'shuffle':
							var shuffle = Math.round(Math.random()*musicLis.length);
							musicLis[shuffle].onclick();
							break;
						case 'one':
							musicLis[musicIndex].onclick();
							break;
					}
				}
				
			},800)
		}
		
		//渲染歌词 + 歌词焦点状态
		function fnlyric(obj){
			
			var request = new XMLHttpRequest();
			request.open("POST", "api.php");
			var data = '_type=' + 'lyric' + "&lyricid=" + obj.getAttribute('data-songid');
			request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			request.send(data);
			request.onreadystatechange = function() {
				if (request.readyState===4) {
					if (request.status===200) {
						
						clearInterval(lycTimer);
						move(lyricUl,{top:0},200,'linear');
						var result = request.responseText;
						result = result.split('&#58;').join(':');
						result = result.split('&#46;').join('.');
						result = result.split('&#32;').join(' ');
						result = result.split('&#45;').join('-');
						result = result.split('&#10;').join('br');
						result = result.substring(result.indexOf('br[offset:') + 14,result.length - 3);
						
						var re = /\d{2}:\d{2}/g;
						var lrcTime = result.match(re);
						
						var lrc = result.split('br');
						for (var i = 0; i < lrc.length; i++) {
							lrc[i] = lrc[i].substring(10);
						}
						
						if ( lrcTime.length == lrc.length ) {
							var html = '';
							for (var i = 0; i < lrc.length; i++) {
								html += '<li data-time="'+lrcTime[i]+'">'+lrc[i]+'</li>';
							}
							lyricUl.onOff = true;
							lyricUl.innerHTML = html;
						} else {
							lyricUl.onOff = false;
							return lyricUl.innerHTML = '<li>暂无歌词</li>';
						}

						lyricLis = lyricUl.getElementsByTagName('li');
						//歌词焦点状态
						lycTimer = setInterval(function(){
							var time = Math.floor(oAudio.currentTime);
							var m = toZero(Math.floor(time/60));
							var s = toZero(Math.floor(time%60));
							
							if ( lyricUl.status ) {
								for (var i = 0; i < lyricLis.length; i++) {
									var iTime = lyricLis[i].getAttribute('data-time');
									var iM = iTime.substring(0,2);
									var iS = iTime.substring(3);
									
									if ( m == iM && s == iS || m == iM && s < iS ) {
										index = i;
										break;
									} else if ( m == iM && s > iS ) {
										index = i;
									}
									
									if ( index > 4 ) {
										move(lyricUl,{top:-(index-4)*24},200,'linear');
									}
									
									for (var j = 0; j < lyricLis.length; j++) {
										lyricLis[j].className = '';
									}
									lyricLis[index].className = 'active';
								}
							}
						},50);
						
					}
				}
			}
		}
		
		//左侧列表显示隐藏
		function windowMove(obj,searchInp){
			if ( obj.onOff ) {
				return;
			}
			obj.onOff = true;
			if ( musicList.onOff ) {
				move(musicDetailMask,{height:0,opacity:0},100,'linear');
				move(musicList,{height:0,opacity:0},100,'linear');
			} else {
				move(musicDetailMask,{height:90,opacity:1},100,'linear');
				move(musicList,{height:(window.innerHeight - 90),opacity:1},100,'linear');
			}
			setTimeout(function(){
				musicList.onOff = !musicList.onOff;
				obj.onOff = false;
			},600);
		}
		
		//禁止双击文字被选中
		window.top.document.onselectstart = function(){
			return false;
		}
		
		//补零
		function toZero(num){
			return num < 10 ? '0' + num : '' + num;
		}

		//音乐列表模拟滚动条
		scroll.onmousedown = function(ev){
			var disT = ev.clientY - this.getBoundingClientRect().top;
			document.onmousemove = function(ev){
				var T = ev.clientY - scrollBar.getBoundingClientRect().top - disT;
				var maxT = scrollBar.getBoundingClientRect().bottom - scroll.offsetHeight - scrollBar.getBoundingClientRect().top;
				if ( T < 0 ) {
					T = 0;
				}
				if ( T > maxT ) {
					T = maxT;
				}
				scroll.style.top = T + 'px';
				var maxRT = musicUl.offsetHeight - musicContent.offsetHeight;
				var scale = T / maxT;
				musicUl.style.top = -maxRT*scale +'px';
			}
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
		
		window.onresize = function(){
			adapt();
		}
		//自适应
		function adapt(){
			var H = window.innerHeight - 90;
			if ( H < 512 ) {
				musicContent.style.height = 408 - (512 - H) + 'px';
			} else {
				musicContent.style.height = 408 + 'px';
			}
			musicList.style.height = H + 'px';
			
			if ( musicUl.offsetHeight <= musicContent.offsetHeight ) {
				scrollBar.style.display = 'none';
			} else {
				scrollBar.style.display = 'block';
				console.log(scrollBar.offsetHeight,musicContent.offsetHeight,musicUl.offsetHeigh)
				var scrollH = scrollBar.offsetHeight * musicContent.offsetHeight / musicUl.offsetHeight;
				scroll.style.height = scrollH + 'px';
			}
		}
		
		
		
		
		
		
		
		var oCanvas = document.getElementById('canvas');
		var xhr = new XMLHttpRequest();
		var ac = new (window.AudioContext || window.webkitAudioContext )();
		var gainNode = ac[ac.createGain ? "createGain" : "createGainNode"]();
		gainNode.connect(ac.destination);
		
		
		var analyser = ac.createAnalyser();
		var size = 50;
		analyser.fftSize = 512;
		analyser.connect(gainNode);
		

		var source = null;
		var count = 0;
		var bufferSource = null;
		
		var width,height;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		oCanvas.appendChild(canvas);
		
		width = oCanvas.clientWidth;
		height = oCanvas.clientHeight;
		
		canvas.width = width;
		canvas.height = height;
		
		var line = ctx.createLinearGradient(0,0,0,height);
		line.addColorStop(0,'#8dffe3');
		ctx.fillStyle = line;
		
		function draw(arr){
			ctx.clearRect(0,0,width,height);
			var w = width / size;
			for (var i = 0; i < size; i++) {
				var h = arr[i] / 256 * height;
				ctx.fillRect(w * i,0,w * 0.6,h);
			}
		}
		
		function load(url){
			var n = ++count;
//			source && source[source.stop ? "stop" : "noteoff"]();
			xhr.abort();
			xhr.open("GET", url);
			xhr.responseType = "arraybuffer";
			xhr.onload = function(){
				if (n != count) {
					return;
				}
				ac.decodeAudioData(xhr.response, function(buffer){
					if (n != count) {
						return;
					}
//					bufferSource = ac.createBufferSource(oAudio);
					bufferSource = ac.createMediaElementSource(oAudio);
//					bufferSource.buffer = buffer;
					bufferSource.connect(analyser);
					analyser.connect(ac.destination);
//					bufferSource[bufferSource.start ? "start" : "noteOn"](0);
//					source = bufferSource;
				},function(erro){
					console.log(err);
				})
			}
			xhr.send();
		}
		
		function visualizer(){
			var arr = new Uint8Array(analyser.frequencyBinCount);
			requestAnimationFrame = window.requestAnimationFrame ||
									window.webkitRequestAnimationFrame ||
									window.mozRequestAnimationFrame;
			function v(){
				analyser.getByteFrequencyData(arr);
				draw(arr);
				requestAnimationFrame(v);
			}
			requestAnimationFrame(v);
		}
		visualizer();







	})();
	
}
