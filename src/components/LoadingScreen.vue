<template>
    <div class="loadingScreen" ref="loadingScreen">
        <div class="wrapper">
            <h2>Loading</h2>
            <div class="progressBar">
                <div
                    class="progressFill"
                    :style="{ width: progress + '%' }"
                ></div>
            </div>

            <div class="progressUrl">{{ progressUrl }}</div>
        </div>
    </div> 
</template>

<script>
import LoadingController from '../classes/LoadingController'
export default {
    name: "LoadingScreen",
    data() {
        return  {
            progress: 0,
            progressUrl: "",
        }
    },
    mounted() {
        LoadingController.onProgress = this.onProgress;
        LoadingController.onLoad = this.onLoad;
    },
    methods: {
        onProgress(url, loaded, total) {
            this.progressUrl = url;
            this.progress = (loaded / total) * 100;

        },
        onLoad() {
            // console.log("Finished Loading");
            this.$refs.loadingScreen.classList.add('finished');

        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.loadingScreen {
    width: 100 vw;
    height: 100 vh;
    background: #151515;
    position: absolute;
    top: 0;
    left: 0;
    z-index 2;
    color: white;
    font-size: 2em;
    transition: all 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        h2 {
            margin-bottom: 20px;
        }

        .progressBar {
            width: 300px;
            height: 30px;
            background: black;

            .progressFill {
                width: 50%;
                height: 100%;
                background: purple;
                transition: width 0.2s;
            }
        }

        .progressUrl {
            color: grey;
            margin-top: 30px;
            font-size: 0.8em;
        }
    }

    &.finished {
        opacity: 0;
        pointer-events: none;
    }
}
</style>
