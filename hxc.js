const hxc = {
    d: [],
    author: '流苏',
    version: '20260520',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = hxc.d;
        // 版本更新提示
        if (getItem('up' + hxc.version, '') == '') {
            confirm({
                title: '更新内容',
                content: '版本号：' + hxc.version + '\n专题',
                confirm: $.toString((version) => {
                    setItem('up' + version, '1')
                }, hxc.version),
                cancel: $.toString(() => {})
            })
        }
        // 加载解密及辅助函数
        eval(hxc.rely(hxc.aes))
        // 直接显示专题列表
        hxc.subject()
    },
    subject: () => {
        var d = hxc.d;
        eval(hxc.rely(hxc.aes))
        try {
            let subject_url = getItem('host') + '/subject/list';
            let subject_body = '{"length":16,"orderType":3,"page":1,"subjectIds":[71,68,67,66,65,62,69,64,11,2]}';
            let list = post(subject_url, subject_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    img: data.coverImgUrl + lazy,
                    url: 'hiker://empty?page=fypage@rule=js:$.require("hxc").subjecterji()',
                    col_type: 'card_pic_3_center',
                    extra: {
                        id: data.id
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    subjecterji: () => {
        var d = hxc.d;
        eval(hxc.rely(hxc.aes))
        var id = MY_PARAMS.id;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 专题二级分类 = [{
                    title: '推荐&最新&最热',
                    id: '8&1&2'
                }]
                Cate(专题二级分类, '专题二级分类', d)
            }
            let getlist_url = getItem('host') + '/videos/getList';
            let getlist_body = '{"length":12,"orderType":' + getMyVar('专题二级分类', '8') + ',"page":' + pg + ',"subjectId":' + id + ',"type":0}';
            let list = post(getlist_url, getlist_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                    img: data.coverImgUrl + lazy,
                    url: data.id + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    aes: $.toString(() => {
        // 加载CryptoJS库
        eval(getCryptoJS())
        // 生成时间戳
        function getCurrentTimestamp() {
            return new Date().getTime();
        }
        // md5加密
        function md5(str) {
            return CryptoJS.MD5(str).toString();
        }
        // sha256加密
        function sha256(str) {
            return CryptoJS.SHA256(str).toString();
        }

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
        }

        function Cate(list, n, d, col) {
            if (!col) {
                col = 'scroll_button';
            }
            var index_n = list[0].id.split('&')[0] + '';
            list.forEach(data => {
                var title = data.title.split('&');
                var id = data.id.split('&');
                if (data.img != null) {
                    var img = data.img.split('&');
                } else {
                    var img = [];
                }
                title.forEach((title, index) => {
                    d.push({
                        title: (getMyVar(n, index_n) == id[index] ? strong(title, 'FF6699') : title),
                        img: img[index],
                        url: $(id[index]).lazyRule((n, title, id) => {
                            putMyVar(n, input);
                            refreshPage();
                            return 'hiker://empty';
                        }, n, title, id[index] + ''),
                        col_type: col,
                    })
                })
                d.push({
                    col_type: 'blank_block',
                });
            })
            return d;
        }
        // 解密函数
        function Decrypt(word) {
            const key = CryptoJS.enc.Utf8.parse("B77A9FF7F323B5404902102257503C2F");
            const iv = CryptoJS.enc.Utf8.parse("B77A9FF7F323B540");
            let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
            let decrypt = CryptoJS.AES.decrypt({
                ciphertext: encryptedHexStr
            }, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr;
        }

        // 加密函数
        function Encrypt(plaintext) {
            const key = CryptoJS.enc.Utf8.parse("B77A9FF7F323B5404902102257503C2F");
            const iv = CryptoJS.enc.Utf8.parse("B77A9FF7F323B540");
            var encrypted = CryptoJS.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }
        var lazy = $('').image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let key = CryptoUtil.Data.parseUTF8("46cc793c53dc451b");
            let textData = CryptoUtil.Data.parseInputStream(input).base64Decode();
            let encrypted = CryptoUtil.AES.decrypt(textData, key, {
                mode: "AES/ECB/NoPadding"
            });
            let base64Text = encrypted.toString().split("base64,")[1];
            let encrypted0 = CryptoUtil.Data.parseBase64(base64Text, _base64.NO_WRAP);
            return encrypted0.toInputStream();
        })

        function post(url, data0) {
            var endata = Encrypt(data0);
            var ents = Encrypt(parseInt(new Date().getTime() / 1e3) + 60 * new Date().getTimezoneOffset() + '');
            var body = '{"endata":"' + endata + '","ents":"' + ents + '"}';
            var html = fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: body,
                method: 'POST'
            });
            return JSON.parse(html);
        }
        var vod = $('').lazyRule(() => {
            eval($.require('hxc').rely($.require('hxc').aes));
            let data0 = '{"videoId":' + input + '}';
            var url = getItem('host') + '/videos/getPreUrl';
            var url1 = post(url, data0);
            if (url1.data.url) {
                var url2 = url1.data.url;       
                var muhost = url2.match(/(https?:\/\/[^\/]+(?:\/[^\/]+){3}\/\d+\/)|(https:\/\/(?:[^\/?#]+\/){4})/)[0];         
                var msign = url2.match(/sign.+/)[0];      
                var playhtml = fetch(url2);     
                if (playhtml) {   
                    var murl = muhost + playhtml.match(/(1|2)000kb\/.+/)[0]; 
                    return murl.replace(/start.*?&sign/, 'sign')
                }
            }
            return 'toast://未获取到链接'
        })
    })
}
$.exports = hxc