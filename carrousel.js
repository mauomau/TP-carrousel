const carousel = document.querySelector('.carousel-container')

class Carousel {
    /**
     * @callback moveCallbacks
     * @param {number} index
     */


    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} options.slideToScroll
     * @param {Object} options.slideVisble
     * @param {boolean} options.loop if loop at slide end
     */
    constructor(element, options={}) {
        this.element = element;
        // assign a default value for options parameter
        this.options = Object.assign({}, {
            slideToScroll: 1,
            slideVisble:1
        }, options);
        // to avoid node contraints, we need to manually set the children of element
        let children = [].slice.call(element.children);
        //here we initialize the curent position of the carousel
        this.currentItem = 0;
        this.root = this.createEle('div', {
            class: 'carousel'
        });
        this.container = this.createEle('div', {
            class: 'carousel-container'
        });
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.moveCallbacks = [];
        this.items = children.map((child) => {
            let item = this.createEle('div',{class: 'item'});
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        this.setStyle();
        this.createNavigation();
    }

    /**
     * set element's size
     */
    setStyle(){
        let ratio = this.items.length / this.options.slideVisble;
        this.container.style.width =( ratio * 100) + '%';
        this.items.forEach(item => {
            item.style.width = (100 / this.options.slideVisble) / ratio + '%';
            console.log(item.style.width);
        });
    }

    next() {
        if (this.currentItem < this.items.length - this.options.slideVisble) {
            this.goToItem(this.currentItem + this.options.slideToScroll);
        }
    }

    prev(){
        if (this.currentItem > 0) {
            this.goToItem(this.currentItem - this.options.slideToScroll);
        }
    }

    goToItem(index){
        // Ensure that this.currentItem won't be negative when scrolling backwards and over the last item displayed in the list item (this.items.length - this.options.slideVisble)
        this.currentItem = Math.max(0, Math.min(index, this.items.length - this.options.slideVisble));
        let translateX = -this.currentItem * (100 / this.items.length);
        this.container.style.transform = 'translate3d(' + translateX + '%,0,0)';
        this.currentItem = index;
        this.moveCallbacks.forEach(cb => cb(index))
    }


    /**
     * creates the navigation buttons
     */
    createNavigation(){
        this.prevBtn = this.createEle('div', {class:'carrousel-prev hidden'});
        this.nextBtn = this.createEle('div', {class:'carrousel-next'});
        this.element.prepend(this.prevBtn);
        this.element.appendChild(this.nextBtn);
        this.prevBtn.addEventListener('click', () =>{
            this.prev();
        });
            
        this.nextBtn.addEventListener('click', () => {
            this.next();
        });
        this.onMove(index => {
            if(index === 0){
                this.prevBtn.classList.add('hidden');
            } else {
                this.prevBtn.classList.remove('hidden');
            }
            if(this.items[this.currentItem + this.options.slideVisble]=== undefined){
                this.nextBtn.classList.add('hidden');
            }else{
                this.nextBtn.classList.remove('hidden');
            }
        })
    }

    /**
     * 
     * @param {moveCallbacks} cb 
     */
    onMove(cb){
        this.moveCallbacks.push(cb);
    }

    /**
     * 
     * @param {string} tagName 
     * @param {object} attribut 
     * @returns {HTMLElement}
     */
    createEle(tagName,attributes ={}){
        const element = document.createElement(tagName);
        // Add attributes to the element if provided in the attributes object
        for (const [attribute,value] of Object.entries(attributes)) {
            if(value !== null){
                element.setAttribute(attribute,value);
            }
        }
        return element;
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    const car = new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 2,
        slideVisble: 3,
        loop: false
    });
    console.log('car');
})
