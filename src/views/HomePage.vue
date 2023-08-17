<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Video App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div style="background-color: blue; display: none">
        <video ref="myVideo"></video>
        <canvas ref="myCanvas"></canvas>
      </div>
      <div style="display:flex; justify-content: center;">
        <div style ="display: flex; justify-content: center;">
          <ion-button style="border-style: solid; width: 200px; height: 100px;" @click="startCapture" v-if="!capturing">Start recording</ion-button>
          <ion-button style="border-style: solid; width: 200px; height: 100px;" @click="stopCapture" v-if="capturing">Stop recording</ion-button>
        </div>
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/vue';
import { defineComponent, ref, onMounted } from 'vue';
import { useMQTT } from 'mqtt-vue-hook'
import * as cv from 'opencv.js'
export default defineComponent({
    name: 'HomePage',
    components: { 
      IonContent, IonHeader, IonToolbar, IonPage, IonTitle, IonButton
    },
    mounted(){
        this.myVideo = this.$refs.myVideo
        this.myCanvas = this.$refs.myCanvas 
        this.capturing = false
    },
    methods:{
        startCapture() {            
            navigator.mediaDevices.getUserMedia({ video: true, audio: false, facingMode: 'environment'}).then(stream => {
              if(this.myVideo){
                this.myStream = stream;
                this.myVideo.srcObject = this.myStream;
                const playPromise = this.myVideo.play();
                if(playPromise !== undefined){
                  this.initCanvas()
                  this.capturing = true;
                }
              }           
                
            }).catch(error => {
                console.log(error);
            })
        },
        initCanvas(){
            this.myCanvas.setAttribute('width', 300)
            this.myCanvas.setAttribute('height', 400)
            const context = this.myCanvas.getContext('2d');
            let jpg_as_text;
            let data;
            this.interval = setInterval(() => {
                context.drawImage(this.myVideo, 0,0, 400, 300);
                jpg_as_text = this.myCanvas.toDataURL("image/jpeg").split(';base64,')[1];               
                this.mqttHook.publish("videoFrame",jpg_as_text);              
            }, 200);
        },
        stopCapture(){
            this.myStream.getTracks().forEach(function(track) {
                track.stop();
            });
            clearInterval(this.interval);            
            this.capturing = false;     
        },    
        
        
    },
    data() {        
        return{
            myVideo: null,
            myCanvas: null,            
            myStream: null,
            interval: null,
            capturing: null       
        }
    }, 

    setup () {

      const mqttHook = useMQTT(); 

      return {
        mqttHook
      };
    }
})

</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
