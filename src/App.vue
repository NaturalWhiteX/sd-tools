<template>
  <div id="app">
    <div id="appPage">
      <a-page-header
        :style="{ background: 'rgba(255,255,255,0.9)' }"
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
                <div class="matchDatabse">
                  <text>Tips：将鼠标悬浮在标签上试一试</text>
                  <a-button
                    @click="matchDatabase()"
                    :loading="buttonMatchLoading"
                    >匹配词库</a-button
                  >
                </div>
                <div class="tagBoxArea">
                  <a-space :wrap="true">
                    <template
                      v-for="(item, index) in ArrayPromptSelected"
                      :key="index"
                    >
                      <div class="boxItem">
                        <a-trigger
                          position="top"
                          auto-fit-position
                          :unmount-on-close="false"
                          :mouse-enter-delay="750"
                          :popup-translate="[0, -10]"
                        >
                          <template v-if="item.belongChildMenuID !== 'Z01'">
                            <div class="selectedTag flexCenter">
                              <text>
                                {{ item.promptName }}
                              </text>
                              <div
                                class="iconContent flexCenter"
                                @click="tagCloseClick(item)"
                              >
                                <icon-close class="closeButton"></icon-close>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div
                              class="selectedTag selectedTagUncollected flexCenter"
                            >
                              <text>
                                {{ item.promptName }}
                              </text>
                              <div class="iconContent flexCenter">
                                <icon-close
                                  @click="tagCloseClick(item)"
                                  class="closeButton"
                                ></icon-close>
                              </div>
                            </div>
                          </template>
                          <div
                            class="weightContent flexCenter"
                            v-show="
                              item.promptWeight && item.promptWeight !== 1
                            "
                          >
                            <a-tag color="arcoblue"
                              >{{ item.promptWeight }}</a-tag
                            >
                          </div>
                          <template #content>
                            <div class="triggerContent">
                              <a-space>
                                <text>设置权重</text>
                                <a-input-number
                                  v-model="item.promptWeight"
                                  :style="{ width: '90px' }"
                                  size="mini"
                                  placeholder="0~2"
                                  mode="button"
                                  :max="2"
                                  :min="0.1"
                                  step="0.1"
                                  :default-value='1'
                                  :precision="0.1"
                                />
                              </a-space>
                            </div>
                          </template>
                        </a-trigger>
                      </div>
                    </template>
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
      ArrayPromptDatabase: ArrayForMenuTemp.ArrayPrompt, //后台词库
      menuSelected: ["A"],
      childMenuSelected: "A01",
      isEditWeight: false,
      ArrayChildMenu: [
        //子菜单项
        {
          childMenuId: "",
          belongMenuId: "",
          childMenuName: "",
        },
      ],
      ArrayPromptShow: [
        //展示词库
        {
          promptUUID: "",
          belongChildMenuID: "",
          promptName: "",
          promptTranslation: "",
        },
      ],
      ArrayPromptSelected: [], //选中词库
      StringPromptInput: "",
      buttonMatchLoading: false,
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
      if (that.StringPromptInput.trim() === "") {
        return;
      }
      let tempStr = string.trim();
      if (tempStr.length !== 0) {
        tempStr = tempStr + ", ";
      }
      navigator.clipboard
        .writeText(tempStr)
        .then(() => {
          that.$message.info("已复制到剪切板");
        })
        .catch(() => {
          that.$message.warning(
            "复制失败！可能是浏览器版本太旧了，这个我暂时也没办法呢..."
          );
        });
    },

    tagCloseClick(prompt) {
      // 点击tag的叉叉，将删除此标签
      let that = this;
      that.ArrayPromptSelected = that.ArrayPromptSelected.filter(
        (item) => item.promptName !== prompt.promptName
      );

      let input = that.StringPromptInput;
      input = input.replace(prompt.promptName + ",", "");
      that.StringPromptInput = input;
      that.refreshPromptShow();
    },

    // 文本域失焦时, 将提示词串的提示词转化为标签放入选中词库，匹配展示词库控制高亮
    textareaBlur() {
      let that = this;

      // 如果文本域为空，直接清空选择数组和展示数组中的选中
      if (that.StringPromptInput.length === 0) {
        for (let i = 0; i < that.ArrayPromptShow.length; i++) {
          that.ArrayPromptShow[i].isChecked = false;
        }
        that.ArrayPromptSelected.length = 0; // 清空数组
        return;
      }

      // 如果文本域不为空，先将文本域的提示词串分割成字符串数组
      // let StringPrmoptArray = that.StringPromptInput.split(/[，,]/)
      //   .map((str) => str.trim())
      //   .filter(Boolean);

      let tempInputArray = that.analysisInputWeight(that.StringPromptInput);
      console.log('tempInputArray', tempInputArray)

      // 对于文本域中的每一个提示词
      let tempArrayPromptSelected = [];
      tempInputArray.forEach((item) => {
        let findIndex = -1;
        const foundPrompt = that.ArrayPromptShow.find(function (prompt, index) {
          // 在词库中寻找这个提示词，如果找到就提取出对象foundPrompt；如果找不到就将展示词库中的选中取消。
          findIndex = index;
          let result = false;
          if (prompt.promptName === item.promptName) {
            result = true;
          } else {
            that.ArrayPromptShow[index].isChecked = false;
          }
          return result;
        });
        if (foundPrompt) {
          // 如果该提示词在词库中找得到
          item = {
            promptUUID: foundPrompt.promptUUID,
            belongChildMenuID: foundPrompt.belongChildMenuID,
            promptName: foundPrompt.promptName,
            promptTranslation: foundPrompt.promptTranslation,
            promptWeight: item.promptWeight,
          };
          that.ArrayPromptShow[findIndex].isChecked = true;
        }
        tempArrayPromptSelected.push(item);
      });
      that.ArrayPromptSelected = tempArrayPromptSelected;
      that.refreshPromptShow();
    },
    analysisInputWeight(inputString) {
      let ArrayInputPrompt = [];
      let PromptArr = inputString
        .split(/[，,]/)
        .map((str) => str.trim())
        .filter(Boolean);
      for (let i = 0; i < PromptArr.length; i++) {
        let prompt = PromptArr[i].trim();
        let promptObj = {};
        promptObj.promptUUID = crypto.randomUUID();
        promptObj.belongChildMenuID = "";
        if (prompt.includes("(")) {
          let re = /(.*)\((.*):(.*)\)/; //正则表达式匹配
          let promptInfo = re.exec(prompt);
          promptObj.promptName = promptInfo[1].trim();
          promptObj.promptWeight = parseInt(promptInfo[3].split(".")[1]) || 0;
        } else {
          promptObj.promptName = prompt;
          promptObj.promptWeight = 0;
        }
        promptObj.promptTranslation = "";
        ArrayInputPrompt.push(promptObj);
      }
      return ArrayInputPrompt;
    },
    matchDatabase() {
      // 匹配后台词库
      let that = this;
      that.buttonMatchLoading = true; // 匹配按钮加载样式
      let promise = new Promise((resolve) => {
        setTimeout(() => {
          that.buttonMatchLoading = false;
          that.$message.info("匹配完毕");
          resolve("success");
        }, 1000);
      });

      let ArrayPromptDatabase = that.ArrayPromptDatabase;
      let ArrayPromptSelected = that.ArrayPromptSelected;
      promise
        .then(() => {
          ArrayPromptSelected.forEach((item) => {
            // 对于选中词库中的每一个提示词，在后台词库中匹配，匹配到就返回对象，没匹配到就返回undefine
            const foundPrompt = ArrayPromptDatabase.find(
              (prompt) => prompt.promptName === item.promptName
            );
            if (!foundPrompt) {
              // 如果找不到，修改相关信息
              let tempUUID = crypto.randomUUID();
              item.promptUUID = tempUUID;
              item.belongChildMenuID = "Z01";
            }
          });
          that.ArrayPromptSelected = ArrayPromptSelected;
        })
        .catch((error) => {
          that.$message.error(error);
        });
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

#appPage {
  /* background-color: #f7f7f7; */
  /* background: linear-gradient(to bottom,#f7f7f7,#f7f7f7,#c2935b,#d17777,#1867c0,#8282d6,#373c47); */
  /* background: linear-gradient(to bottom,#1867c0,#8282d6,#d17777,#c2935b,#4caf50); */
  background: linear-gradient(
    to bottom,
    #e8f0f9,
    #f3f3fb,
    #faf2f2,
    #f9f4ef,
    #edf7ee
  );
  background-size: 600% 600%;
  animation: background-animation 60s linear infinite;
}

h2 {
  color: #333333;
}

text {
  line-height: 24px;
}

::selection {
  background: #f7dbbf;
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

.arco-input-number-step-button {
  border-radius: 0px !important;
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

/* 背景变化 */

@keyframes background-animation {
  0% {
    background-position: top;
  }
  50% {
    background-position: bottom;
  }
  100% {
    background-position: top;
  }
}
</style>
