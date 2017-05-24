
/**
 * @class Momentum
 * @version 0.0.1-beta
 * @author Edgar Bermejo <hello@builtbyedgar.com>
 * @description Scroll momentum for all platforms.
 *
 * IMPORTANT: Curiously, when the Developer Tools have open, the body element
 * height property is not the correct.
 */

class Momentum {

  /**
   * @param {[DOMElement]}  element - The DOM Element we scroll
   * @param {[Object]}      options - Configuration options
   */
  constructor (element = null, options) {
    if (typeof element !== 'string') throw Error('Momentum Error: The provided selector for the scroll wrapper is not valid.')

    this.body = document.getElementsByTagName('body')[0]
    this.scroller = document.querySelector(element)
    this.easing = options.easing || 'cubic-bezier(0.19, 1, 0.22, 1)'  // ease out expo
    this.life = `${ options.life }s` || '0.8s'
    this.top = 0
    this.timeout = null
    this.delay = parseFloat(this.life.replace(/s/g, '') * 1000) + 250

    this.setProperties()
    this.improvePerformance()

    window.addEventListener('scroll', this.onScroll.bind(this), false)
    window.addEventListener('resize', this.onResize.bind(this), false)
    this.onResize()
  }


  /**
   * Set the properties needed to the scroller element and body to get the
   * scrolling effect
   */
  setProperties () {
    this.scroller.style.transition = 'transform ' + this.life + ' ' + this.easing
    this.scroller.style.position = 'fixed'
    this.scroller.style.top = '0'
    this.scroller.style.left = '0'
    this.scroller.style.width = '100%'
    this.scroller.style.padding = '0'
    this.scroller.style.zIndex = '2'
    this.scroller.style.display = 'block'
    this.scroller.style.transform = 'translateZ(0)'
    this.body.style.height = this.scroller.offsetHeight + 'px'
    this.body.style.overflow = 'auto'
  }


  /**
   * Set the properties needed to optimize the scroll effect performance
   */
  improvePerformance () {
    this.scroller.style.willChange = 'auto'
    this.scroller.style.pointerEvents = 'auto'
    this.scroller.style.backfaceVisibility = 'hidden'
    const imgs = document.querySelectorAll('img')
    for (let img of imgs) img.style.transform = 'translateZ(0)'
  }


  /**
   * Handles the scroll event
   */
  onScroll (event) {
    this.top = -(window.pageYOffset || document.documentElement.scrollTop)
    // NOTE: translate3d forcing hardware acceleration and is faster than translate and translateY
    this.scroller.style.transform = 'translate3d(0, ' + this.top + 'px, 0)'

    // NOTE: to improve performance
    this.scroller.style.willChange = 'transform'
    this.scroller.style.pointerEvents = 'none'
    // Check if scroll is stopped
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.scroller.style.willChange = 'auto'
      this.scroller.style.pointerEvents = 'auto'
    }, this.delay)
  }


  /**
   * Handles the resize event
   */
  onResize (event) {
    this.body.style.height = this.scroller.offsetHeight + 'px'
  }
}
