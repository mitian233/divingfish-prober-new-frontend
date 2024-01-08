<script setup lang="ts">
import {Button} from "@/components/ui/button";
import ProberMain from "@/components/proberMain.vue";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
</script>

<template>
  <div class="h-[50vh] flex flex-col justify-center items-center md:items-start md:px-10">
    <h1 class="md:text-5xl text-2xl font-extrabold text-gradient">舞萌 DX | 中二节奏查分器</h1>
    <div class="flex mt-7 ">
      <a href="#main"><Button>开始使用</Button></a>
      <div class="w-4"/>
      <a href="#info"><Button variant="secondary">了解更多</Button></a>
    </div>
  </div>
  <div class="mt-6 md:px-10" id="info">
    <p class="mb-2">点个 Star 吧！</p>
    <a href="https://github.com/Diving-Fish/maimaidx-prober"><img
        src="https://img.shields.io/github/stars/Diving-Fish/maimaidx-prober?style=social" /></a>
    <a class="ml-3" href="https://space.bilibili.com/10322617"><img
        src="https://shields.io/badge/bilibili-%E6%B0%B4%E9%B1%BC%E5%96%B5%E5%96%B5%E5%96%B5-00A1D6?logo=bilibili&style=flat"></a>
    <p class="mt-3">欢迎加入查分器<a href="https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&biz=ka&businessType=5&from=181075&inviteCode=20DoWXWylop&mainSourceId=qr_code&subSourceId=pic4&jumpsource=shorturl#/out">QQ频道</a>！</p>
    <p>代理工具上线！使用微信客户端导入数据，请查看新版本的使用指南。</p>
    <p>想要 10 分钟搭建自己的 maimai QQ 机器人？现在就参考开源项目 <a href="https://github.com/Diving-Fish/mai-bot">mai-bot</a> 吧~</p>
    <p>请开发者打一局 maimai 如何？帮助我们<a href="https://afdian.net/a/divingfish">发发电</a>好不好嘛~</p>
    <p style="color: #f44336">
      迁移了数据库以加快网站的响应速度及后续开发。如遇任何无法导入成绩或出错的情况，请及时添加讨论群进行反馈。
    </p>
  </div>
  <prober-main id="main" />
  <div class="mt-6 md:px-10">
    <Card>
      <CardHeader>
        <CardTitle>更新记录</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
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
      </CardContent>
    </Card>
  </div>
  <div class="mb-16" />
</template>

<style scoped>
.text-gradient {
  background-image: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
