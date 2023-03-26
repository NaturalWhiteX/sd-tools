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
            <template v-for="(item, index) in ArrayPromptShow" :key="index">
              <div
                class="promptTag cTransition"
                :class="{ promptTagChecked: item.isChecked === true }"
              >
                <a-space>
                  <a-checkbox
                    v-model="item.isChecked"
                    @change="checkBoxChange(index, item.isChecked)"
                  >
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
                    @click="copyToClipboard(item.promptName)"
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
        <transition>
          <div class="mainContent">
            <a-space direction="vertical" fill>
              <h2>标签暂存箱</h2>
              <a-space>
                <text>编辑权重</text>
                <a-switch disabled="" />
              </a-space>
              <div class="tagBoxArea">
                <a-space :wrap="true">
                  <div
                    class="boxItem"
                    v-for="(item, index) in ArrayPromptSelected"
                    :key="index"
                  >
                    <a-trigger
                      position="top"
                      auto-fit-position
                      :unmount-on-close="false"
                    >
                      <template v-if="item.belongChildMenuID !== 'Z01'">
                        <a-tag closable>{{ item.promptName }}</a-tag>
                      </template>
                      <template v-else>
                        <a-tag color="orange" closable>{{
                          item.promptName
                        }}</a-tag>
                      </template>
                      <div class="weightText"></div>
                      <template #content>
                        <div class="demo-basic">
                          {{ item.promptName }}
                          <a-empty />
                        </div>
                      </template>
                    </a-trigger>
                  </div>
                </a-space>
              </div>
              <transition name="transitonTranslateY">
                <div class="formatButtonContent" v-show="checkIncluded">
                  <text>
                    黄色标签为当前系统内暂未收录的标签，点击“一键收录”来快速收录!
                  </text>
                  <a-button style="margin-left: 12px">一键收录</a-button>
                </div>
              </transition>
            </a-space>
            <a-space class="generateTags" direction="vertical" fill>
              <a-space class="generateTagsTitle">
                <h2>生成提示词</h2>
                <a-space size="medium">
                  <a-popconfirm
                    content="确定要清空吗？"
                    type="warning"
                    @ok="clearTextArea()"
                  >
                    <a-button>清空</a-button>
                  </a-popconfirm>

                  <a-button
                    type="primary"
                    @click="copyToClipboard(StringPromptInput)"
                    >复制到剪切板</a-button
                  >
                </a-space>
              </a-space>

              <a-textarea
                v-model:model-value="StringPromptInput"
                placeholder="将提示词粘贴在这里可以自动识别"
                :auto-size="{ minRows: 10, maxRows: 15 }"
                @blur="textareaBlur()"
              />
              <div class="formatButtonContent">
                <text> 中文逗号全部变成英文逗号，每个逗号后加空格。 </text>
                <a-button style="margin-left: 12px" @click="formatString()"
                  >一键格式化</a-button
                >
              </div>
            </a-space>
          </div>
        </transition>
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
      menuSelected: ["A"],
      childMenuSelected: "A01",
      isEditWeight: false,
      ArrayChildMenu: [
        {
          childMenuId: "",
          belongMenuId: "",
          childMenuName: "",
        },
      ],
      ArrayPromptShow: [
        {
          promptUUID: "",
          belongChildMenuID: "",
          promptName: "",
          promptTranslation: "",
        },
      ],
      ArrayPromptSelected: [],
      StringPromptInput: "",
    };
  },
  computed: {
    checkIncluded() {
      return this.ArrayPromptSelected.some(
        (item) => item.belongChildMenuID === "Z01"
      );
    },
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
        return value.belongMenuId === that.menuSelected[0] ? true : false;
      });
    },
    filterPrompt() {
      // 根据 子菜单列表 过滤 提示词列表
      let that = this;
      that.ArrayPromptShow = that.ArrayForMenu.ArrayPrompt.filter((value) => {
        return value.belongChildMenuID === that.childMenuSelected
          ? true
          : false;
      });
      that.refreshPromptShow();
    },
    refreshPromptShow() {
      // 刷新提示词库的展示情况
      let that = this;
      that.ArrayPromptShow.forEach(function (item) {
        let foundItem = that.ArrayPromptSelected.find(function (selectedItem) {
          return selectedItem.promptName === item.promptName;
        });

        if (foundItem) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      });
    },

    checkBoxChange(index, checkStatus) {
      // 词库中的复选框改变时
      let that = this;
      let promptSelected = that.ArrayPromptShow[index];
      let promptSelectName = promptSelected.promptName;
      if (checkStatus === true) {
        // 如果：选中
        that.ArrayPromptSelected.push(promptSelected);
        // 拼接 prompt 字符串
        that.StringPromptInput += promptSelectName + ", ";
      } else {
        // 否则：取消
        that.ArrayPromptSelected = that.ArrayPromptSelected.filter(
          (item) => item.promptUUID !== promptSelected.promptUUID
        );
        // 删除指定 prompt
        let deleteLength = promptSelectName.length + 2;
        let deleteIndex = that.StringPromptInput.lastIndexOf(promptSelectName);
        let resultStr = that.StringPromptInput;
        resultStr =
          resultStr.substring(0, deleteIndex) +
          resultStr.substring(deleteIndex + deleteLength);
        that.StringPromptInput = resultStr;
      }
    },

    copyToClipboard(string) {
      let that = this;
      navigator.clipboard
        .writeText(string)
        .then(() => {
          that.$message.info("已复制到剪切板");
        })
        .catch(() => {
          that.$message.warning(
            "复制失败！可能是浏览器版本太旧了，这个我暂时也没办法呢..."
          );
        });
    },

    textareaBlur() {
      // 文本域失焦时, 匹配词库
      let that = this;
      if (that.StringPromptInput.length === 0) {
        // 如果文本域为空
        for (let i = 0; i < that.ArrayPromptShow.length; i++) {
          that.ArrayPromptShow[i].isChecked = false;
        }
        that.ArrayPromptSelected.length = 0; // 清空数组
        return;
      }
      // 如果文本域不为空
      let PromptArray = [];
      let StringPrmoptArray = that.StringPromptInput.split(/[，,]/)
        .map((str) => str.trim())
        .filter(Boolean);

      console.log(StringPrmoptArray);

      // 将库 ArrayPromptShow 中不在文本域的提示词取消勾选
      that.ArrayPromptShow.forEach(function (item) {
        if (!StringPrmoptArray.includes(item.promptName)) {
          item.isChecked = false;
        }
      });

      StringPrmoptArray.forEach((str) => {
        // 对于文本域中的每一个提示词
        let findIndex = -1;
        const foundPrompt = that.ArrayPromptShow.find(function (prompt, index) {
          // 在词库中寻找这个提示词
          findIndex = index;
          let result = false;
          if (prompt.promptName === str) {
            result = true;
          } else {
            that.ArrayPromptShow[index].isChecked = false;
          }
          return result;
        });
        let tempPrompt = {
          promptUUID: "",
          belongChildMenuID: "",
          promptName: str,
          promptTranslation: "",
          promptWeight: 1,
        };
        if (foundPrompt) {
          // 如果该提示词在词库中找得到
          tempPrompt = {
            promptUUID: foundPrompt.promptUUID,
            belongChildMenuID: foundPrompt.belongChildMenuID,
            promptName: str,
            promptTranslation: foundPrompt.promptTranslation,
          };
          console.log(findIndex);
          that.ArrayPromptShow[findIndex].isChecked = true;
        } else {
          // 如果找不到，创建一个新的 prompt 对象，并放入已选择的提示词库 ArrayPromptSelected 中
          let tempUUID = crypto.randomUUID();
          tempPrompt = {
            promptUUID: tempUUID,
            belongChildMenuID: "Z01",
            promptName: str,
            promptTranslation: "无翻译",
          };
        }
        PromptArray.push(tempPrompt);
      });

      that.ArrayPromptSelected = PromptArray;
      that.refreshPromptShow();
    },

    formatString() {
      // 格式化字符串
      let that = this;
      let tempStr = that.StringPromptInput;

      let tempStrFormatted = "";
      let tempStrArray = tempStr.split("\n");
      for (let i = 0; i < tempStrArray.length; i++) {
        let str = tempStrArray[i];
        // 1. 将中文逗号替换为英文逗号
        str = str.replace(/，/g, ",");
        // 2. 删除连续的空格
        str = str.replace(/\s+/g, " ");
        // 3. 删除逗号前后的空格
        str = str.replace(/\s*,\s*/g, ",");
        // 4. 如果多个逗号相连，只保留一个逗号
        str = str.replace(/,{2,}/g, ",");
        // 5. 如果一个逗号后面没有空格，添加一个空格
        str = str.replace(/,(?!\s)/g, ", ");
        tempStrFormatted += str.trim();
        if (i !== tempStrArray.length - 1) {
          tempStrFormatted += "\n";
        }
      }

      tempStr = tempStrFormatted;
      that.StringPromptInput = tempStr;
    },

    clearTextArea() {
      let that = this;
      that.StringPromptInput = "";
      that.ArrayPromptSelected.length = 0;
      that.refreshPromptShow();
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

text {
  line-height: 24px;
}

::selection {
  color: #333333;
  background: #fff0ce;
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
.arco-btn-size-mini {
  border-radius: 4px !important;
  height: 24px !important;
  box-shadow: none !important;
}

.arco-trigger-content {
  border-radius: 8px !important;
}

/* ========== 动画 ========== */

.cTransition {
  /* 工具 class */
  transition: all 0.25s;
}

.arco-space-item {
  transition: all 0.25s;
}
.arco-tag {
  transition: all 0.25s;
}

.transitonScale-enter-active,
.transitonScale-leave-active {
  transition: all 0.25s;
}

.transitonScale-enter-from,
.transitonScale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.transitonTranslateY-enter-active,
.transitonTranslateY-leave-active {
  transition: all 0.25s;
}

.transitonTranslateY-enter-from,
.transitonTranslateY-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
