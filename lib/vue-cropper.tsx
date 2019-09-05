import { Component, Model, Prop, Watch, Vue, Emit } from 'vue-property-decorator'

import { loadImg } from './common'

import './style/index.scss'

import { Layout } from './interface'

@Component({
  data() {
    return {}
  },
})
export default class VueCropper extends Vue {
  // 高清屏的问题
  ratio = window.devicePixelRatio

  $refs!: {
    canvas: HTMLCanvasElement
  }

  // 图片属性
  @Prop({
    default: '',
    type: String,
  })
  img!: string

  // 外层容器宽高
  @Prop({
    default: () => ({
      width: 200,
      height: 200,
    }),
    type: Object,
  })
  wrapper!: Layout

  @Watch('img')
  onImgChanged(val: string) {
    if (val) {
      this.checkedImg(val)
    }
  }

  created(): void {
    if (this.img) {
      this.checkedImg(this.img)
    }
  }

  @Emit()
  imgLoad(status: string): string {
    return status
  }

  // 检查图片, 修改图片为正确角度
  async checkedImg(url: string) {
    let img: HTMLImageElement
    try {
      img = await loadImg(url)
      this.imgLoad('success')
    } catch (error) {
      this.imgLoad('error')
      return false
    }
    console.log('img load success')
    // 图片加载成功之后的操作
    // CanvasRenderingContext2D
    const canvas: HTMLCanvasElement = this.$refs.canvas
    const ctx: any = canvas.getContext('2d')
    let { width, height } = { ...this.wrapper }
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    width = width * this.ratio
    height = height * this.ratio
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, (width / img.width) * img.height)
    return true
  }

  render() {
    return (
      <section class="vue-cropper">
        <canvas class="cropper-canvas" ref="canvas" />
      </section>
    )
  }
}
