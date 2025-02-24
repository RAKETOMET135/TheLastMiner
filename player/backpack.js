import { StringConverter } from "../utils/core/string_converter.js"
import { OreData, oresData } from "../data/ore_data.js"

const inventoryElement = document.querySelector("#inventory")
const inventoryHintElement = document.querySelector("#inventory-hint")
const minecart = document.querySelector("#minecart")
const sellData = document.querySelector("#sell-data")

let mainScript = NaN
async function callMainInvetoryRender() {
    mainScript = await import('../main.js')
    
    mainScript.renderInventoryContent()
} 

export class Backpack{
    constructor(){
        this._storage = []
        this._capacity = 10
    }

    addItem(item){
        this._storage.push(item)
    }

    addItemsFromNames(itemNames){
        itemNames.forEach(itemName => {
           this.addItem(itemName)
        })
    }

    getItemCount(){
        return this._storage.length
    }

    getCapacity(){
        return this._capacity
    }

    setCapacity(newCapacity){
        this._capacity = newCapacity
    }

    getAllItemsCost(){
        let totalCost = 0

        for (let i = 0; i < this._storage.length; i++){
            let itemName = this._storage[i]

            for (let j = 0; j < oresData.length; j++){
                let oreData = oresData[j]
    
                if (oreData.oreName !== itemName) continue

                totalCost += oreData.oreValue

                break
            }
        }

       return totalCost
    }

    getAllItemsImages(){
        let allImages = []

        for (let i = 0; i < this._storage.length; i++){
            let itemName = this._storage[i]

            for (let j = 0; j < oresData.length; j++){
                let oreData = oresData[j]
    
                if (oreData.oreName !== itemName) continue

                allImages.push(oreData.oreImageURL)

                break
            }
        }

       return allImages
    }

    getAllItemsNames(){
        let allNames = []

        for (let i = 0; i < this._storage.length; i++){
            let itemName = this._storage[i]

            for (let j = 0; j < oresData.length; j++){
                let oreData = oresData[j]
    
                if (oreData.oreName !== itemName) continue

                allNames.push(oreData.oreName)

                break
            }
        }

       return allNames
    }

    clearBackpack(){
        this._storage = []

        if (!mainScript){
            callMainInvetoryRender()
        }
        else{
            mainScript.renderInventoryContent()
        }
    }

    upgradeBackpack(newCapacity){
        this._capacity = newCapacity
    }

    getItemGroups(){
        let itemGroups = []

        this._storage.forEach(storageItem => {
            let itemGroupExists = false

            for (let i = 0; i < itemGroups.length; i++){
                let itemGroup = itemGroups[i]

                if (itemGroup[0] !== storageItem) continue

                itemGroupExists = true
                itemGroups[i][1] = itemGroup[1] + 1

                break
            }

            if (!itemGroupExists){
                let itemGroup = [storageItem, 1]

                itemGroups.push(itemGroup)
            }
        })

        return itemGroups
    }

    sellItems(isMinecartAnim, gamePlayerStats){
        if (isMinecartAnim || this.getItemCount() <= 0 || inventoryElement.style.visibility === "visible") return

        let cost = this.getAllItemsCost()

        gamePlayerStats.money += cost

        this.minecartAnimation(this.getAllItemsImages(), this.getAllItemsNames(), isMinecartAnim)

        this.clearBackpack()
    }

    minecartAnimation(oreImages, oreNames, isMinecartAnim){
        if (isMinecartAnim || this.getItemCount() <= 0 || inventoryElement.style.visibility === "visible") return
        isMinecartAnim = true

        inventoryHintElement.style.visibility = "hidden"

        const oresHolder = document.querySelector("#cart-ores")

        for (let i = 0; i < oreImages.length; i++) {
            let oreElement = document.createElement("img")
            oreElement.setAttribute("src", `Images/PixelArt/${oreImages[i]}`)
            oresHolder.append(oreElement)
        }

        minecart.style.animation = "minecart-sell 3s 1"

        setTimeout(() => {
            const sellDataContent = document.querySelector("#sell-data-content")

            let oreNameGroups = []
            let totalOrePrice = 0

            oreNames.forEach(oreName => {
                let groupExists = false

                for (let i = 0; i < oreNameGroups.length; i++) {
                    let oreNameGroup = oreNameGroups[i]

                    if (oreNameGroup[0] !== oreName) continue

                    groupExists = true
                    oreNameGroups[i][1] += 1

                    break
                }

                if (!groupExists) {
                    oreNameGroups.push([oreName, 1])
                }
            })

            while (sellDataContent.children.length > 0) {
                sellDataContent.firstChild.remove()
            }

            oreNameGroups.forEach(oreNameGroup => {
                let oreName = oreNameGroup[0]
                let oreAmount = oreNameGroup[1]
                let orePrice = OreData.getOrePrice(oreName) * oreAmount

                let abbrOrePrice = StringConverter.abbreviateNumber(orePrice, ",")

                let oreSellDataElement = document.createElement("p")
                sellDataContent.append(oreSellDataElement)
                oreSellDataElement.innerText = `${oreAmount}x ${oreName}  =>  $${abbrOrePrice}`

                totalOrePrice += orePrice
            })

            let abbrTotalOrePrice = StringConverter.abbreviateNumber(totalOrePrice, ",")

            let totalSellDataElement = document.createElement("p")
            sellDataContent.append(totalSellDataElement)
            totalSellDataElement.innerText = `Total: $${abbrTotalOrePrice}`


            while (oresHolder.children.length > 0) {
                oresHolder.firstChild.remove()
            }

            sellData.style.visibility = "visible"
        }, 1500)
    }
}