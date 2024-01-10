<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {proberMain} from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { $requireLogin } from "@/store/account.ts";
import {ComponentInternalInstance, onMounted, getCurrentInstance} from "vue";
import useStore from "@/store";
import {useToast} from "@/components/ui/toast";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {toast} = useToast();
const store = useStore();

import heroBg from '@/assets/img/hero_bg.jpeg';
import axios from "axios";
import {isDEBUG} from "@/main.ts";

const bgStyle = 'url(' + heroBg + ')';

const fetchMusicData = () => {
  store.chuniLoading = true;
  store.loading = true;
  toast({title: "正在获取乐曲信息……"});
  axios.get("https://www.diving-fish.com/api/chunithmprober/music_data")
      .then((resp) => {
        store.chuni_data = resp.data;
        store.chuni_data_dict = store.chuni_data.reduce((acc, music) => {
          acc[music.id] = music;
          return acc;
        },{});
        toast({title: "中二节奏乐曲信息获取完成，正在获取用户分数信息……"});
        axios.get(
            isDEBUG ? "https://www.diving-fish.com/api/chunithmprober/player/test_data" : "https://www.diving-fish.com/api/chunithmprober/player/records"
        ).then((resp) => {
          store.chuni_obj = resp.data;
          store.chuni_obj.records.best = store.chuni_obj.records.best.sort((a:any, b:any) => {return b.ra - a.ra});
          store.chuni_obj.records.r10 = store.chuni_obj.records.r10.sort((a:any, b:any) => {return b.ra - a.ra});
          store.chuni_records = JSON.parse(JSON.stringify(store.chuni_obj.records.r10));
          store.chuni_records = store.chuni_records.concat(JSON.parse(JSON.stringify(store.chuni_obj.records.best)));
          let rank:number = -10;
          for (let i of store.chuni_records) {
            i.rank = rank;
            rank++;
            if (rank == 0) rank++;
          }
          store.chuniLoading = false;
        }).catch((error) => {
          toast({
            title: "未获取用户分数",
            description: '错误原因：' + error.response.message,
            variant: 'destructive',
          })
        })
      })
  axios.get("https://www.diving-fish.com/api/maimaidxprober/music_data")
      .then((resp) => {
        store.music_data = resp.data;
        store.music_data_dict = store.music_data.reduce((acc:any, music:any) => {
          acc[music.id] = music;
          return acc;
        }, {});
        for (let elem of store.music_data)
          store.chart_combo[elem.id] = elem.charts.map((o:any) =>
              o.notes.reduce((prev:any, curr:any) => prev + curr)
          );
        toast({title:"舞萌 DX 乐曲信息获取完成，正在获取用户分数及相对难度信息……"});
        Promise.allSettled([
          axios.get(
              "https://www.diving-fish.com/api/maimaidxprober/chart_stats"
          ),
          axios.get(
              isDEBUG ? "https://www.diving-fish.com/api/maimaidxprober/player/test_data" : "https://www.diving-fish.com/api/maimaidxprober/player/records"
          ),
        ]).then(([resp1, resp2]) => {
          if (resp1.status === "rejected") {
            toast({title:"相对难度信息获取失败，请重新加载！",variant:"destructive"});
            store.loading = false;
            return;
          }
          store.chart_stats = resp1.value.data;
          if (resp2.status !== "rejected") {
            const data = resp2.value.data;
            store.username = data.username;
            store.merge(data.records);
            toast({title:"用户分数及相对难度信息获取完成"});
          } else {
            toast({title:"未获取用户分数"});
          }
          //this.$refs.pq.init();
          store.loading = false;
        });
      })
      .catch((error) => {
        toast({title:"乐曲信息获取失败，请重新加载！",description:'错误原因：' + error.response.message,variant:"destructive"});
      });
};

onMounted(() => {
  history.replaceState("", "", window.location.pathname);
});

</script>

<template>
  <div class="hero hero_grass main">
    <div class="md:h-[70vh] h-screen md:px-10 flex flex-col justify-center items-center md:items-start">
      <h1 class="md:text-5xl text-2xl font-extrabold text-gradient">舞萌 DX | 中二节奏查分器</h1>
      <div class="flex mt-7 ">
        <Button v-on:click="$requireLogin.value = true">开始使用</Button>
        <div class="w-4"/>
        <a href="#info"><Button variant="secondary">了解更多</Button></a>
      </div>
    </div>
  </div>
  <div class="main">
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
  </div>
  <div class="py-10 border-t border-border main flex justify-center" >
    <p>Made with ❤️ by <a href="www.diving-fish.com">Diving Fish</a></p>
  </div>
</template>

<style scoped>
.text-gradient {
  background-image: -webkit-linear-gradient(315deg, #d5aeff 25%, #fdfa77);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero {
  position: relative;
}

.hero::before {
  content: "";
  display: block;
  position: absolute;
  z-index: -2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: v-bind(bgStyle);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.hero_grass::before {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 1;
  backdrop-filter: blur(2px);
}
</style>
