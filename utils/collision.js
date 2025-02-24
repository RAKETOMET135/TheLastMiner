import { StringConverter } from "./core/string_converter.js"

export class Collision{
    static checkCollision(element_0, element_1){
        const rect_0 = element_0.getBoundingClientRect()
        const rect_1 = element_1.getBoundingClientRect()

        const collision = !(rect_0.right < rect_1.left || 
                            rect_0.left > rect_1.right || 
                            rect_0.bottom < rect_1.top || 
                            rect_0.top > rect_1.bottom)
        
        return collision
    }

    static getDistance(element_0, element_1){
        const element_0_computed_style = window.getComputedStyle(element_0)
        const element_1_computed_style = window.getComputedStyle(element_1)

        let diffX = StringConverter.floatFromPixelString(element_0_computed_style.left) - StringConverter.floatFromPixelString(element_1_computed_style.left)
        let diffY = StringConverter.floatFromPixelString(element_0_computed_style.top) - StringConverter.floatFromPixelString(element_1_computed_style.top)

        return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
    }
}