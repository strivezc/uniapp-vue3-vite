<template>
  <view>
    <image mode="widthFix" :src="imgUrl" class="main"></image>
    <div class="main">
      <!-- 游戏 -->
      <num-game
        v-if="mode === 1"
        :gamedata="gamedata"
        ref="game"
        @endCallback="endCallback"
      ></num-game>
      <interactive-game
        v-else-if="mode === 2"
        :gamedata="gamedata"
        ref="interactiveGame"
        @endCallback="endCallback"
      ></interactive-game>
    </div>

    <div class="todos">
      <div class="start" @click="start">开始游戏</div>
    </div>
    <div class="changeModel">
      <div class="model" @click="changeModel('number', 1)">模式一num</div>
      <div class="model" @click="changeModel('img', 1)">模式一img</div>
      <div class="model" @click="changeModel('number', 2)">模式二num</div>
      <div class="model" @click="changeModel('img', 2)">模式二img</div>
    </div>
    <view class="canvas-box">
      <canvas
        canvas-id="canvasIn"
        id="canvas"
        class="canvas canvas-in"
        :style="canvasWH"
        v-if="canvasIn"
      ></canvas>
      <canvas
        canvas-id="canvasOut"
        id="canvasOut"
        class="canvas canvas-out"
        :style="canvasWH"
      ></canvas>
      <!--      <image mode="widthFix" v-for="(item,index) in picList" :src="item" :key="index" class="pic"></image>-->
    </view>
  </view>
</template>

<script>
  import NumGame from './components/NumGame.vue';
  import InteractiveGame from './components/InteractiveGame.vue';
  // import img1 from "@img/puzzle/1.png";
  // import img2 from "@img/puzzle/2.png";
  // import img3 from "@img/puzzle/3.png";
  // import img4 from "@img/puzzle/4.png";
  // import img5 from "@img/puzzle/5.png";
  // import img6 from "@img/puzzle/6.png";
  // import img7 from "@img/puzzle/7.png";
  // import img8 from "@img/puzzle/8.png";
  // import img9 from "@img/puzzle/8.png";
  const level = 3;

  export default {
    components: {
      NumGame,
      InteractiveGame,
    },
    data() {
      return {
        gamedata: {
          level: level,
          mode: 'number', // 如果是 number 后期会自动生成, 如果是 img 需要传对应的图片
          imgs: [],
          style: {
            sliderBg: '#ffc107',
            sliderColor: '#000',
            sliderFontSize: '18px',
            gameBoxBg: '#5a009b',
          },
          difficulty: 10 * level, // 难度分为 1 到正无穷 推荐设置[10-100]
        },
        mode: 1,

        // 图片裁剪
        divisionType: 3,
        picList: [],
        uploadFlag: false,
        canvasIn: true,
        imgUrl:
          'https://talk915-test-1302759139.cos.ap-beijing.myqcloud.com/data/image/1e9b587dc546407da09a4a350416c351.png',
        imgW: 0,
        imgH: 0,
        canvasWH: '',
      };
    },
    onShow: function () {
      // this.initCanvas()
    },
    methods: {
      start() {
        // 开始游戏/重置游戏
        if (this.mode === 1) {
          this.$refs.game.gameStart();
        } else {
          this.$refs.interactiveGame.gameStart();
        }
      },
      changeModel(val, mode) {
        this.gamedata.mode = val;
        this.mode = mode;
      },
      endCallback() {
        // 通关了
        uni.showModal({
          title: '提示',
          content: '通关了',
          confirmColor: '#0087FF',
          cancelColor: '#0087FF',
          success: function (res) {
            if (res.confirm) {
              //
            }
          },
        });
        console.log('我通关了');
      },
      initCanvas() {
        let that = this;
        this.canvasIn = true;
        const ctx = uni.createCanvasContext('canvasIn', that);
        /* 获取图片信息 */
        wx.getImageInfo({
          src: that.imgUrl,
          success(imgInfo) {
            console.log({ imgInfo });
            const imgW = 450;
            const imgH = 450;
            that.canvasWH = `width: ${imgW}px;height: ${imgH}px`;
            that.imgW = imgW;
            that.imgH = imgH;
            console.log('this.canvasWH', that.canvasWH);
            /* 获取图片的大小 */
            ctx.drawImage(imgInfo.path, 0, 0, imgW, imgH);
            ctx.draw();
            const query = uni.createSelectorQuery();
            query.select('#canvasOut').boundingClientRect(function (resOut) {
              /* 清除上一次绘图 */
              const ctxOut = uni.createCanvasContext('canvasOut', that);
              ctxOut.rect(10, 10, resOut.width, resOut.width);
              ctxOut.fillStyle = '#fff';
              ctxOut.fill();
              ctxOut.draw();
              /* 开始图片裁剪 */
              that.cutImgHandle(imgW, imgH);
            });
            query.exec();
          },
          fail() {},
        });
      },
      /* 点击裁剪动作 */
      cutImgHandle(imgW, imgH) {
        let that = this;
        let x = 0,
          y = 0,
          picList = [],
          timer;
        const cutW = imgW / this.divisionType;
        const cutH = imgH / this.divisionType;
        /* 循环裁剪 */
        cutLoop();
        function cutLoop() {
          timer = setTimeout(function () {
            const cfg = {
              x: x * cutW,
              y: y * cutH,
              width: cutW,
              height: cutH,
            };
            uni.canvasToTempFilePath({
              canvasId: 'canvasIn',
              ...cfg,
              success(res) {
                console.log('执行了', res);
                picList.push(res.tempFilePath);
                if (y < that.divisionType) {
                  cutLoop();
                }
              },
              fail(err) {
                console.log('切割失败', err);
              },
              complete() {
                x++;
                if (x === that.divisionType) {
                  y++;
                  x = 0;
                  if (y === that.divisionType) {
                    that.uploadFlag = true;
                    that.canvasIn = false;
                    that.picList = picList;
                    that.gamedata.imgs = that.picList;
                    console.log(that.picList, 'picList');
                    clearTimeout(timer);
                  }
                }
              },
            });
          });
        }
      },
    },
  };
</script>

<style lang="scss">
  .changeModel {
    display: flex;
    padding-top: 5vh;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0 50px;
    box-sizing: border-box;
    padding-bottom: 200rpx;

    .model {
      margin-top: 10px;
      width: 120px;
      height: 40px;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background: #5a009b;
      cursor: pointer;
      user-select: none;
    }
  }

  .diffec {
    text-align: center;
    color: #fff;

    .tip {
      font-size: 12px;
      padding-top: 0;
      margin-top: 2px;
      color: #e6e6e6;
    }

    .difftodo {
      display: flex;
      justify-content: center;

      .to {
        padding: 10px 15px;
        margin: 10px;
        background: #5a009b;
        border-radius: 10px;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
      }
    }
  }

  .main {
    display: block;
    width: 300px;
    height: 300px;
    margin: auto;
    padding-top: 5vh;
  }

  .todos {
    display: flex;
    padding-top: 50px;
    justify-content: center;

    .start {
      width: 120px;
      height: 40px;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background: #5a009b;
      cursor: pointer;
      user-select: none;
    }
  }

  .canvas-box {
    position: relative;
  }

  .canvas {
    min-width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
  }

  .canvas-in {
    left: -9999px;
    top: -9999px;
    z-index: -1;
  }
  .canvas-out {
    left: -9999px;
    top: -9999px;
    z-index: -1;
    background-color: #fff;
  }
  .pic {
    width: 200rpx;
    margin: 10rpx;
  }
</style>
