export function palette({url, code,avtar,text1,text2,icon1,icon2}) {
  return ({
    "width": "750px",
    "height": "1150px",
    "background": "#ffffff",
    "views": [
      {
      "type": "image",
      "url": url,
      "css": {
        "width": "750px",
        "height": "1150px",
        "top": "0px",
        "left": "0px",
      }
    },
      {
        "type": "qrcode",
        "content": code,
        "css": {
          "color": "#000000",
          "background": "#ffffff",
          "width": "100px",
          "height": "100px",
          "bottom": "18px",
          "right": "50px",
        }
      },
      {
        "type": "image",
        "url": avtar,
        "css": {
          "width": "450px",
          "height": "450px",
          "top": "335px",
          "left": "150px",
        }
      },
      {
        "type": "image",
        "url": icon1,
        "css": {
          "width": "80px",
          "height": "68px",
          "top": "150px",
          "left": "220px",
        }
      },
      {
        "type": "image",
        "url": icon2,
        "css": {
          "width": "80px",
          "height": "68px",
          "top": "150px",
          "left": "470px",
        }
      },
      {
        "type": "text",
        "text": text1,
        "css": {
          "color": "#F7DAB9",
          "width": "750px",
          "height": "40px",
          "top": "110px",
          "left": "0px",
          "fontSize": "32px",
          "lineHeight": "40px",
          "textAlign": "center"
        }
      }, {
        "type": "text",
        "text": text2,
        "css": {
          "color": "#F7DAB9",
          "width": "200px",
          "height": "48px",
          "top": "160px",
          "left": "285px",
          "fontSize": "40px",
          "lineHeight": "48px",
          "textAlign": "center",
          "maxLines": "1",
        }
      }, {
        "type": "text",
        "text": "我正在参加“年度报告称号”投票活动",
        "css": {
          "color": "#7A110D",
          "width": "514px",
          "top": "230px",
          "left": "118px",
          "fontSize": "28px",
          "textAlign": "center",
          "background": "#EED7AF",
          "borderRadius": "60px",
          "padding": "14px 0px",
        }
      }, {
        "type": "text",
        "text": "亲~ 请为我投票，感谢！",
        "css": {
          "color": "#EED7AF",
          "width": "400px",
          "height": "44px",
          "bottom": "244px",
          "left": "190px",
          "fontSize": "36px",
          "lineHeight": "44px",
          "textAlign": "center",
        }
      }
    ]
  });
}
