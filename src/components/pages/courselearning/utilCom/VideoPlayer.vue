<template>
  <video-player
    src="/src/assets/video/output1.mp4"
    @loadeddata="logtime($event)"
    controls
    :disablePictureInPicture="true"
    :playback-rates="[0.5, 1.0, 1.5, 2.0]"
    :volume="0.6"
  />
</template>
  
  <script>
import { defineComponent } from "vue";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";

export default defineComponent({
  components: {
    VideoPlayer,
  },
  data() {
    return {
      playingtime: "",
    };
  },
  methods: {
    //记录秒数
    logtime(playingtime) {
      this.playingtime = playingtime;
      console.log(playingtime);
    },
  },
});
</script>