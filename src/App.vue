<template>
  <div id="app">
    <a-page-header
      :style="{ background: 'var(--color-bg-2)' }"
      title="SD Tools"
      subtitle="Stable Diffusion 提示词助手"
      :show-back="false"
    >
      <template #extra>
        <a-radio-group type="button" default-value="large">
          <a-radio value="mini">Mini</a-radio>
          <a-radio value="small">Small</a-radio>
          <a-radio value="large">Large</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <!-- 图示选择 -->
    <div class="PickImage"></div>

    <div class="pageContainer">
      <div class="Picklist">
        <!-- 菜单 -->
        <div class="menuLeft">
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
        </div>

        <div class="PickMain">
          <!-- 子菜单 -->
          <div class="tabsChildMenu">
            <a-space size="large">
              <!-- 子菜单项 -->
              <div
                class="childMenuItem"
                v-for="(item, index) in ArrayChildMenu"
                :key="item.childMenuId"
                @click="ChildMenuClick(index)"
              >
                <text
                  class="titleChildMenu cTransition"
                  :class="{
                    titleChildMenuActived:
                      childMenuSelected === item.childMenuId,
                  }"
                  >{{ item.childMenuName }}</text
                >
              </div>
            </a-space>
          </div>
          <!-- 标签 -->
          <div class="tabsChildMenuContent">
            <template v-for="(item, index) in ArrayPrompt" :key="index">
              <div
                class="promptTag cTransition"
                :class="{ promptTagChecked: item.isChecked === true }"
              >
                <a-space>
                  <a-checkbox v-model="item.isChecked" @change="checkBoxChange()">
                    <a-space>
                      <text>{{ item.promptName }}</text>
                      <text class="textTranslation">{{
                        item.promptTranslation
                      }}</text>
                    </a-space>
                  </a-checkbox>
                  <a-button
                    type="text"
                    shape="circle"
                    @click="() => this.$message.info('已复制此标签到剪切板')"
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
                  <!-- 标签内的内容 end -->
                </a-space>
              </div>
            </template>
          </div>
          <!-- 标签 end -->
        </div>
        <!-- pickMain end -->
      </div>

      <!-- 标签处理 -->
      <div class="TagProcessing">
        <div class="mainContent">
          <a-space direction="vertical" fill>
            <h2>标签暂存箱</h2>
            <a-space>
              <text>编辑权重</text>
              <a-switch disabled="" />
            </a-space>
            <div class="tagBoxArea">
              <a-space size="medium" :wrap="true">
                <template
                  v-for="(item, index) in ArrayPromptSelected"
                  :key="index"
                >
                  <a-tag closable>{{item.promptName}}</a-tag>
                </template>
              </a-space>
            </div>
            <div class="formatButtonContent">
              <text
                >“黄色标签”为当前系统内暂未收录的标签，“一键收录”将收录这些黄色标签。</text
              >
              <a-button style="margin-left: 12px">一键收录</a-button>
            </div>
          </a-space>
          <a-space class="generateTags" direction="vertical" fill>
            <a-space class="generateTagsTitle">
              <h2>生成提示词</h2>
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
      </div>
    </div>
    <!-- pageContainer end -->
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
      ArrayPromptSelected: [],
    };
  },
  mounted() {
    let that = this;
    that.filterChildMenu();
    that.filterPrompt();
  },
  methods: {
    MenuClick(index) {
      // 菜单点击
      let that = this;
      that.menuSelected = that.ArrayForMenu.ArrayMenu[index].menuId;
      that.filterChildMenu();
      if (that.ArrayChildMenu.length === 0) {
        return;
      }
      that.childMenuSelected = that.ArrayChildMenu[0].childMenuId;
      that.filterPrompt();
    },
    ChildMenuClick(index) {
      // 子菜单点击
      let that = this;
      that.childMenuSelected = that.ArrayChildMenu[index].childMenuId;
      that.filterPrompt();
    },
    filterChildMenu() {
      // 根据 菜单列表 过滤 子菜单列表
      let that = this;
      that.ArrayChildMenu = that.ArrayForMenu.ArrayChildMenu.filter((value) => {
        return value.belongMenuId === that.menuSelected ? true : false;
      });
    },
    filterPrompt() {
      // 根据 子菜单列表 过滤 提示词列表
      let that = this;
      that.ArrayPrompt = that.ArrayForMenu.ArrayPrompt.filter((value) => {
        return value.belongChildMenuID === that.childMenuSelected
          ? true
          : false;
      });
    },
    checkBoxChange(){
      let that = this;
      let ArrayPromptSelected = []; 
      ArrayPromptSelected = that.ArrayPrompt.filter((value)=>{
        let result = false;
        if(value.isChecked && value.isChecked === true){
          result = true;
        }
        return result;
      })
      that.ArrayPromptSelected = ArrayPromptSelected;
    }
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

text {
  line-height: 24px;
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

.cTransition {
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
