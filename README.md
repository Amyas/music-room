# music-room

网易云API
POST http://music.163.com/api/search/pc

必要参数：

s：搜索的内容

offset：偏移量（分页用）

limit：获取的数量

type：搜索的类型

歌曲 1

专辑 10

歌手 100

歌单 1000

用户 1002

mv 1004

歌词 1006

主播电台 1009

 

2.歌曲信息


Full request URI: http://music.163.com/api/song/detail/?id=28377211&ids=%5B28377211%5D
1
Full request URI: http://music.163.com/api/song/detail/?id=28377211&ids=%5B28377211%5D
URL：

GET  http://music.163.com/api/song/detail/

必要参数：

id：歌曲ID

ids：不知道干什么用的，用[]括起来的歌曲ID

 

3.歌手专辑


Full request URI: http://music.163.com/api/artist/albums/166009?id=166009&offset=0&total=true&limit=5
1
Full request URI: http://music.163.com/api/artist/albums/166009?id=166009&offset=0&total=true&limit=5
URL：

GET http://music.163.com/api/artist/albums/歌手ID

必要参数：

limit：获取的数量(不知道为什么这个必须加上）

 

4.专辑信息


Full request URI: http://music.163.com/api/album/2457012?ext=true&id=2457012&offset=0&total=true&limit=10
1
Full request URI: http://music.163.com/api/album/2457012?ext=true&id=2457012&offset=0&total=true&limit=10
URL：

GET http://music.163.com/api/album/专辑ID

 

5.歌单


Full request URI: http://music.163.com/api/playlist/detail?id=37880978&updateTime=-1
1
Full request URI: http://music.163.com/api/playlist/detail?id=37880978&updateTime=-1
URL：

GET http://music.163.com/api/playlist/detail

必要参数：

id：歌单ID

 

6.歌词


Full request URI: http://music.163.com/api/song/lyric?os=pc&id=93920&lv=-1&kv=-1&tv=-1
1
Full request URI: http://music.163.com/api/song/lyric?os=pc&id=93920&lv=-1&kv=-1&tv=-1
URL：

GET http://music.163.com/api/song/lyric

必要参数：

id：歌曲ID

lv：值为-1，我猜测应该是判断是否搜索lyric格式

kv：值为-1，这个值貌似并不影响结果，意义不明

tv：值为-1，是否搜索tlyric格式

 

7.MV


Full request URI: http://music.163.com/api/mv/detail?id=319104&type=mp4
1
Full request URI: http://music.163.com/api/mv/detail?id=319104&type=mp4
URL：

GET http://music.163.com/api/mv/detail

必要参数：

id：mvid

type：值为mp4，视频格式，不清楚还有没有别的格式
