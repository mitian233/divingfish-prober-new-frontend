<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {proberMain} from "@/components";
import {ComponentInternalInstance, onMounted, getCurrentInstance} from "vue";
import {useStore , $requireLogin} from "@/store";
import {useToast} from "@/components/ui/toast";
import axios from "axios";
import {isDEBUG} from "@/main.ts";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {toast} = useToast();
const store = useStore();

import {afadian, qqChannel, maibot} from "@/lib/shareLinks";

import heroBg from '@/assets/img/hero_bg.jpeg';

const bgStyle = 'url(' + heroBg + ')';

const fetchMusicData = () => {
  store.chuniLoading = true;
  store.loading = true;
  toast({title: "正在获取乐曲信息……"});
  axios.get("https://www.diving-fish.com/api/chunithmprober/music_data")
      .then((resp) => {
        store.chuni_data = resp.data;
        store.chuni_data_dict = store.chuni_data.reduce((acc:Array<any>, music:any) => {
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
        toast({title:"乐曲信息获取失败，请重新加载！",description:'错误原因：' + error.response.message, variant: "destructive"});
      });
};

/*
const chuniRecordDisplay = () => {
  return store.chuni_records.filter((elem:any) => {
    return (
        this.$refs.filterSliderChuni.f(elem) &&
        (!store.proSettingChuni || this.$refs.proSettingsChuni.f(elem)))
  });
};

const sdDisplay = () => {
  return store.sdData.filter((elem:any) => {
    return (
        this.$refs.filterSlider.f(elem) &&
        (!store.proSetting || this.$refs.proSettings.f(elem))
    );
  });
};

const dxDisplay = () => {
  return store.dxData.filter((elem:any) => {
    return (
        this.$refs.filterSlider.f(elem) &&
        (!store.proSetting || this.$refs.proSettings.f(elem))
    );
  });
};
*/
onMounted(() => {
  history.replaceState("", "", window.location.pathname);
});

</script>

<template>
  <div class="hero hero_grass main">
    <div class="md:h-[70vh] h-screen md:px-10 flex flex-col justify-center items-center md:items-start">
      <h1 class="md:text-5xl text-2xl">
        <NGradientText gradient="linear-gradient(315deg, #d5aeff 25%, #fdfa77)" class="font-extrabold">舞萌 DX | 中二节奏查分器</NGradientText>
      </h1>
      <div class="flex mt-7 ">
        <Button v-on:click="$requireLogin.value = true;">开始使用</Button>
        <div class="w-4"/>
        <a href="#info"><Button variant="secondary">了解更多</Button></a>
        <div class="w-4"/>
        <a :href="qqChannel"><Button variant="outline">加入查分器 QQ 频道</Button></a>
      </div>
    </div>
  </div>
  <div class="main">
    <div class="mt-6 md:px-10" id="info">
      <NP>代理工具上线！使用微信客户端导入数据，请查看新版本的使用指南。</NP>
      <NP>想要 10 分钟搭建自己的 maimai QQ 机器人？现在就参考开源项目 <n-a :href="maibot">mai-bot</n-a> 吧~</NP>
      <NP>请开发者打一局 maimai 如何？帮助我们<n-a :href="afadian">发发电</n-a>好不好嘛~</NP>
      <NP>
        <NText type="info">迁移了数据库以加快网站的响应速度及后续开发。如遇任何无法导入成绩或出错的情况，请及时添加讨论群进行反馈。</NText>
      </NP>
    </div>
    <prober-main id="main" />
  </div>
  <div class="py-10 border-t border-border main flex justify-center" >
    <p>Made with ❤️ by <a href="https://www.diving-fish.com">Diving Fish</a></p>
    <a class="ml-3" href="https://space.bilibili.com/10322617"><img
      src="https://shields.io/badge/bilibili-%E6%B0%B4%E9%B1%BC%E5%96%B5%E5%96%B5%E5%96%B5-00A1D6?logo=bilibili&style=flat"></a>
  </div>
</template>

<style scoped>
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
