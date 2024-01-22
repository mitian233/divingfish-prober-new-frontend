<script setup lang="ts">
import { computed } from 'vue';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import Separator from "@/components/ui/separator/Separator.vue";

const props = defineProps(['handleOpen']);
const emit = defineEmits(['update:handleOpen']);

const isOpen = computed({
  get() {
    return props.handleOpen
  },
  set(value) {
    emit('update:handleOpen', value)
  }
});
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent class="h-screen overflow-auto">
      <SheetHeader>
        <SheetTitle>关于</SheetTitle>
      </SheetHeader>
      <p>前端版本: 0.0.0</p>
      <p>构建日期: </p>
      <p>后端版本: 0.0.0</p>
      <Separator class="my-3" />
      <p>MaimaiDX Prober Frontend Next</p>
      <p>Copyright ©2024 DivingFish</p>
      <p>Frontend design: Mikan</p>
      <Separator class="my-3" />
      <SheetTitle class="border-b">更新记录</SheetTitle>
      <p>
        2024/??/??
        （By 蜜柑）热烈庆祝查分器全新前端上线！本次更新从里到外给查分器全部重新换了个 UI，同时技术栈由原先的 Vue2 升级到了 Vue3+TypeScript，提高了玩家的使用体验与开发者后期维护舒适感。<br />
        2023/08/30
        （By 蜜柑）给中二查分器后端添加了数据清除功能，现在可以在前端将舞萌和中二的查分器数据同时清除，便于玩家自行解决中二数据导入后无法覆盖原数据的问题。<br />
        2023/01/22
        （By 蜜柑）大家新年快乐，除夕和春节两晚给中二节奏成绩表格肝（抄）了个导出成绩、谱面筛选和 OP 计算器（这个是自己写的）等功能。同时修复了一些前端的小 bug，并将成绩评级分数线修改成与中二节奏 NEW 现行分数线一致。<br />
        2022/10/24
        中二查分器来咯，1024程序员节快乐~<br />
        2021/11/25
        （By StageChan）又更了一大堆，包括查看封面按钮，修改密码功能，优化移动端网页体验等。<br />
        2021/11/07
        （By StageChan）更了一些网页计算器工具以及网页使用指南。<br />
        2021/09/28
        （By StageChan）更了一大堆，包括高级设置中的各种筛选、表列选择和暗色主题；DX分数相关；
        鼠标浮动在曲名和难度上显示谱面信息、浮动在DX Rating上显示后续分数线等等。修了一堆bug。<br />
        2021/09/06
        更新了查询牌子的功能。<br />
        2021/07/16
        更新了天界 2 的歌曲数据，以及相对难度从现在开始按照 SSS 的人数进行排名了。<br />
        2021/03/18
        加载动画和按难度/定数筛选，你们要的筛选来了。顺便加了个可以看全曲的功能。<br />
        2021/02/26 发布 1.0
        版本，添加了登出按钮，并优化了一些成绩导入方式。提供了代理服务器供便捷导入成绩。<br />
        2021/02/17 废弃了目前在使用的移动端（Vuetify さいこう！），导出为 csv
        增加了一个二次确认窗口。以及优化了所有的对话框。<br />
        2021/02/15 添加了导出为 csv
        的功能。在导入的页面源代码有问题时新增了报错提示。<br />
        2021/02/10 更改了UI。废弃了微信扫码登录的功能和导出为截图的功能。<br />
        2020/12/12
        大家都在买东西，我在加功能。增加了使用微信扫码导入数据的功能。<br />
        2020/09/26 修正了ENENGY SYNERGY MATRIX的乐曲定数，补充了セイクリッド
        ルイン的定数。增加了评级标签和FC/FS标签<br />
        2020/09/10
        教师节快乐！增加了登录、注册和数据同步的功能，增加了修改单曲完成率的功能，不需要再反复导入数据了<br />
        2020/09/02 增加了导出为截图的功能，增加了Session High⤴ 和
        バーチャルダム ネーション 的 Master 难度乐曲定数<br />
        2020/08/31 发布初版
      </p>
    </SheetContent>
  </Sheet>
</template>

<style scoped>

</style>
