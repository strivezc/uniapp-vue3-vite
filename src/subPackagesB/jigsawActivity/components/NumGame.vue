<template>
  <div class="_game">
    <view class="test">01234ASEGCXasd</view>
    <view class="test2">0123456789</view>
    <div
        class="gameMain"
        :style="{ backgroundColor: gamedata.style.gameBoxBg }"
    >
      <div
          class="y-axis"
          :class="emptyNum === index ? 'empty' : ''"
          v-for="(item, index) in arr"
          :key="index"
      >
        <div
            class="x-axis animate__animated"
            :class="[item2 === 0 ? 'empty' : '',clickIndex===item2?animateClass:'']"
            :style="{
            backgroundColor: gamedata.style.sliderBg,
            color: gamedata.style.sliderColor,
            fontSize: gamedata.style.sliderFontSize,
          }"
            v-for="(item2, index2) in item"
            :key="index2"
            @click="boxHandle(index, index2,item2)"
        >
          <img
              :src="gamedata.imgs[item2 - 1]"
              v-if="gamedata.mode === 'img' && item2 != 0"
              alt=""
          />
          <span v-else-if="item2 != 0">
            {{ item2 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gamedata: {
      type: Object,
    },
  },
  data() {
    return {
      emptyNum: 8,
      isStart: false,
      arr: [],
      startX: 2,
      startY: 2,
      num: 0,
      resultJson: '',
      clickIndex: null,
      animateClass: '',
    }
  },
  onLoad(){
  },
  created() {
    this.startX = this.gamedata.level - 1;
    this.startY = this.gamedata.level - 1;
    this.arr = this.creatArr(this.gamedata.level);
    this.resultJson=this.arr.toString();
    console.log(this.arr ,'this.arr ');
    uni.loadFontFace({
      family: 'CookieRunBold',
      source: 'url("https://cos.talk915.com/data/tool/CookieRunBold.otf")',
      success() {
        console.log('success-family')
      },
      complete() {
        console.log('complete')
      }
    })
  },
  methods: {
    // 通关回调函数
    gameEndCallback(val) {
      this.isStart = false;
      this.$emit("endCallback");
    },
    // 创建数组
    creatArr(level) {
      let arr = [];
      let lin = [];
      const levels = level * level + 1;

      for (let i = 1; i < levels; i++) {
        lin.push(i);
        if (lin.length === level) {
          arr.push(lin);
          lin = [];
        }
      }
      arr[level - 1][level - 1] = 0;
      console.log(arr, 'arr');
      return arr;
    },

    // 上移动
    moveUp(x, y) {
      if (x <= 0) return -1;
      //   开始交换位置
      const okx = x - 1;
      this.move(x, y, okx, y);
      return {
        x: okx,
        y,
      };
    },

    //下移动
    moveDown(x, y) {
      if (x >= this.gamedata.level - 1) return -1;
      const okx = x + 1;
      this.move(x, y, okx, y);
      return {
        x: okx,
        y,
      };
    },

    // 左移动
    moveLeft(x, y) {
      if (y <= 0) return -1;
      const oky = y - 1;
      this.move(x, y, x, oky);
      return {
        x,
        y: oky,
      };
    },
    // 右移动
    moveRight(x, y) {
      if (y >= this.gamedata.level - 1) return -1;
      const oky = y + 1;
      this.move(x, y, x, oky);
      return {
        x,
        y: oky,
      };
    },
    // 移动函数
    move(x, y, moveX, moveY) {
      this.num++;
      const num = this.arr[x][y];
      this.$set(this.arr[x], y, this.arr[moveX][moveY])
      this.$set(this.arr[moveX], moveY, num)
      // this.arr[x][y]=this.arr[moveX][moveY]
      // this.arr[moveX][moveY]=num;
      //   return arr;
    },
    addClass(direction) {
      this.animateClass = '';
      // this.$nextTick(() => {
      this.animateClass = `animate__slideIn${direction}`;
      // })
    },
    //寻找空白块的位置
    seekEmpty() {
      const arr = this.arr;
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (Number(arr[i][j]) === 0) {
            return {
              emptyX: i,
              emptyY: j,
            };
          }
        }
      }
    },
    //   检查是否完成
    gameEnd() {
      // const target = this.creatArr(this.gamedata.level).toString();
      if (this.arr.toString() === this.resultJson) {
        this.clickIndex = null;
        this.animateClass = '';
        setTimeout(() => {
          this.gameEndCallback(true);
        }, 100);
      }
    },
    shouldMove(x, y, clickIndex) {
      //   判断向哪移动
      const {emptyX, emptyY} = this.seekEmpty();
      if (x === emptyX && y !== emptyY && Math.abs(y - emptyY) === 1) {
        this.clickIndex = clickIndex;
        // 说明在一个水平线上 可能是左右移动
        if (y > emptyY) {
          this.addClass('Right');
          this.moveLeft(x, y);
        } else {
          this.addClass('Left');
          this.moveRight(x, y);
        }
      }
      if (y === emptyY && x !== emptyX && Math.abs(x - emptyX) === 1) {
        this.clickIndex = clickIndex;
        // 说明需要上下移动
        if (x > emptyX) {
          this.addClass('Up');
          this.moveUp(x, y);
        } else {
          this.addClass('Down');
          this.moveDown(x, y);
        }
      }
      this.gameEnd();
    },
    // 随机打乱
    moveInit(diffic) {
      // this.arr = this.creatArr(this.gamedata.level);
      const num = diffic ? diffic : this.gamedata.difficulty;

      const fns = [this.moveUp, this.moveDown, this.moveLeft, this.moveRight];
      let Index = null;
      let fn;
      for (let i = 0; i < num; i++) {
        Index = Math.floor(Math.random() * fns.length);
        //   moveConsole(Index);
        fn = fns[Index](this.startX, this.startY);
        if (fn != -1) {
          const { x, y } = fn;
          this.startX = x;
          this.startY = y;
        }
      }
      // 如果随机结果和初始排序一样，重新打乱
      if (this.arr.toString() === this.resultJson) {
        console.log('重新打乱');
        this.moveInit(this.gamedata.difficulty);
      }
      this.num = 0;
    },
    // 点击滑块
    boxHandle(x, y, clickIndex) {
      if (!this.isStart) return false;
      this.shouldMove(x, y, clickIndex);
    },
    // 开始游戏
    gameStart(){
      this.isStart = true;
      this.moveInit(this.gamedata.difficulty);
    }
  },
};
</script>

<style lang="scss" scoped>
  ._game {
    width: 100%;
    height: 100%;
    .test {
      font-family: 'CookieRunBold';
      font-size: 50rpx;
      font-weight: 500;
    }
    .test2 {
      font-size: 50rpx;
    }
    .gameMain {
      background: #5a009b;
      border-radius: 10px;
      color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin: auto;

      .y-axis {
        display: flex;
        height: 30%;
        align-items: center;
        justify-content: space-evenly;
      }

      .x-axis {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: red;
        border-radius: 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .empty {
        background-color: transparent !important;
      }
    }
  }
</style>
