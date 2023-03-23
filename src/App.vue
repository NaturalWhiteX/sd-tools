<template>
  <div id="app">
    <!-- 图示选择 -->
    <div class="PickImage"></div>

    <a-row justify="center" gutter="24">
      <a-col class="Picklist" :span="12" style="padding-left: 0px">
        <!-- 列表选择 -->
        <a-row :wrap="false">
          <a-col flex="80px" class="menuLeft">
            <a-menu
              mode="vertical"
              :default-selected-keys="[ArrayForMenu.ArrayMenu[0].menuId]"
              :selected-keys="menuSelected"
            >
              <!-- 菜单项 -->
              <a-menu-item
                v-for="(item, index) in ArrayForMenu.ArrayMenu"
                :key="item.menuId"
                @click="MenuClick(index)"
              >
                {{ item.menuName }}
              </a-menu-item>
            </a-menu>
          </a-col>
          <a-col flex="auto" class="PickMain">
            <h2>标签选购区</h2>
            <a-alert
              >操作说明：点击便签复选框将标签选入暂存箱，点击标签尾部图标复制到剪切板</a-alert
            >
            <!-- 标签页 -->
            <a-tabs
              :default-active-key="ArrayChildMenu[0].childMenuId"
              v-model:active-key="childMenuSelected"
              @change="ChildMenuClick()"
            >
              <div v-for="item in ArrayChildMenu" :key="item.childMenuId">
                <a-tab-pane
                  :key="item.childMenuId"
                  :title="item.childMenuName"
                >
                  <text>{{ item.childMenuId }}</text>
                  <!-- 标签 -->
                  <a-space wrap size="medium" style="padding-top: 12px">
                    <template
                      v-for="(item, indexPrompt) in ArrayPrompt"
                      :key="indexPrompt"
                    >
                      <div
                        class="promptTag customTransition"
                        :class="{ promptTagChecked: item.isChecked === true }"
                      >
                        <a-space>
                          <a-checkbox v-model="item.isChecked">
                            <a-space>
                              <text>{{ item.promptName }}</text>
                              <text class="textTranslation">{{
                                item.translation
                              }}</text>
                            </a-space>
                          </a-checkbox>
                          <a-button
                            type="text"
                            shape="circle"
                            @click="
                              () => this.$message.info('已复制此标签到剪切板')
                            "
                          >
                            <template #icon>
                              <template v-if="!item.isChecked">
                                <icon-copy :style="{ fontSize: '16px' }" />
                              </template>
                              <template v-else>
                                <icon-copy
                                  :style="{
                                    fontSize: '16px',
                                    color: '#ffffff',
                                  }"
                                />
                              </template>
                            </template>
                          </a-button>
                        </a-space>
                      </div>
                    </template>
                  </a-space>
                </a-tab-pane>
              </div>
            </a-tabs>
          </a-col>
        </a-row>
      </a-col>

      <!-- 标签处理 -->
      <a-col class="TagProcessing" :span="10">
        <div class="mainContent">
          <a-space direction="vertical" fill>
            <h2>标签暂存箱</h2>
            <a-space>
              <text>编辑权重</text>
              <a-switch disabled="" />
            </a-space>
            <div class="tagBoxArea"></div>
            <div class="formatButtonContent">
              <text
                >“黄色标签”为当前系统内暂未收录的标签，“一键收录”将收录这些黄色标签。</text
              >
              <a-button style="margin-left: 12px">一键收录</a-button>
            </div>
          </a-space>
          <a-space class="generateTags" direction="vertical" fill>
            <a-space class="generateTagsTitle">
              <h2>生成标签</h2>
              <a-space size="medium">
                <a-button>清空</a-button>
                <a-button
                  type="primary"
                  @click="() => this.$message.info('已复制全部内容到剪切板')"
                  >复制到剪切板</a-button
                >
              </a-space>
            </a-space>

            <a-textarea
              placeholder="将提示词粘贴在这里可以自动识别"
              :auto-size="{ minRows: 10, maxRows: 15 }"
            />
            <div class="formatButtonContent">
              <text>
                中文逗号全部变成英文逗号，每个逗号后加空格，识别所有标签至暂存箱。
              </text>
              <a-button style="margin-left: 12px">一键格式化</a-button>
            </div>
          </a-space>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as ArrayForMenuTemp from "./assets/js/ArrayForMenu.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      ArrayForMenu: ArrayForMenuTemp,
      menuSelected: "A",
      childMenuSelected: "A01",
      ArrayChildMenu: [
        {
          childMenuId: "",
          belongMenuId: "",
          childMenuName: "",
        },
      ],
      ArrayPrompt: [
        {
          promptUUID: "",
          belongChildMenuID: "",
          promptName: "",
          promptTranslation: "",
        },
      ],

      Array_Tag: [
        {
          name: "masterpiece",
          translation: "杰作",
          isChecked: true,
        },
        {
          name: "best quality",
          translation: "最好的质量",
          isChecked: false,
        },
        {
          name: "extremely detailed CG unity 8k wallpaper",
          translation: "最高质量",
          isChecked: false,
        },
      ],
    };
  },
  mounted() {
    let that = this;
    that.filterChildMenu();
    that.filterPrompt();
    console.log("ArrayChildMenu", that.ArrayChildMenu);
    console.log("ArrayPrompt", that.ArrayPrompt);
  },
  methods: {
    MenuClick(index) {
      let that = this;
      that.menuSelected = that.ArrayForMenu.ArrayMenu[index].menuId;
      that.filterChildMenu();
    },
    ChildMenuClick() {
      let that = this;
      let tempStr = that.childMenuSelected.substring(1);
      let index = parseInt(tempStr) - 1;
      that.childMenuSelected = that.ArrayChildMenu[index].childMenuId;
      that.filterPrompt();
    },
    filterChildMenu() {
      let that = this;
      that.ArrayChildMenu = that.ArrayForMenu.ArrayChildMenu.filter((value) => {
        return value.belongMenuId === that.menuSelected ? true : false;
      });
    },
    filterPrompt() {
      let that = this;
      that.ArrayPrompt = that.ArrayForMenu.ArrayPrompt.filter((value) => {
        return value.belongChildMenuID === that.childMenuSelected
          ? true
          : false;
      });
    },
  },
};
</script>

<style>
@import "./assets/css/App.css";

#app {
  background-color: #f7f7f7;
}

h2 {
  color: #333333;
}

.arco-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.arco-col {
  padding-right: 12px !important;
}
.arco-menu-item {
  padding-left: 24px !important;
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
  font-size: 16px;
  font-weight: bold;
}

.arco-tabs-nav-ink {
  height: 4px !important;
}

.arco-btn-text:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.arco-textarea-wrapper {
  border-radius: 8px !important;
}

.arco-textarea {
  padding-top: 12px !important;
}

.arco-btn {
  height: 44px !important;
  border-radius: 8px !important;
  font-weight: bold !important;
}
.arco-btn:hover {
  transition: all 0.5s;
}

.arco-btn-primary {
  box-shadow: 0px 4px 10px 0px rgba(54, 98, 236, 0.3);
}

/* ========== 动画 ========== */

.customTransition {
  /* 工具 class */
  transition: all 0.25s;
}

.arco-tabs-tab {
  /* 标签页固定高度 */
  height: 48px;
}

.arco-tabs-tab-title {
  /* 标签页标题 */
  /* transition: all 0.25s; */
  user-select: none;
}

.arco-tabs-content-list {
  /* 标签页内容切换动效 */
  transition: all 0.25s;
}
</style>
