<template>
  <div id="app">
    <div class="PickImage">
      <!-- 图片选择 -->
    </div>

    <div class="Picklist">
      <!-- 列表选择 -->
      <div class="menuLeft">
        <a-menu mode="vertical" :default-selected-keys="['图片属性']">
          <a-menu-item v-for="item in Array_MenuLeft" :key="item">
          {{ item }}
          </a-menu-item>
        </a-menu>
      </div>


    </div>
    <div class="TagProcessing">
      <!-- 标签处理 -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {
      Array_MenuLeft: ['图片属性', '头发','眼睛','身体','套装','上装','下装','鞋子','首饰']
    }
  },
  methods: {

  },
}
</script>

<style>
@import './assets/css/App.css';

#app {
  background-color: #F7F7F7;
  /* flex 布局 */
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: start;
}
</style>
