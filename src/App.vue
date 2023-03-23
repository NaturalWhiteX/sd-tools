<template>
  <div id="app">
    <div class="PickImage">
      <!-- 图示选择 -->
    </div>

    <a-row justify="center" gutter="24">
      <a-col class="Picklist" :span="12" style="padding-left: 0px">
        <a-row :wrap="false">
          <!-- 列表选择 -->
          <a-col flex="52px" class="menuLeft">
            <a-menu mode="vertical" :default-selected-keys="['画面']">
              <a-menu-item v-for="item in Array_MenuLeft" :key="item">
                {{ item }}
              </a-menu-item>
            </a-menu>
          </a-col>
          <a-col flex="auto" class="PickMain">
            <h2>画面整体属性</h2>
            <a-tabs default-active-key="0">
              <a-tab-pane key="0" title="常用" >
                <a-space wrap>
                  <div
                    class="promptTag"
                    v-for="(item, index) in Array_Tag"
                    :key="index"
                  >
                    <a-space>
                      <a-checkbox value="1"></a-checkbox>
                      <text>{{ item.name }}</text>
                      <text class="textTranslation">{{
                        item.translation
                      }}</text>
                    </a-space>
                  </div>
                </a-space>
              </a-tab-pane>
              <a-tab-pane key="1" title="光照">
                <a-space>
                  <a-tag>masterpiece 杰作</a-tag>
                  <a-tag>best quality 最好的质量</a-tag>
                </a-space>
              </a-tab-pane>
              <a-tab-pane key="2" title="风格">
                Content of Tab Panel 2
              </a-tab-pane>
              <a-tab-pane key="3" title="视角">
                Content of Tab Panel 3
              </a-tab-pane>
              <a-tab-pane key="4" title="其他">
                Content of Tab Panel 4
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </a-col>
      <a-col class="TagProcessing" :span="10">
        <!-- 标签处理 -->
        <text>something</text>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      Array_MenuLeft: [
        "画面",
        "头发",
        "眼睛",
        "身体",
        "套装",
        "上装",
        "下装",
        "鞋子",
        "首饰",
      ],

      Array_Tag: [
        {
          name: "masterpiece",
          translation: "杰作",
        },
        {
          name: "best quality",
          translation: "最好的质量",
        },
        {
          name: "extremely detailed CG unity 8k wallpaper",
          translation: "最高质量",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
@import "./assets/css/App.css";

#app {
  background-color: #f7f7f7;
}
.arco-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.arco-menu-item.arco-menu-selected {
  /* 更改菜单样式 */
  background-color: #2d5cf6 !important;
  color: #ffffff !important;
}
.arco-menu-inner {
  /* 让菜单左侧无间距 */
  padding: 4px 0 !important;
}
.arco-tabs-content .arco-tabs-content-list {
  /* 换行问题 */
  display: block !important;
}
.arco-tabs-tab-active .arco-tabs-tab-title {
  font-size: 18px;
}
.arco-tabs-nav-ink {
  height: 4px !important;
}

/* 动画 */
.customTransition {
  /* 工具 class */
  transition: all 0.25s;
}
.arco-tabs-tab{
  /* 标签页固定高度 */
  height: 48px;
}
.arco-tabs-tab-title{
  /* 标签页标题 */
  transition: all 0.25s;
}
.arco-tabs-content-list {
  /* 标签页内容切换动效 */
  transition: all 0.25s;
}

</style>
