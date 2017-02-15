<?php

	$_type = $_POST['_type'];
	
	switch ($_type) {
		case 'lyric':
			$lyricid = $_POST['lyricid'];
			$url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg?nobase64=1&musicid=".$lyricid."&callback=jsonp1&g_tk=5381&jsonpCallback=jsonp&loginUin=0&hostUin=0&format=jsonp1&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0";
			$opt=array('http'=>array('header'=>"Referer: https://y.qq.com/")); 
			$context=stream_context_create($opt); 
			$file_contents = file_get_contents($url,false, $context);
			echo $file_contents;
			break;
		default:
			
			break;
	}

?>