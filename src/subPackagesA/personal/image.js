export function palette(url, code) {
  return ({
    "width": "750px",
    "height": "1333px",
    "background": "#ffffff",
    "views": [{
      "type": "image",
      "url": url,
      "css": {
        "width": "750px",
        "height": "1333px",
        "top": "0px",
        "left": "0px",
      }
    },
      {
        "type": "image",
        "url": code,
        "css": {
          "width": "165px",
          "height": "165px",
          "bottom": "50px",
          "right": "66px",
        }
      }
    ]
  });
}
