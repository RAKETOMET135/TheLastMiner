import { StringConverter } from "./utils/core/string_converter.js"
import { Random } from "./utils/core/random.js"
import { Collision } from "./utils/collision.js"
import { Particle } from "./utils/particle.js"
import { PromptMenu } from "./utils/prompt_menu.js"
import { OreAlert } from "./utils/ore_alert.js"
import { SelectionBox } from "./utils/selection_box.js"
import { DarknessEffect } from "./utils/darkness_effect.js"
import { OreData, oresData } from "./data/ore_data.js"
import { TileMap, TileMapRenderer } from "./tiles/tile_map.js"
import { PlayerData } from "./player/player_data.js"
import { Backpack } from "./player/backpack.js"
import { SavingSystem } from "./data/saving_system.js"

const gameHolderElement = document.querySelector("#game-holder")
const loading = document.querySelector("#loading")
const loadingText = document.querySelector("#loading-text")
const blocks = document.querySelector("#blocks")
const sellHint = document.querySelector("#minecart-hint")
const minecart = document.querySelector("#minecart")
const inventoryElement = document.querySelector("#inventory")
const inventoryHintElement = document.querySelector("#inventory-hint")
const inventoryItemInfo = document.querySelector("#inv-item-info")
const inventoryPlaceInteraction = document.querySelector("#inv-interaction2")
const inventoryUseInteraction = document.querySelector("#inv-interaction3")
const inventoryEquipInteraction = document.querySelector("#inv-interaction4")
const sellData = document.querySelector("#sell-data")
const shopHintElement = document.querySelector("#shop-trigger")
const shop = document.querySelector("#shop")
const rescueHintElement = document.querySelector("#rescue-hint")
const liftStat = document.querySelector("#lift-stat")
const liftStatText = document.querySelector("#lift-stat-text")
const grapplingHookInfo = document.querySelector("#grappling-hook-info")
const statToolFuelBarHolder = document.querySelector("#fuel-bar-holder")
const statToolFuelBar = document.querySelector("#fuel-bar")
const earlyAccess = document.querySelector("#early-access")
let playerData
let backpack
let darknessEffect
let tileMapRenderer
let oreAlert
let isPickaxeAnim = false
let isMinecartAnim = false
let cameraY = 0
let cameraX = 0
let dataLoaded = false

class GamePlayerStats{
    constructor(){
        this._money = 0
        this._pickaxeIndex = 0
        this._pickaxeDamage = 1
        this._oilLampIndex = 0
        this._backpackIndex = 0
        this._liftCount = 0
        this._totalLifts = 0
        this._liftCountMetal = 0
        this._totalLiftsMetal = 0
        this._tBombs = 0
        this._totalTBombs = 0
        this._lineBombs = 0
        this._totalLineBombs = 0
        this._shaftBombs = 0
        this._totalShaftBombs = 0
        this._grapplingHookIndex = 0
        this._drillIndex = 0
        this._drillDamage = 0
        this._drillCapacity = 5
        this._drillFuel = 5
        this._drillFuelTankIndex = 0

        this._equippedToolType = "pickaxe"
    }

    getShaftBombPrice(){
        let price = 0

        switch(this._totalShaftBombs){
            case 0:
            case 1:
            case 2:
                price = 50000
                break
            case 3:
            case 4:
            case 5:
                price = 125000
                break
            case 6:
            case 7:
            case 8:
                price = 250000
                break
            case 9:
            case 10:
            case 11:
                price = 500000
                break
            default:
                price = 1000000
                break
        }

        return price
    }

    getLineBombPrice(){
        let price = 0

        switch(this._totalLineBombs){
            case 0:
            case 1:
            case 2:
                price = 50000
                break
            case 3:
            case 4:
            case 5:
                price = 125000
                break
            case 6:
            case 7:
            case 8:
                price = 250000
                break
            case 9:
            case 10:
            case 11:
                price = 500000
                break
            default:
                price = 1000000
                break
        }

        return price
    }

    getTBombPrice(){
        let price = 0

        switch(this._totalTBombs){
            case 0:
            case 1:
            case 2:
                price = 5000
                break
            case 3:
            case 4:
            case 5:
                price = 25000
                break
            case 6:
            case 7:
            case 8:
                price = 85000
                break
            case 9:
            case 10:
            case 11:
                price = 250000
                break
            default:
                price = 500000
                break
        }

        return price
    }

    getLiftPrice(){
        let price = 0

        switch (this._totalLifts){
            case 0:
                price = 1000
                break
            case 1:
                price = 2000
                break
            case 2:
                price = 2500
                break
            case 3:
                price = 3000
                break
            case 4:
                price = 3500
                break
            case 5:
                price = 4000
                break
            case 6:
                price = 4500
                break
            case 7:
                price = 5000
                break
            case 8:
                price = 5500
                break
            case 9:
                price = 6000
                break
            case 10:
                price = 6500
                break
            case 11:
                price = 7000
                break
            case 12:
                price = 8000
                break
            case 13:
                price = 9000
                break
            case 14:
                price = 10000
                break
            case 15:
                price = 15000
                break
            case 16:
                price = 20000
                break
            case 17:
                price = 25000
                break
            case 18:
                price = 30000
                break
            case 19:
                price = 35000
                break
            case 20:
                price = 40000
                break
            case 21:
                price = 45000
                break
            case 22:
                price = 50000
                break
            case 23:
                price = 100000
                break
            case 24:
                price = 150000
                break
            case 25:
                price = 200000
                break
            case 26:
                price = 250000
                break
            case 27:
                price = 300000
                break
            case 28:
                price = 350000
                break
            case 29:
                price = 400000
                break
            case 30:
                price = 450000
                break
            case 31:
                price = 500000
                break
            case 32:
                price = 1000000
                break
            case 33:
                price = 1500000
                break
            case 34:
                price = 2000000
                break
            case 35:
                price = 2500000
                break
            case 36:
                price = 3000000
                break
            case 37:
                price = 3500000
                break
            case 38:
                price = 4000000
                break
            case 39:
                price = 4500000
                break
            case 40:
                price = 5000000
                break
            default:
                price = 10000000
                break
        }

        return price
    }

    getLiftMetalPrice(){
        let price = 0

        switch (this._totalLiftsMetal){
            case 0:
                price = 1000
                break
            case 1:
                price = 2000
                break
            case 2:
                price = 2500
                break
            case 3:
                price = 3000
                break
            case 4:
                price = 3500
                break
            case 5:
                price = 4000
                break
            case 6:
                price = 4500
                break
            case 7:
                price = 5000
                break
            case 8:
                price = 5500
                break
            case 9:
                price = 6000
                break
            case 10:
                price = 6500
                break
            case 11:
                price = 7000
                break
            case 12:
                price = 8000
                break
            case 13:
                price = 9000
                break
            case 14:
                price = 10000
                break
            case 15:
                price = 15000
                break
            case 16:
                price = 20000
                break
            case 17:
                price = 25000
                break
            case 18:
                price = 30000
                break
            case 19:
                price = 35000
                break
            case 20:
                price = 40000
                break
            case 21:
                price = 45000
                break
            case 22:
                price = 50000
                break
            case 23:
                price = 100000
                break
            case 24:
                price = 150000
                break
            case 25:
                price = 200000
                break
            case 26:
                price = 250000
                break
            case 27:
                price = 300000
                break
            case 28:
                price = 350000
                break
            case 29:
                price = 400000
                break
            case 30:
                price = 450000
                break
            case 31:
                price = 500000
                break
            case 32:
                price = 1000000
                break
            case 33:
                price = 1500000
                break
            case 34:
                price = 2000000
                break
            case 35:
                price = 2500000
                break
            case 36:
                price = 3000000
                break
            case 37:
                price = 3500000
                break
            case 38:
                price = 4000000
                break
            case 39:
                price = 4500000
                break
            case 40:
                price = 5000000
                break
            default:
                price = 10000000
                break
        }

        return price * 4
    }

    getPickaxeData(index){
        if (index === 0){
            return [1, "SilverPickaxe.png", "Silver pickaxe", 0]
        }
        else if (index === 1){
            return [2, "CopperPickaxe.png", "Copper pickaxe", 250]
        }
        else if (index === 2){
            return [3, "IronPickaxe.png", "Iron pickaxe", 1500]
        }
        else if (index === 3){
            return [5, "GoldenPickaxe.png", "Golden pickaxe", 4500]
        }
        else if (index === 4){
            return [10, "DiamondPickaxe.png", "Diamond pickaxe", 10000]
        }
        else if (index === 5){
            return [15, "EmeraldPickaxe.png", "Emerald pickaxe", 25000]
        }
        else if (index === 6){
            return [25, "AmethystPickaxe.png", "Amethyst pickaxe", 45000]
        }
        else if (index === 7){
            return [40, "MagmaPickaxe.png", "Magma pickaxe", 90000]
        }
        else if (index === 8){
            return [80, "GarnetPickaxe.png", "Garnet pickaxe", 225000]
        }
        else if (index === 9){
            return [160, "OpalPickaxe.png", "Opal pickaxe", 625000]
        }
        else if (index === 10){
            return [320, "SapphirePickaxe.png", "Sapphire pickaxe", 1325000]
        }
        else if (index === 11){
            return [640, "TopazPickaxe.png", "Topaz pickaxe", 2800000]
        }
        else if (index === 12){
            return [960, "TourmalinePickaxe.png", "Tourmaline pickaxe", 5500000]
        }
        else if (index === 13){
            return [1920, "ZirconPickaxe.png", "Zircon pickaxe", 12000000]
        }
        else if (index === 14){
            return [3840, "ChrysoberylPickaxe.png", "Chrysoberyl pickaxe", 25000000]
        }
        else if (index === 15){
            return [7680, "AzuritePickaxe.png", "Azurite pickaxe", 45000000]
        }
        else if (index === 16){
            return [15360, "MalachitePickaxe.png", "Malachite pickaxe", 99999999]
        }

        return NaN
    }

    getOilLampData(index){
        if (index === 0){
            return [5, "OilLamp.png", "Small oil lamp", 0, "LightMask.png"]
        }
        else if (index === 1){
            return [6.5, "OilLampAverage.png", "Average oil lamp", 250]
        }
        else if (index === 2){
            return [8, "OilLampMedium.png", "Medium oil lamp", 900, "LightMaskMedium.png"]
        }
        else if (index === 3){
            return [10, "OilLampBig.png", "Big oil lamp", 7500]
        }
        else if (index === 4){
            return [12, "OilLampLarge.png", "Large oil lamp", 50000]
        }
        else if (index === 5){
            return [15, "OilLampExtraLarge.png", "Extra large oil lamp", 950000]
        }
        else if (index === 6){
            return [20, "OilLampGigantic.png", "Gigantic oil lamp", 25000000]
        }
        else if (index === 7){
            return [25, "OilLampGargantuan.png", "Gargantuan oil lamp", 75000000]
        }

        return NaN
    }

    getBackpackData(index){
        if (index === 0){
            return [10, "Backpack.png", "Small backpack", 0]
        }
        else if (index === 1){
            return [15, "AverageBackpack.png", "Average backpack", 1250]
        }
        else if (index === 2){
            return [20, "MediumBackpack.png", "Medium backpack", 2750]
        }
        else if (index === 3){
            return [25, "BigBackpack.png", "Big backpack", 6000]
        }
        else if (index === 4){
            return [30, "LargeBackpack.png", "Large backpack", 35000]
        }
        else if (index === 5){
            return [40, "ExtraLargeBackpack.png", "Extra large backpack", 550000]
        }
        else if (index === 6){
            return [50, "GiganticBackpack.png", "Gigantic backpack", 3500000]
        }
        else if (index === 7){
            return [75, "GargantuanBackpack.png", "Gargantuan backpack", 20000000]
        }

        return NaN
    }

    getGrapplingHookData(index){
        if (index === 1){
            return [3, "GrapplingHook.png", "GrapplingHookRope.png", "Grappler", 3250]
        }
        else if (index === 2){
            return [5, "GrapplingHookIron.png", "GrapplingHookIronRope.png", "Iron grappler", 250000]
        }
        else if (index === 3){
            return [7, "GrapplingHookMalachite.png", "GrapplingHookMalachiteRope.png", "Malachite grappler", 12500000]
        }

        return NaN
    }

    getDrillData(index){
        if (index === 1){
            return [10240, "Drill.png", "Drill", 0]
        }

        return NaN
    }

    getDrillFuelTankData(index){
        if (index === 0){
            return [5, "SmallFuelTank.png", "Small fuel tank", 0]
        }
        else if (index === 1){
            return [10, "MediumFuelTank.png", "Medium fuel tank", 5000000]
        }

        return NaN
    }

    _equipOilLamp(){
        let oilLampData = this.getOilLampData(this._oilLampIndex)

        darknessEffect.maxSize = oilLampData[0]
        darknessEffect._changeSize()
    }

    _equipPickaxe(){
        const toolImg = playerData._playerTool
        const equippedPickaxeImage = document.querySelector("#equipped-pickaxe")

        let pickaxeData = this.getPickaxeData(this._pickaxeIndex)
        toolImg.setAttribute("src", "Images/PixelArt/" + pickaxeData[1])
        this._pickaxeDamage = pickaxeData[0]
        this._equippedToolType = "pickaxe"
        isPickaxeAnim = false

        equippedPickaxeImage.setAttribute("src", "Images/PixelArt/" + pickaxeData[1])
        statToolFuelBarHolder.style.visibility = "hidden"
    }

    _equipDrill(){
        const toolImg = playerData._playerTool
        const equippedPickaxeImage = document.querySelector("#equipped-pickaxe")

        let drillData = this.getDrillData(this._drillIndex)
        toolImg.setAttribute("src", "Images/PixelArt/" + drillData[1])
        this._drillDamage = drillData[0]
        this._equippedToolType = "drill"

        equippedPickaxeImage.setAttribute("src", "Images/PixelArt/" + drillData[1])
        statToolFuelBarHolder.style.visibility = "visible"

        this._updateStatToolFuelBar()
    }

    _updateStatToolFuelBar(){
        if (gamePlayerStats.equippedToolType === "drill"){
            let barSize = (48 / gamePlayerStats.drillCapacity) * gamePlayerStats.drillFuel
            if (barSize < 0) barSize = 0

            statToolFuelBar.style.height = barSize + "px"
        }
    }

    _updateDrillFuelTank(){
        let drillFuelTankData = this.getDrillFuelTankData(this.drillFuelTankIndex)

        this.drillCapacity = drillFuelTankData[0]
        if (this.drillFuel > this.drillCapacity){
            this.drillFuel = this.drillCapacity
        }

        this._updateStatToolFuelBar()
    }

    _equipBackpack(){
        const equippedBackpackImage = document.querySelector("#equipped-backpack")

        let backpackData = this.getBackpackData(this._backpackIndex)

        equippedBackpackImage.setAttribute("src", "Images/PixelArt/" + backpackData[1])
        backpack.setCapacity(backpackData[0])
    }

    get money(){
        return this._money
    }

    set money(amount){
        this._money = amount
    }

    get pickaxeIndex(){
        return this._pickaxeIndex
    }

    set pickaxeIndex(newPickaxeIndex){
        this._pickaxeIndex = newPickaxeIndex
        this._equipPickaxe()
    }

    get oilLampIndex(){
        return this._oilLampIndex
    }

    set oilLampIndex(newOilLampIndex){
        this._oilLampIndex = newOilLampIndex
        this._equipOilLamp()
    }

    get backpackIndex(){
        return this._backpackIndex
    }

    set backpackIndex(newBackpackIndex){
        this._backpackIndex = newBackpackIndex
        this._equipBackpack()
    }

    get pickaxeDamage(){
        return this._pickaxeDamage
    }

    get grapplingHookIndex(){
        return this._grapplingHookIndex
    }

    set grapplingHookIndex(newGrapplingHookIndex){
        this._grapplingHookIndex = newGrapplingHookIndex
    }

    get drillIndex(){
        return this._drillIndex
    }

    set drillIndex(newDrillIndex){
        this._drillIndex = newDrillIndex
        this._equipDrill()
    }

    get equippedToolType(){
        return this._equippedToolType
    }

    get drillDamage(){
        return this._drillDamage
    }

    get drillFuel(){
        return this._drillFuel
    }

    set drillFuel(newDrillFuel){
        this._drillFuel = newDrillFuel
    }

    get drillCapacity(){
        return this._drillCapacity
    }

    set drillCapacity(newDrillCapacity){
        this._drillCapacity = newDrillCapacity
    }

    get drillFuelTankIndex(){
        return this._drillFuelTankIndex
    }

    set drillFuelTankIndex(newDrillFuelTankIndex){
        this._drillFuelTankIndex = newDrillFuelTankIndex
        this._updateDrillFuelTank()
    }
}
let gamePlayerStats = new GamePlayerStats()

darknessEffect = new DarknessEffect()
oreAlert = new OreAlert()

let selectionBox = new SelectionBox()
let promptMenu = new PromptMenu()

backpack = new Backpack()
playerData = new PlayerData()

let mainTileMap = new TileMap(30,  1505, 75, [-75, 0], selectionBox, playerData)
tileMapRenderer = new TileMapRenderer(mainTileMap, playerData)
mainTileMap._tileMapRenderer = tileMapRenderer
playerData._tileMap = mainTileMap
playerData._gamePlayerStats = gamePlayerStats
playerData._backpack = backpack

function generateBaseTilesData(){
    let totalOrePrice = 0

    /*
    let toUpdateCaveTilePositions = []
    for (let i = 0; i < 1000; i++){
        let y = Random.getNumber(0, mainTileMap.height -1)
        let x = Random.getNumber(0, mainTileMap.width - 1)

        let caveTilePositions = []
        caveTilePositions.push([x, y])

        for (let j = 0; j < 5; j++){
            let tile = caveTilePositions[Random.getNumber(0, caveTilePositions.length - 1)]
            let variant = Random.getNumber(0, 3)

            switch (variant){
                case 0:
                    caveTilePositions.push([tile[0] +1, tile[1]])
                    break
                case 1:
                    caveTilePositions.push([tile[0] -1, tile[1]])
                    break
                case 2:
                    caveTilePositions.push([tile[0], tile[1] +1])
                    break
                default:
                    caveTilePositions.push([tile[0], tile[1] -1])
                    break
            }
        }

        for (let j = 0; j < caveTilePositions.length; j++){
            let tile = caveTilePositions[j]

            if (tile[0] < 0 || tile[0] > mainTileMap.width - 1) continue
            if (tile[1] < 0 || tile[1] > mainTileMap.height - 1) continue
            if (tile[1] < 15 || Math.abs(tile[1] - 500) < 15 || Math.abs(tile[1] - 1000) < 15) continue

            mainTileMap.setTile(tile[0], tile[1], -1)
            mainTileMap.createVisualTile(tile[0], tile[1])

            toUpdateCaveTilePositions.push(tile)
        }
    }
    */
        
    for (let y = 5; y < mainTileMap.height; y++){
        if (y === 496 + 4 || y === 497 + 4 || y === 498 + 4 || y === 499 + 4 || y === 500 + 4){
            continue
        }
        if (y === 996 + 4 || y === 997 + 4 || y === 998 + 4 || y === 999 + 4 || y === 1000 + 4){
            continue
        }

        for (let x = 0; x < mainTileMap.width; x++){
            //if (x === 1 && y === 5 || x === 2 && y === 5 || x === 2 && y === 6 || x === 3 && y === 6 || x === 4 && y === 6) continue

            let tileData = mainTileMap.getTileData(x, y)

            if (tileData === -1){
                mainTileMap.setTile(x, y, 0)
                continue
            }

            mainTileMap.setTile(x, y, 1)
        }
    }

    /*
    for (let i = 0; i < toUpdateCaveTilePositions.length; i++){
        let tile = toUpdateCaveTilePositions[i]

        tileMapRenderer.updateTileConnection(tile[0], tile[1])
    }
    */


    for (let y = 5; y < mainTileMap.height; y++){
        for (let x = 0; x < mainTileMap.width; x++){
            if (mainTileMap.getTileData(x, y) === 0) continue

            let oreSpawnChance = 0

            if (y < 25){
                oreSpawnChance = Random.getNumber(0, 17)
            }
            else if (y < 50){
                oreSpawnChance = Random.getNumber(0, 15)
            }
            else if (y < 200){
                oreSpawnChance = Random.getNumber(0, 13)
            }
            else if (y < 750){
                oreSpawnChance = Random.getNumber(0, 11)
            }
            else if (y < 1250){
                oreSpawnChance = Random.getNumber(0, 9)
            }
            else if (y < 1450){
                oreSpawnChance = Random.getNumber(0, 7)
            }
            else if (y <= 1500){
                oreSpawnChance = Random.getNumber(0, 5)
            }
            else{
                oreSpawnChance = Random.getNumber(0, 100)
            }

            if (oreSpawnChance !== 0){
                if (y < 100){
                    if (0 !== Random.getNumber(0, 100)) continue
                }
                else if (y < 250){
                    if (0 !== Random.getNumber(0, 95)) continue
                }
                else if (y < 500){
                    if (0 !== Random.getNumber(0, 90)) continue
                }
                else if (y < 750){
                    if (0 !== Random.getNumber(0, 80)) continue
                }
                else if (y < 1000){
                    if (0 !== Random.getNumber(0, 70)) continue
                }
                else if (y < 1250){
                    if (0 !== Random.getNumber(0, 60)) continue
                }
                else if (y < 1500){
                    if (0 !== Random.getNumber(0, 50)) continue
                }
                else{
                    if (0 !== Random.getNumber(0, 1)) continue
                }
                
                if (Math.abs(y - 500) < 10 || Math.abs(y - 100) < 10 || y < 20) continue

                mainTileMap.setTile(x, y, 100)

                continue
            }

            let possibleOres = []
            let totalChance = 0

            for (let i = 0; i < oresData.length; i++){
                const oreData = oresData[i]

                if (y < oreData.oreHeightRange[0] || y > oreData.oreHeightRange[1]) continue

                possibleOres.push(oreData)
                totalChance += oreData.oreChance
            }

            let chance = Random.getNumber(0, totalChance)
            let currentChance = 0

            for (let i = 0; i < possibleOres.length; i++){
                const oreData = possibleOres[i]

                if (chance >= currentChance && chance < currentChance + oreData.oreChance){
                    mainTileMap.setTile(x, y, oreData.tileCode)

                    totalOrePrice += oreData.oreValue

                    break
                }
                else{
                    currentChance += oreData.oreChance
                }
            }
        }
    }

    //console.log(StringConverter.abbreviateNumber(totalOrePrice, ","))
    
    for (let y = 750; y < mainTileMap.height; y++){
        for (let x = 0; x < mainTileMap.width; x++){
            if (mainTileMap.getTileData(x, y) !== 1) continue
            
            let isPossible = true
            let height = Random.getNumber(5, 12)
            for (let i = 0; i < height; i++){
                let curHeight = y + i + 1
                if (mainTileMap.getTileData(x, curHeight) !== 1){
                    isPossible = false
                    break
                }
            }
            
            if (!isPossible) continue
            if (Random.getNumber(1, 100) !== 1) continue

            mainTileMap.setTile(x, y, 101)
            for (let i = 0; i < height; i++){
                let curHeight = y + i + 1

                mainTileMap.setTile(x, curHeight, 101)
            }
        }
    }

    for (let x = 0; x < mainTileMap.width; x++){
        mainTileMap._tileMap[mainTileMap.height - 1][x] = 102
        mainTileMap._tileMap[mainTileMap.height - 2][x] = 102
        mainTileMap._tileMap[mainTileMap.height - 3][x] = 102
    }
}

function spawnOutposts(){
    //ALPHA
    let outpostAlpha = document.createElement("img")
    outpostAlpha.setAttribute("src", "Images/PixelArt/OutpostAlpha.png")
    outpostAlpha.classList.add("outpost")
    gameHolderElement.append(outpostAlpha)
    outpostAlpha.style.top = `${500 * mainTileMap._scale}px`
    outpostAlpha.style.width = `${1950}px`

    let outpostAlphaSellBuilding = document.createElement("img")
    outpostAlphaSellBuilding.setAttribute("src", "Images/PixelArt/UndergroundSellBuilding.png")
    outpostAlphaSellBuilding.classList.add("outpost-sell-building")
    gameHolderElement.append(outpostAlphaSellBuilding)
    outpostAlphaSellBuilding.style.top = `${500 * mainTileMap._scale + 160}px`

    //BETA
    let outpostBeta = document.createElement("img")
    outpostBeta.setAttribute("src", "Images/PixelArt/OutpostBeta.png")
    outpostBeta.classList.add("outpost")
    gameHolderElement.append(outpostBeta)
    outpostBeta.style.top = `${1000 * mainTileMap._scale}px`
    outpostBeta.style.width = `${1950}px`

    let outpostBetaSellBuilding = document.createElement("img")
    outpostBetaSellBuilding.setAttribute("src", "Images/PixelArt/UndergroundSellBuilding.png")
    outpostBetaSellBuilding.classList.add("outpost-sell-building")
    gameHolderElement.append(outpostBetaSellBuilding)
    outpostBetaSellBuilding.style.top = `${1000 * mainTileMap._scale + 160}px`
}

function rescueToSurface(){
    let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)
    let playerDepth = playerGridPosition[1] - 4
    if (playerDepth < 0) playerDepth = 0

    if (playerDepth > 500){
        if (playerDepth > 1000){
            playerData.setPlayerPosition([0, 1004 * mainTileMap._scale])
        }
        else{
            playerData.setPlayerPosition([0, 504 * mainTileMap._scale])
        }
    }
    else{
        playerData.setPlayerPosition([0, 4 * mainTileMap._scale])
    }

    backpack.clearBackpack()
}

let oilCounter = 0
function updateStats(){
    const storageText = document.querySelector("#storage-text")
    const depthText = document.querySelector("#depth-text")

    let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)
    let playerDepth = playerGridPosition[1] - 4
    if (playerDepth < 0) playerDepth = 0

    depthText.innerText = StringConverter.abbreviateNumber(playerDepth, ",")
    storageText.innerText = `${backpack.getItemCount()}/${backpack.getCapacity()}`

    if (playerDepth > 0 && playerDepth !== 500 && playerDepth !== 499 && playerDepth !== 498 && playerDepth !== 497 && playerDepth !== 496 && playerDepth !== 1000 && playerDepth !== 999 && playerDepth !== 998 && playerDepth !== 997 && playerDepth !== 996){
        oilCounter++

        if (oilCounter < 50){
            oilCounter = 0
            
            if (darknessEffect.curSize > 0.75) darknessEffect.curSize -= 0.015 / 50

            let invLampBar = document.querySelector("#inv-lamp-bar")
            if (invLampBar){
                let oolBarSize = (95 / (darknessEffect.maxSize - 0.75)) * (darknessEffect.curSize - 0.75)
                if (oolBarSize <= 0) oolBarSize = 1
                invLampBar.style.width = oolBarSize.toString() + "%"
            }
        }

        if (shop.style.visibility === "visible"){
            shop.style.visibility = "hidden"
            playerData.allowMovement = true
        }
    }

    if (playerDepth >= 3 && !promptMenu.isActive() && inventoryElement.style.visibility !== "visible" && playerDepth !== 502 && playerDepth !== 501 && playerDepth !== 500 && playerDepth !== 499 && playerDepth !== 498 && playerDepth !== 497 && playerDepth !== 496 && playerDepth !== 1000 && playerDepth !== 999 && playerDepth !== 998 && playerDepth !== 997 && playerDepth !== 996 && playerDepth !== 1001 && playerDepth !== 1002){
        rescueHintElement.style.visibility = "visible" 
    }
    else{
        rescueHintElement.style.visibility = "hidden" 
    }

    if (playerDepth >= 1497){
        if (gamePlayerStats.drillIndex === 0){
            gamePlayerStats.drillIndex = 1
            oreAlert.setInfo("Drill obtained", "Drill.png")
            oreAlert.trigger()
        }
    }
}

export function renderInventoryContent(){
    const inventoryContentHolder = document.querySelector("#inv-content")
    const inventoryContentHeader = document.querySelector("#inv-content-header")

    while (inventoryContentHolder.children.length > 0){
        inventoryContentHolder.firstChild.remove()
    }

    let itemGroups = backpack.getItemGroups()

    itemGroups.forEach(itemGroup => {
        let holder = document.createElement("div")
        holder.classList.add("inv-item")
        inventoryContentHolder.append(holder)

        let image = document.createElement("img")
        let imageURL = "Images/PixelArt/"

        let oreName = ""

        for (let i = 0; i < oresData.length; i++) {
            let oreData = oresData[i]

            if (oreData.oreName !== itemGroup[0]) continue

            imageURL += oreData.oreImageURL
            oreName = oreData.oreName

            break
        }

        image.setAttribute("src", imageURL)
        holder.append(image)

        let count = document.createElement("p")
        count.innerText = `x${itemGroup[1]}`
        holder.append(count)

        if (itemGroup[1] <= 1){
            count.style.opacity = 0
        }

        holder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = oreName
        })

        holder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
        })
    })

    if (backpack.getItemCount() > 0){
        inventoryContentHeader.style.display = "block"
    }
    else{
        inventoryContentHeader.style.display = "none"
    }

    const inventoryItems = document.querySelector("#inv-items")

    while (inventoryItems.children.length > 0){
        inventoryItems.firstChild.remove()
    }


    //PICKAXE
    let pickaxeData = gamePlayerStats.getPickaxeData(gamePlayerStats.pickaxeIndex)
    let pickaxeHolder = document.createElement("div")
    pickaxeHolder.classList.add("inv-item")
    inventoryItems.append(pickaxeHolder)
    let pickaxeImage = document.createElement("img")
    pickaxeImage.setAttribute("src", "Images/PixelArt/" + pickaxeData[1])
    pickaxeHolder.append(pickaxeImage)

    pickaxeHolder.addEventListener("mouseover", () => {
        inventoryItemInfo.innerText = pickaxeData[2]
        if (gamePlayerStats.equippedToolType === "drill"){
            inventoryEquipInteraction.style.visibility = "visible"
        }
    })

    pickaxeHolder.addEventListener("mouseout", () => {
        inventoryItemInfo.innerText = ""
        inventoryEquipInteraction.style.visibility = "hidden"
    })

    pickaxeHolder.addEventListener("click", () => {
        if (gamePlayerStats.equippedToolType === "drill"){
            gamePlayerStats._equipPickaxe()
            inventoryEquipInteraction.style.visibility = "hidden"
            oreAlert.setInfo("Equipped", pickaxeData[1])
            oreAlert.setAppereance('url("Images/PixelArt/ItemEquipBackground.png")')
            oreAlert.trigger()
        }
    })

    //DRILL
    let drillData = gamePlayerStats.getDrillData(gamePlayerStats.drillIndex)

    if (drillData){
        let drillHolder = document.createElement("div")
        drillHolder.classList.add("inv-item")
        inventoryItems.append(drillHolder)
        let drillImage = document.createElement("img")
        drillImage.setAttribute("src", "Images/PixelArt/" + drillData[1])
        drillHolder.append(drillImage)

        let drillFuelHolder = document.createElement("div")
        drillHolder.append(drillFuelHolder)
        let drillFuelBar = document.createElement("div")
        drillFuelHolder.append(drillFuelBar)
        let barSize = (95 / gamePlayerStats.drillCapacity) * gamePlayerStats.drillFuel
        if (barSize <= 0) barSize = 0
        drillFuelBar.style.width = barSize.toString() + "%"

        drillHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = drillData[2]
            if (gamePlayerStats.equippedToolType === "pickaxe"){
                inventoryEquipInteraction.style.visibility = "visible"
            }
        })
    
        drillHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
            inventoryEquipInteraction.style.visibility = "hidden"
        })

        drillHolder.addEventListener("click", () => {
            if (gamePlayerStats.equippedToolType === "pickaxe"){
                gamePlayerStats._equipDrill()
                inventoryEquipInteraction.style.visibility = "hidden"
                oreAlert.setInfo("Equipped", drillData[1])
                oreAlert.setAppereance('url("Images/PixelArt/ItemEquipBackground.png")')
                oreAlert.trigger()
            }
        })
    }

    //OIL LAMP
    let oilLampData = gamePlayerStats.getOilLampData(gamePlayerStats.oilLampIndex)
    let oilLampHolder = document.createElement("div")
    oilLampHolder.classList.add("inv-item")
    inventoryItems.append(oilLampHolder)
    let oilLampImage = document.createElement("img")
    oilLampImage.setAttribute("src", "Images/PixelArt/" + oilLampData[1])
    oilLampHolder.append(oilLampImage)
    let oilLampFuel = document.createElement("div")
    oilLampHolder.append(oilLampFuel)
    let oilLampBar = document.createElement("div")
    oilLampFuel.append(oilLampBar)
    oilLampBar.setAttribute("id", "inv-lamp-bar")
    let oolBarSize = (95 / (darknessEffect.maxSize - 0.75)) * (darknessEffect.curSize - 0.75)
    if (oolBarSize <= 0) oolBarSize = 1
    oilLampBar.style.width = oolBarSize.toString() + "%"

    oilLampHolder.addEventListener("mouseover", () => {
        inventoryItemInfo.innerText = oilLampData[2]
    })

    oilLampHolder.addEventListener("mouseout", () => {
        inventoryItemInfo.innerText = ""
    })

    //BACKPACK
    let backpackData = gamePlayerStats.getBackpackData(gamePlayerStats.backpackIndex)
    let backpackHolder = document.createElement("div")
    backpackHolder.classList.add("inv-item")
    inventoryItems.append(backpackHolder)
    let backpackImage = document.createElement("img")
    backpackImage.setAttribute("src", "Images/PixelArt/" + backpackData[1])
    backpackHolder.append(backpackImage)
    let backpackCapacityHolder = document.createElement("div")
    backpackHolder.append(backpackCapacityHolder)
    let backpackCapacityBar = document.createElement("div")
    backpackCapacityHolder.append(backpackCapacityBar)
    let barSize = (95 / backpack.getCapacity()) * backpack.getItemCount()
    if (barSize <= 0) barSize = 0
    backpackCapacityBar.style.width = barSize.toString() + "%"

    backpackHolder.addEventListener("mouseover", () => {
        inventoryItemInfo.innerText = backpackData[2]
    })

    backpackHolder.addEventListener("mouseout", () => {
        inventoryItemInfo.innerText = ""
    })

    //GRAPPLING HOOK
    let grapplingHookData = gamePlayerStats.getGrapplingHookData(gamePlayerStats.grapplingHookIndex)

    if (grapplingHookData){
        let grapplingHookHolder = document.createElement("div")
        grapplingHookHolder.classList.add("inv-item")
        inventoryItems.append(grapplingHookHolder)
        let grapplingHookImage = document.createElement("img")
        grapplingHookImage.setAttribute("src", "Images/PixelArt/" + grapplingHookData[1])
        grapplingHookHolder.append(grapplingHookImage)
    
        grapplingHookHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = grapplingHookData[3]
        })
    
        grapplingHookHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
        })
    }

    //LIFT
    if (gamePlayerStats._liftCount > 0){
        let liftHolder = document.createElement("div")
        liftHolder.classList.add("inv-item")
        inventoryItems.append(liftHolder)
        let liftImage = document.createElement("img")
        liftImage.setAttribute("src", "Images/PixelArt/LiftCart.png")
        liftHolder.append(liftImage)

        let countl = document.createElement("p")
        countl.innerText = `x${gamePlayerStats._liftCount}`
        liftHolder.append(countl)
        countl.setAttribute("id", "inv-fix-item")

        if (gamePlayerStats._liftCount <= 1){
            countl.style.opacity = 0
        }

        liftHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = "Wooden lift"
            inventoryPlaceInteraction.style.visibility = "visible"
        })

        liftHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
            inventoryPlaceInteraction.style.visibility = "hidden"
        })

        liftHolder.addEventListener("click", () => {
            let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)

            if (!mainTileMap.liftPlaceValid(playerGridPosition[0], playerGridPosition[1])) return

            mainTileMap.createLift(playerGridPosition[0], playerGridPosition[1], "wooden")

            inventoryPlaceInteraction.style.visibility = "hidden"
            inventoryItemInfo.innerText = ""
            inventoryWindow()
            
            gamePlayerStats._liftCount --
            renderInventoryContent()
        })
    }

    //LIFT METAL
    if (gamePlayerStats._liftCountMetal > 0){
        let liftMetalHolder = document.createElement("div")
        liftMetalHolder.classList.add("inv-item")
        inventoryItems.append(liftMetalHolder)
        let liftMetalImage = document.createElement("img")
        liftMetalImage.setAttribute("src", "Images/PixelArt/LiftCartMetal.png")
        liftMetalHolder.append(liftMetalImage)

        let countl = document.createElement("p")
        countl.innerText = `x${gamePlayerStats._liftCountMetal}`
        liftMetalHolder.append(countl)
        countl.setAttribute("id", "inv-fix-item")

        if (gamePlayerStats._liftCountMetal <= 1){
            countl.style.opacity = 0
        }

        liftMetalHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = "Metal lift"
            inventoryPlaceInteraction.style.visibility = "visible"
        })

        liftMetalHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
            inventoryPlaceInteraction.style.visibility = "hidden"
        })

        liftMetalHolder.addEventListener("click", () => {
            let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)

            if (!mainTileMap.liftPlaceValid(playerGridPosition[0], playerGridPosition[1])) return

            mainTileMap.createLift(playerGridPosition[0], playerGridPosition[1], "metal")

            inventoryPlaceInteraction.style.visibility = "hidden"
            inventoryItemInfo.innerText = ""
            inventoryWindow()
            
            gamePlayerStats._liftCountMetal --
            renderInventoryContent()
        })
    }

    //T-BOMB
    if (gamePlayerStats._tBombs > 0){
        let TBombHolder = document.createElement("div")
        TBombHolder.classList.add("inv-item")
        inventoryItems.append(TBombHolder)
        let TBombImage = document.createElement("img")
        TBombImage.setAttribute("src", "Images/PixelArt/TTNT.png")
        TBombHolder.append(TBombImage)

        let countl = document.createElement("p")
        countl.innerText = `x${gamePlayerStats._tBombs}`
        TBombHolder.append(countl)
        countl.setAttribute("id", "inv-fix-item")

        if (gamePlayerStats._tBombs <= 1){
            countl.style.opacity = 0
        }

        TBombHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = "T-Bomb"
            inventoryUseInteraction.style.visibility = "visible"
        })

        TBombHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
            inventoryUseInteraction.style.visibility = "hidden"
        })

        TBombHolder.addEventListener("click", () => {
            let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)

            if (!mainTileMap.bombPlaceValid(playerGridPosition[0], playerGridPosition[1])) return

            mainTileMap.useBomb(playerGridPosition[0], playerGridPosition[1], "t-bomb")

            inventoryUseInteraction.style.visibility = "hidden"
            inventoryItemInfo.innerText = ""
            inventoryWindow()
            
            gamePlayerStats._tBombs --
            renderInventoryContent()
        })
    }

    //LINE-BOMB
    if (gamePlayerStats._lineBombs > 0){
        let lineBombHolder = document.createElement("div")
        lineBombHolder.classList.add("inv-item")
        inventoryItems.append(lineBombHolder)
        let lineBombImage = document.createElement("img")
        lineBombImage.setAttribute("src", "Images/PixelArt/LineTNT.png")
        lineBombHolder.append(lineBombImage)

        let countl = document.createElement("p")
        countl.innerText = `x${gamePlayerStats._lineBombs}`
        lineBombHolder.append(countl)
        countl.setAttribute("id", "inv-fix-item")

        if (gamePlayerStats._lineBombs <= 1){
            countl.style.opacity = 0
        }

        lineBombHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = "Line-Bomb"
            inventoryUseInteraction.style.visibility = "visible"
        })

        lineBombHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
            inventoryUseInteraction.style.visibility = "hidden"
        })

        lineBombHolder.addEventListener("click", () => {
            let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)

            if (!mainTileMap.bombPlaceValid(playerGridPosition[0], playerGridPosition[1])) return

            mainTileMap.useBomb(playerGridPosition[0], playerGridPosition[1], "line-bomb")

            inventoryUseInteraction.style.visibility = "hidden"
            inventoryItemInfo.innerText = ""
            inventoryWindow()
            
            gamePlayerStats._lineBombs --
            renderInventoryContent()
        })
    }

    //SHAFT-BOMB
    if (gamePlayerStats._shaftBombs > 0){
        let shaftBombHolder = document.createElement("div")
        shaftBombHolder.classList.add("inv-item")
        inventoryItems.append(shaftBombHolder)
        let shaftBombImage = document.createElement("img")
        shaftBombImage.setAttribute("src", "Images/PixelArt/ShaftTNT.png")
        shaftBombHolder.append(shaftBombImage)

        let countl = document.createElement("p")
        countl.innerText = `x${gamePlayerStats._shaftBombs}`
        shaftBombHolder.append(countl)
        countl.setAttribute("id", "inv-fix-item")

        if (gamePlayerStats._shaftBombs <= 1){
            countl.style.opacity = 0
        }

        shaftBombHolder.addEventListener("mouseover", () => {
            inventoryItemInfo.innerText = "Shaft-Bomb"
            inventoryUseInteraction.style.visibility = "visible"
        })

        shaftBombHolder.addEventListener("mouseout", () => {
            inventoryItemInfo.innerText = ""
            inventoryUseInteraction.style.visibility = "hidden"
        })

        shaftBombHolder.addEventListener("click", () => {
            let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)

            if (!mainTileMap.bombPlaceValid(playerGridPosition[0], playerGridPosition[1])) return

            mainTileMap.useBomb(playerGridPosition[0], playerGridPosition[1], "shaft-bomb")

            inventoryUseInteraction.style.visibility = "hidden"
            inventoryItemInfo.innerText = ""
            inventoryWindow()
            
            gamePlayerStats._shaftBombs --
            renderInventoryContent()
        })
    }

}

let buyTriggered = false
function renderShop(){
    buyTriggered = false
    const shopInventory = document.querySelector("#shop-inv")
    const shopShop = document.querySelector("#shop-shop")

    playerData.allowMovement = false

    while (shopInventory.children.length > 0){
        shopInventory.firstChild.remove()
    }
    while (shopShop.children.length > 0){
        shopShop.firstChild.remove()
    }

    const moneyHeader = document.querySelector("#header-money")
    moneyHeader.innerText = "$" + StringConverter.abbreviateNumber(gamePlayerStats.money, ",")

    //INV
    //OIL LAMP
    let ownedOilLampData = gamePlayerStats.getOilLampData(gamePlayerStats.oilLampIndex)
    let ownedOilLamp = document.createElement("div")
    shopInventory.append(ownedOilLamp)
    let ownedOilLampImage = document.createElement("img")
    ownedOilLampImage.setAttribute("src", "Images/PixelArt/" + ownedOilLampData[1])
    ownedOilLamp.append(ownedOilLampImage)

    let oolp = document.createElement("div")
    ownedOilLamp.append(oolp)
    let oolpFix = document.createElement("p")
    ownedOilLamp.append(oolpFix)
    oolpFix.innerText = "\n"
    let oolpBar = document.createElement("div")
    oolp.append(oolpBar)

    let oolBarSize = (98 / (darknessEffect.maxSize - 0.75)) * (darknessEffect.curSize - 0.75)
    if (oolBarSize <= 0) oolBarSize = 1
    oolpBar.style.width = oolBarSize + "%"
    oolpBar.style.minWidth = oolBarSize + "%"
    oolpBar.style.maxWidth = oolBarSize + "%"
    
    let ownedOilLampName = document.createElement("h1")
    ownedOilLampName.innerText = ownedOilLampData[2]
    ownedOilLamp.append(ownedOilLampName)

    //PICKAXE
    let ownedPickaxeData = gamePlayerStats.getPickaxeData(gamePlayerStats.pickaxeIndex)
    let ownedPickaxe = document.createElement("div")
    shopInventory.append(ownedPickaxe)
    let ownedPickaxeImage = document.createElement("img")
    ownedPickaxeImage.setAttribute("src", "Images/PixelArt/" + ownedPickaxeData[1])
    ownedPickaxe.append(ownedPickaxeImage)
    
    let a = document.createElement("p")
    ownedPickaxe.append(a)
    a.innerText = "\n"
    
    let ownedPickaxeName = document.createElement("h1")
    ownedPickaxeName.innerText = ownedPickaxeData[2]
    ownedPickaxe.append(ownedPickaxeName)

    //DRILL
    let ownedDrillData = gamePlayerStats.getDrillData(gamePlayerStats.drillIndex)

    if (ownedDrillData){
        let ownedDrill = document.createElement("div")
        shopInventory.append(ownedDrill)
        let ownedDrillImage = document.createElement("img")
        ownedDrillImage.setAttribute("src", "Images/PixelArt/" + ownedDrillData[1])
        ownedDrill.append(ownedDrillImage)

        let drillBarHolder = document.createElement("div")
        ownedDrill.append(drillBarHolder)
        let drillFix = document.createElement("p")
        ownedDrill.append(drillFix)
        drillFix.innerText = "\n"
        let drillBar = document.createElement("div")
        drillBarHolder.append(drillBar)

        let drillBarSize = (98 / gamePlayerStats.drillCapacity) * gamePlayerStats.drillFuel
        if (drillBarSize <= 0) drillBarSize = 0
        drillBar.style.width = drillBarSize + "%"
        drillBar.style.minWidth = drillBarSize + "%"
        drillBar.style.maxWidth = drillBarSize + "%"

        let ownedDrillName = document.createElement("h1")
        ownedDrillName.innerText = ownedDrillData[2]
        ownedDrill.append(ownedDrillName)
    }

    //FUEL TANK
    if (ownedDrillData){
        let ownedDrillFuelTankData = gamePlayerStats.getDrillFuelTankData(gamePlayerStats.drillFuelTankIndex)
        let ownedDrillFuelTank = document.createElement("div")
        shopInventory.append(ownedDrillFuelTank)
        let ownedDrillFuelTankImage = document.createElement("img")
        ownedDrillFuelTankImage.setAttribute("src", "Images/PixelArt/" + ownedDrillFuelTankData[1])
        ownedDrillFuelTank.append(ownedDrillFuelTankImage)
        
        let a = document.createElement("p")
        ownedDrillFuelTank.append(a)
        a.innerText = "\n"
        
        let ownedDrillFuelTankName = document.createElement("h1")
        ownedDrillFuelTankName.innerText = ownedDrillFuelTankData[2]
        ownedDrillFuelTank.append(ownedDrillFuelTankName)
    }

    //BACKPACK
    let ownedBackpackData = gamePlayerStats.getBackpackData(gamePlayerStats.backpackIndex)
    let ownedBackpack = document.createElement("div")
    shopInventory.append(ownedBackpack)
    let ownedBackpackImage = document.createElement("img")
    ownedBackpackImage.setAttribute("src", "Images/PixelArt/" + ownedBackpackData[1])
    ownedBackpack.append(ownedBackpackImage)

    let backpackBarHolder = document.createElement("div")
    ownedBackpack.append(backpackBarHolder)
    let backpackFix = document.createElement("p")
    ownedBackpack.append(backpackFix)
    backpackFix.innerText = "\n"
    let backpackBar = document.createElement("div")
    backpackBarHolder.append(backpackBar)

    let backpackBarSize = (98 / backpack.getCapacity()) * backpack.getItemCount()
    if (backpackBarSize <= 0) backpackBarSize = 0
    backpackBar.style.width = backpackBarSize + "%"
    backpackBar.style.minWidth = backpackBarSize + "%"
    backpackBar.style.maxWidth = backpackBarSize + "%"

    let ownedBackpackName = document.createElement("h1")
    ownedBackpackName.innerText = ownedBackpackData[2]
    ownedBackpack.append(ownedBackpackName)

    //GRAPPLING HOOK
    let ownedGrapplingHookData = gamePlayerStats.getGrapplingHookData(gamePlayerStats.grapplingHookIndex)

    if (ownedGrapplingHookData){
        let ownedGrapplingHook = document.createElement("div")
        shopInventory.append(ownedGrapplingHook)
        let ownedGrapplingHookImage = document.createElement("img")
        ownedGrapplingHookImage.setAttribute("src", "Images/PixelArt/" + ownedGrapplingHookData[1])
        ownedGrapplingHook.append(ownedGrapplingHookImage)

        let grapplingHookDesc = document.createElement("p")
        ownedGrapplingHook.append(grapplingHookDesc)
        grapplingHookDesc.innerText = "\n"
    
        let ownedGrapplingHookName = document.createElement("h1")
        ownedGrapplingHookName.innerText = ownedGrapplingHookData[3]
        ownedGrapplingHook.append(ownedGrapplingHookName)
    }

    //LIFT
    if (gamePlayerStats._liftCount > 0){
        let ownedLift = document.createElement("div")
        shopInventory.append(ownedLift)
        let ownedLiftImage = document.createElement("img")
        ownedLiftImage.setAttribute("src", "Images/PixelArt/LiftCart.png")
        ownedLift.append(ownedLiftImage)

        let ownedLiftAmount = document.createElement("p")
        ownedLift.append(ownedLiftAmount)
        ownedLiftAmount.innerText = "x" + StringConverter.abbreviateNumber(gamePlayerStats._liftCount, ",")
        
        let ownedLiftName = document.createElement("h1")
        ownedLiftName.innerText = "Wooden lift"
        ownedLift.append(ownedLiftName)
    }

    //LIFT METAL
    if (gamePlayerStats._liftCountMetal > 0){
        let ownedLiftMetal = document.createElement("div")
        shopInventory.append(ownedLiftMetal)
        let ownedLiftMetalImage = document.createElement("img")
        ownedLiftMetalImage.setAttribute("src", "Images/PixelArt/LiftCartMetal.png")
        ownedLiftMetal.append(ownedLiftMetalImage)

        let ownedLiftMetalAmount = document.createElement("p")
        ownedLiftMetal.append(ownedLiftMetalAmount)
        ownedLiftMetalAmount.innerText = "x" + StringConverter.abbreviateNumber(gamePlayerStats._liftCountMetal, ",")
        
        let ownedLiftMetalName = document.createElement("h1")
        ownedLiftMetalName.innerText = "Metal lift"
        ownedLiftMetal.append(ownedLiftMetalName)
    }

    //T-BOMB
    if (gamePlayerStats._tBombs > 0){
        let ownedTBomb = document.createElement("div")
        shopInventory.append(ownedTBomb)
        let ownedTBombImage = document.createElement("img")
        ownedTBombImage.setAttribute("src", "Images/PixelArt/TTNT.png")
        ownedTBomb.append(ownedTBombImage)

        let ownedTBombAmount = document.createElement("p")
        ownedTBomb.append(ownedTBombAmount)
        ownedTBombAmount.innerText = "x" + StringConverter.abbreviateNumber(gamePlayerStats._tBombs, ",")

        let ownedTBombName = document.createElement("h1")
        ownedTBombName.innerText = "T-Bomb"
        ownedTBomb.append(ownedTBombName)
    }

    //LINE-BOMB
    if (gamePlayerStats._lineBombs > 0){
        let ownedLineBomb = document.createElement("div")
        shopInventory.append(ownedLineBomb)
        let ownedLineBombImage = document.createElement("img")
        ownedLineBombImage.setAttribute("src", "Images/PixelArt/LineTNT.png")
        ownedLineBomb.append(ownedLineBombImage)

        let ownedLineBombAmount = document.createElement("p")
        ownedLineBomb.append(ownedLineBombAmount)
        ownedLineBombAmount.innerText = "x" + StringConverter.abbreviateNumber(gamePlayerStats._lineBombs, ",")

        let ownedLineBombName = document.createElement("h1")
        ownedLineBombName.innerText = "Line-Bomb"
        ownedLineBomb.append(ownedLineBombName)
    }

    //SHAFT-BOMB
    if (gamePlayerStats._shaftBombs > 0){
        let ownedShaftBomb = document.createElement("div")
        shopInventory.append(ownedShaftBomb)
        let ownedShaftBombImage = document.createElement("img")
        ownedShaftBombImage.setAttribute("src", "Images/PixelArt/ShaftTNT.png")
        ownedShaftBomb.append(ownedShaftBombImage)

        let ownedShaftBombAmount = document.createElement("p")
        ownedShaftBomb.append(ownedShaftBombAmount)
        ownedShaftBombAmount.innerText = "x" + StringConverter.abbreviateNumber(gamePlayerStats._shaftBombs, ",")

        let ownedShaftBombName = document.createElement("h1")
        ownedShaftBombName.innerText = "Shaft-Bomb"
        ownedShaftBomb.append(ownedShaftBombName)
    }

    //SHOP
    //OIL
    let buyOil = document.createElement("div")
    shopShop.append(buyOil)
    let buyOilImage = document.createElement("img")
    buyOilImage.setAttribute("src", "Images/PixelArt/Oil.png")
    buyOil.append(buyOilImage)

    let buyOilPrice = document.createElement("p")
    buyOilPrice.innerText = "$30"
    buyOil.append(buyOilPrice)
    if (gamePlayerStats.money < 30){
        buyOilPrice.style.color = "red"
    }

    let buyOilName = document.createElement("h1")
    buyOilName.innerText = "Lamp oil"
    buyOil.append(buyOilName)

    buyOil.addEventListener("click", () => {
        if (buyTriggered) return

        let playerMoney = gamePlayerStats.money

        if (playerMoney >= 30 && darknessEffect.curSize < darknessEffect.maxSize){
            buyTriggered = true
            gamePlayerStats.money -= 30
            darknessEffect.curSize += 4.5
            
            if (darknessEffect.curSize > darknessEffect.maxSize){
                darknessEffect.curSize = darknessEffect.maxSize
            }

            renderShop()
        }
    })

    //DRILL FUEL
    if (ownedDrillData){
        let buyDrillFuel = document.createElement("div")
        shopShop.append(buyDrillFuel)
        let buyDrillFuelImage = document.createElement("img")
        buyDrillFuelImage.setAttribute("src", "Images/PixelArt/DrillFuel.png")
        buyDrillFuel.append(buyDrillFuelImage)

        let buyDrillFuelPrice = document.createElement("p")
        buyDrillFuelPrice.innerText = "$500,000"
        buyDrillFuel.append(buyDrillFuelPrice)
        if (gamePlayerStats.money < 500000){
            buyDrillFuelPrice.style.color = "red"
        }

        let buyDrillFuelName = document.createElement("h1")
        buyDrillFuelName.innerText = "Drill fuel"
        buyDrillFuel.append(buyDrillFuelName)

        buyDrillFuel.addEventListener("click", () => {
            if (buyTriggered) return
    
            let playerMoney = gamePlayerStats.money
    
            if (playerMoney >= 500000 && gamePlayerStats.drillFuel < gamePlayerStats.drillCapacity){
                buyTriggered = true
                gamePlayerStats.money -= 500000
                gamePlayerStats.drillFuel += 5
                
                if (gamePlayerStats.drillFuel > gamePlayerStats.drillCapacity){
                    gamePlayerStats.drillFuel = gamePlayerStats.drillCapacity
                }
                
                gamePlayerStats._updateStatToolFuelBar()
                renderShop()
            }
        })
    }
    
    //FUEL TANK
    if (ownedDrillData){
        let buyDrillFuelTankData = gamePlayerStats.getDrillFuelTankData(gamePlayerStats.drillFuelTankIndex + 1)

        if (buyDrillFuelTankData){
            let buyDrillFuelTank = document.createElement("div")
            shopShop.append(buyDrillFuelTank)
            let buyDrillFuelTankImage = document.createElement("img")
            buyDrillFuelTankImage.setAttribute("src", "Images/PixelArt/" + buyDrillFuelTankData[1])
            buyDrillFuelTank.append(buyDrillFuelTankImage)

            let buyDrillFuelTankPrice = document.createElement("p")
            buyDrillFuelTank.append(buyDrillFuelTankPrice)
            buyDrillFuelTankPrice.innerText = "$" + StringConverter.abbreviateNumber(buyDrillFuelTankData[3], ",")
            if (gamePlayerStats.money < buyDrillFuelTankData[3]) {
                buyDrillFuelTankPrice.style.color = "red"
            }

            let buyDrillFuelTankName = document.createElement("h1")
            buyDrillFuelTankName.innerText = buyDrillFuelTankData[2]
            buyDrillFuelTank.append(buyDrillFuelTankName)

            buyDrillFuelTank.addEventListener("click", () => {
                if (buyTriggered) return
    
                let drillFuelTankCost = buyDrillFuelTankData[3]
                let playerMoney = gamePlayerStats.money
    
                if (playerMoney >= drillFuelTankCost) {
                    buyTriggered = true
                    gamePlayerStats.money -= drillFuelTankCost
                    gamePlayerStats.drillFuelTankIndex += 1
    
                    renderShop()
                }
            })
        }
    }

    //OIL LAMP
    let buyOilLampData = gamePlayerStats.getOilLampData(gamePlayerStats.oilLampIndex + 1)

    if (buyOilLampData){
        let buyOilLamp = document.createElement("div")
        shopShop.append(buyOilLamp)
        let buyOilLampImage = document.createElement("img")
        buyOilLampImage.setAttribute("src", "Images/PixelArt/" + buyOilLampData[1])
        buyOilLamp.append(buyOilLampImage)

        let buyOilLampPrice = document.createElement("p")
        buyOilLamp.append(buyOilLampPrice)
        buyOilLampPrice.innerText = "$" + StringConverter.abbreviateNumber(buyOilLampData[3], ",")
        if (gamePlayerStats.money < buyOilLampData[3]){
            buyOilLampPrice.style.color = "red"
        }

        let buyOilLampName = document.createElement("h1")
        buyOilLampName.innerText = buyOilLampData[2]
        buyOilLamp.append(buyOilLampName)

        buyOilLamp.addEventListener("click", () => {
            if (buyTriggered) return

            let oilLampCost = buyOilLampData[3]
            let playerMoney = gamePlayerStats.money

            if (playerMoney >= oilLampCost) {
                buyTriggered = true
                gamePlayerStats.money -= oilLampCost
                gamePlayerStats.oilLampIndex += 1

                renderShop()
            }
        })
    }

    //PICKAXE
    let buyPickaxeData = gamePlayerStats.getPickaxeData(gamePlayerStats.pickaxeIndex + 1)

    if (buyPickaxeData){
        let buyPickaxe = document.createElement("div")
        shopShop.append(buyPickaxe)
        let buyPickaxeImage = document.createElement("img")
        buyPickaxeImage.setAttribute("src", "Images/PixelArt/" + buyPickaxeData[1])
        buyPickaxe.append(buyPickaxeImage)

        let buyPickaxePrice = document.createElement("p")
        buyPickaxe.append(buyPickaxePrice)
        buyPickaxePrice.innerText = "$" + StringConverter.abbreviateNumber(buyPickaxeData[3], ",")
        if (gamePlayerStats.money < buyPickaxeData[3]){
            buyPickaxePrice.style.color = "red"
        }

        let buyPickaxeName = document.createElement("h1")
        buyPickaxeName.innerText = buyPickaxeData[2]
        buyPickaxe.append(buyPickaxeName)

        buyPickaxe.addEventListener("click", () => {
            if (buyTriggered) return

            let pickaxeCost = buyPickaxeData[3]
            let playerMoney = gamePlayerStats.money

            if (playerMoney >= pickaxeCost) {
                buyTriggered = true
                gamePlayerStats.money -= pickaxeCost
                gamePlayerStats.pickaxeIndex += 1

                renderShop()
            }
        })
    }

    //BACKPACK
    let buyBackpackData = gamePlayerStats.getBackpackData(gamePlayerStats.backpackIndex + 1)

    if (buyBackpackData){
        let buyBackpack = document.createElement("div")
        shopShop.append(buyBackpack)
        let buyBackpackImage = document.createElement("img")
        buyBackpackImage.setAttribute("src", "Images/PixelArt/" + buyBackpackData[1])
        buyBackpack.append(buyBackpackImage)

        let buyBackpackPrice = document.createElement("p")
        buyBackpack.append(buyBackpackPrice)
        buyBackpackPrice.innerText = "$" + StringConverter.abbreviateNumber(buyBackpackData[3], ",")
        if (gamePlayerStats.money < buyBackpackData[3]){
            buyBackpackPrice.style.color = "red"
        }

        let buyBackpackName = document.createElement("h1")
        buyBackpackName.innerText = buyBackpackData[2]
        buyBackpack.append(buyBackpackName)

        buyBackpack.addEventListener("click", () => {
            if (buyTriggered) return

            let backpackCost = buyBackpackData[3]
            let playerMoney = gamePlayerStats.money

            if (playerMoney >= backpackCost) {
                buyTriggered = true
                gamePlayerStats.money -= backpackCost
                gamePlayerStats.backpackIndex += 1

                renderShop()
            }
        })
    }

    //GRAPPLING HOOK
    let buyGrapplingHookData = gamePlayerStats.getGrapplingHookData(gamePlayerStats.grapplingHookIndex + 1)

    if (buyGrapplingHookData){
        let buyGrapplingHook = document.createElement("div")
        shopShop.append(buyGrapplingHook)
        let buyGrapplingHookImage = document.createElement("img")
        buyGrapplingHookImage.setAttribute("src", "Images/PixelArt/" + buyGrapplingHookData[1])
        buyGrapplingHook.append(buyGrapplingHookImage)

        let buyGrapplingHookPrice = document.createElement("p")
        buyGrapplingHook.append(buyGrapplingHookPrice)
        buyGrapplingHookPrice.innerText = "$" + StringConverter.abbreviateNumber(buyGrapplingHookData[4], ",")
        if (gamePlayerStats.money < buyGrapplingHookData[4]){
            buyGrapplingHookPrice.style.color = "red"
        }

        let buyGrapplingHookName = document.createElement("h1")
        buyGrapplingHookName.innerText = buyGrapplingHookData[3]
        buyGrapplingHook.append(buyGrapplingHookName)

        buyGrapplingHook.addEventListener("click", () => {
            if (buyTriggered) return

            let grapplingHookCost = buyGrapplingHookData[4]
            let playerMoney = gamePlayerStats.money

            if (playerMoney >= grapplingHookCost) {
                buyTriggered = true
                gamePlayerStats.money -= grapplingHookCost
                gamePlayerStats.grapplingHookIndex += 1

                grapplingHookInfo.style.visibility = "visible"
                document.querySelector("#grappling-hook-info-img").setAttribute("src", "Images/PixelArt/" + buyGrapplingHookData[1])

                renderShop()
            }
        })
    }

    //LIFT
    let buyLift = document.createElement("div")
    shopShop.append(buyLift)
    let buyLiftImage = document.createElement("img")
    buyLiftImage.setAttribute("src", "Images/PixelArt/LiftCart.png")
    buyLift.append(buyLiftImage)

    let buyLiftPrice = document.createElement("p")
    buyLiftPrice.innerText = "$" + StringConverter.abbreviateNumber(gamePlayerStats.getLiftPrice(), ",")
    buyLift.append(buyLiftPrice)
    if (gamePlayerStats.money < gamePlayerStats.getLiftPrice()){
        buyLiftPrice.style.color = "red"
    }

    let buyLiftName = document.createElement("h1")
    buyLiftName.innerText = "Wooden lift"
    buyLift.append(buyLiftName)

    buyLift.addEventListener("click", () => {
        if (buyTriggered) return

        let playerMoney = gamePlayerStats.money

        if (playerMoney >= gamePlayerStats.getLiftPrice()){
            buyTriggered = true
            gamePlayerStats.money -= gamePlayerStats.getLiftPrice()
            
            gamePlayerStats._liftCount++
            gamePlayerStats._totalLifts++

            renderShop()
        }
    })

    //LIFT METAL
    let buyLiftMetal = document.createElement("div")
    shopShop.append(buyLiftMetal)
    let buyLiftMetalImage = document.createElement("img")
    buyLiftMetalImage.setAttribute("src", "Images/PixelArt/LiftCartMetal.png")
    buyLiftMetal.append(buyLiftMetalImage)

    let buyLiftMetalPrice = document.createElement("p")
    buyLiftMetalPrice.innerText = "$" + StringConverter.abbreviateNumber(gamePlayerStats.getLiftMetalPrice(), ",")
    buyLiftMetal.append(buyLiftMetalPrice)
    if (gamePlayerStats.money < gamePlayerStats.getLiftMetalPrice()){
        buyLiftMetalPrice.style.color = "red"
    }

    let buyLiftMetalName = document.createElement("h1")
    buyLiftMetalName.innerText = "Metal lift"
    buyLiftMetal.append(buyLiftMetalName)

    buyLiftMetal.addEventListener("click", () => {
        if (buyTriggered) return

        let playerMoney = gamePlayerStats.money

        if (playerMoney >= gamePlayerStats.getLiftMetalPrice()){
            buyTriggered = true
            gamePlayerStats.money -= gamePlayerStats.getLiftMetalPrice()
            
            gamePlayerStats._liftCountMetal++
            gamePlayerStats._totalLiftsMetal++

            renderShop()
        }
    })

    //T-BOMB
    let buyTBomb = document.createElement("div")
    shopShop.append(buyTBomb)
    let buyTBombImage = document.createElement("img")
    buyTBombImage.setAttribute("src", "Images/PixelArt/TTNT.png")
    buyTBomb.append(buyTBombImage)

    let buyTBombPrice = document.createElement("p")
    buyTBombPrice.innerText = "$" + StringConverter.abbreviateNumber(gamePlayerStats.getTBombPrice(), ",")
    buyTBomb.append(buyTBombPrice)
    if (gamePlayerStats.money < gamePlayerStats.getTBombPrice()){
        buyTBombPrice.style.color = "red"
    }

    let buyTBombName = document.createElement("h1")
    buyTBombName.innerText = "T-Bomb"
    buyTBomb.append(buyTBombName)

    buyTBomb.addEventListener("click", () => {
        if (buyTriggered) return

        let playerMoney = gamePlayerStats.money

        if (playerMoney >= gamePlayerStats.getTBombPrice()){
            buyTriggered = true
            gamePlayerStats.money -= gamePlayerStats.getTBombPrice()
            
            gamePlayerStats._tBombs++
            gamePlayerStats._totalTBombs++

            renderShop()
        }
    })

    //LINE-BOMB
    let buyLineBomb = document.createElement("div")
    shopShop.append(buyLineBomb)
    let buyLineBombImage = document.createElement("img")
    buyLineBombImage.setAttribute("src", "Images/PixelArt/LineTNT.png")
    buyLineBomb.append(buyLineBombImage)

    let buyLineBombPrice = document.createElement("p")
    buyLineBombPrice.innerText = "$" + StringConverter.abbreviateNumber(gamePlayerStats.getLineBombPrice(), ",")
    buyLineBomb.append(buyLineBombPrice)
    if (gamePlayerStats.money < gamePlayerStats.getLineBombPrice()){
        buyLineBombPrice.style.color = "red"
    }

    let buyLineBombName = document.createElement("h1")
    buyLineBombName.innerText = "Line-Bomb"
    buyLineBomb.append(buyLineBombName)

    buyLineBomb.addEventListener("click", () => {
        if (buyTriggered) return

        let playerMoney = gamePlayerStats.money

        if (playerMoney >= gamePlayerStats.getLineBombPrice()){
            buyTriggered = true
            gamePlayerStats.money -= gamePlayerStats.getLineBombPrice()
            
            gamePlayerStats._lineBombs++
            gamePlayerStats._totalLineBombs++

            renderShop()
        }
    })

    //SHAFT-BOMB
    let buyShaftBomb = document.createElement("div")
    shopShop.append(buyShaftBomb)
    let buyShaftBombImage = document.createElement("img")
    buyShaftBombImage.setAttribute("src", "Images/PixelArt/ShaftTNT.png")
    buyShaftBomb.append(buyShaftBombImage)

    let buyShaftBombPrice = document.createElement("p")
    buyShaftBombPrice.innerText = "$" + StringConverter.abbreviateNumber(gamePlayerStats.getShaftBombPrice(), ",")
    buyShaftBomb.append(buyShaftBombPrice)
    if (gamePlayerStats.money < gamePlayerStats.getShaftBombPrice()){
        buyShaftBombPrice.style.color = "red"
    }

    let buyShaftBombName = document.createElement("h1")
    buyShaftBombName.innerText = "Shaft-Bomb"
    buyShaftBomb.append(buyShaftBombName)

    buyShaftBomb.addEventListener("click", () => {
        if (buyTriggered) return

        let playerMoney = gamePlayerStats.money

        if (playerMoney >= gamePlayerStats.getShaftBombPrice()){
            buyTriggered = true
            gamePlayerStats.money -= gamePlayerStats.getShaftBombPrice()
            
            gamePlayerStats._shaftBombs++
            gamePlayerStats._totalShaftBombs++

            renderShop()
        }
    })
}

function checkMinecartDistance(){
    let distance = Collision.getDistance(playerData._playerElement, minecart)

    return distance <= 100
}

function checkShopDistance(){
    let distance = Collision.getDistance(playerData._playerElement, shopHintElement)

    return distance <= 200
}

function handleSellHintVisibility(){
    let isDistance = checkMinecartDistance()

    if (isDistance && !isMinecartAnim && backpack.getItemCount() > 0 && inventoryElement.style.visibility === "hidden"){
        sellHint.style.visibility = "visible"
    }
    else{
        sellHint.style.visibility = "hidden"
    }
}

function handleShopHintVisibility(){
    let isDistance = checkShopDistance()
    const sellDataStyle = window.getComputedStyle(sellData)

    if (isDistance && !isMinecartAnim && inventoryElement.style.visibility === "hidden" && sellDataStyle.visibility === "hidden" && shop.style.visibility === "hidden"){
        shopHintElement.style.visibility = "visible"
    }
    else{
        shopHintElement.style.visibility = "hidden"
    }
}

function inventoryWindow(){
    if (sellData.style.visibility === "visible" || shop.style.visibility === "visible"){
        sellData.style.visibility = "hidden"
        shop.style.visibility = "hidden"
        inventoryHintElement.style.visibility = "visible"
        playerData.allowMovement = true

        return
    }
    if (isMinecartAnim) return
    if (promptMenu.isActive()){
        promptMenu.setActive(false)
        inventoryHintElement.style.visibility = "visible"
        return
    }

    if (inventoryElement.style.visibility === "hidden"){
        inventoryElement.style.visibility = "visible"
        inventoryHintElement.style.visibility = "hidden"

        renderInventoryContent()
    }
    else{
        inventoryElement.style.visibility = "hidden"
        inventoryHintElement.style.visibility = "visible"
    }
}

function onKeyDown(e){
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft"){
        playerData.leftHold = true
    }
    else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight"){
        playerData.rightHold = true
    }

    if (e.key === " " || e.key === "w" || e.key === "W" || e.key === "ArrowUp"){
        e.preventDefault()

        if (!playerData._inLift){
            playerData.jump()
        }

        playerData._upHolded = true
    }

    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown"){
        if (!playerData._inLift){
            playerData.dropDown()
        }

        playerData._downHolded = true
    }

    /*
    if (e.key === "t"){
        playerData.setPlayerPosition([0, 37700])
    }
    if (e.key === "z"){
        playerData.setPlayerPosition([0, 75000])
    }
    if (e.key === "u"){
        gamePlayerStats.money = 5454454545
    }
    if (e.key === "i"){
        gamePlayerStats.drillIndex = 1
    }
    if (e.key === "o"){
        SavingSystem.saveData(gamePlayerStats, darknessEffect, backpack, playerData, mainTileMap)
    }
    if (e.key === "p"){
        SavingSystem.loadData(gamePlayerStats, darknessEffect, backpack, playerData, mainTileMap, tileMapRenderer)
    }
    */
   /*
    if (e.key === "m"){
        dataLoaded = false
        window.localStorage.removeItem("miner_plr")
        window.localStorage.removeItem("miner_world")
        window.location.href = ""
    }
    */
}

function onKeyUp(e){
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft"){
        playerData.leftHold = false
    }
    else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight"){
        playerData.rightHold = false
    }

    if (e.key === " " || e.key === "w" || e.key === "W" || e.key === "ArrowUp"){
        playerData._upHolded = false
    }

    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown"){
        playerData._downHolded = false
    }

    if (e.key === "e" || e.key === "E"){
        inventoryWindow()
    }

    if (e.key === "f" || e.key == "F"){
        let isDistance = checkMinecartDistance()

        if (isDistance){
            backpack.sellItems(isMinecartAnim, gamePlayerStats)
            renderInventoryContent()
        }

        if (shopHintElement.style.visibility === "visible"){
            inventoryHintElement.style.visibility = "hidden"
            shop.style.visibility = "visible"

            renderShop()
        }

        if (playerData._grapplingHook){
            playerData.grapplingHookEnd()
        }
        else{
            playerData.grapplingHookStart()
        }
    }

    if (e.key === "r" || e.key === "R"){
        let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)
        let playerDepth = playerGridPosition[1] - 4
        if (playerDepth < 0) playerDepth = 0

        if (playerDepth >= 3 && rescueHintElement.style.visibility === "visible"){
            promptMenu.setContent("Rescue to surface?", "All ores in inventory will be lost.")
            promptMenu.setConfirmExecMethod(rescueToSurface)
            promptMenu.setActive(true)
        }
    }

    if (e.key === "Enter"){
        promptMenu.handleConfirm()
    }
}

function applyCameraShake(){
    gameHolderElement.style.animation = "shake 0.2s 1"
}
gameHolderElement.addEventListener("animationend", () => {
    gameHolderElement.style.animation = "none"
})

function mineBlock(){
    let damage = gamePlayerStats.pickaxeDamage
    if (gamePlayerStats.equippedToolType === "drill"){
        damage = gamePlayerStats.drillDamage
    }

    if (selectionBox.currentlyHoveredTile !== "none" && selectionBox.currentlyHoveredTile === selectionBox._targetTile){
        let tileMapPosition = selectionBox.currentlyHoveredTileMapCoords

        let maxHealth = mainTileMap.getTileMaxHealth(tileMapPosition[1])
        let tileHealth = mainTileMap.getTileHealth(tileMapPosition[0], tileMapPosition[1])

        let tileData = mainTileMap.getTileData(tileMapPosition[0], tileMapPosition[1])
        if (tileData === 100 || tileData === 102) return

        mainTileMap.setTileHealth(tileMapPosition[0], tileMapPosition[1], tileHealth - damage)

        if (tileHealth - damage <= 0){
            let tileData = mainTileMap.getTileData(tileMapPosition[0], tileMapPosition[1])

            for (let i = 0; i < oresData.length; i++){
                let oreData = oresData[i]

                if (oreData.tileCode !== tileData) continue

                if (backpack.getItemCount() < backpack.getCapacity()){
                    backpack.addItem(oreData.oreName)

                    oreAlert.setInfo(oreData.oreName, oreData.oreImageURL)
                    oreAlert.trigger()

                    renderInventoryContent()
                }
                else{
                    oreAlert.setInfo("Ore lost!", gamePlayerStats.getBackpackData(gamePlayerStats.backpackIndex)[1])
                    oreAlert.trigger()
                }

                break
            }

            let cTileStyle = window.getComputedStyle(selectionBox.currentlyHoveredTile)
            let tileX = StringConverter.floatFromPixelString(cTileStyle.left) + mainTileMap._scale/2
            let tileY = StringConverter.floatFromPixelString(cTileStyle.top) + mainTileMap._scale/2

            mainTileMap.setTile(tileMapPosition[0], tileMapPosition[1], 0)
            mainTileMap.createVisualTile(tileMapPosition[0], tileMapPosition[1])
            mainTileMap.checkRock(tileMapPosition[0], tileMapPosition[1])
            setTimeout(mainTileMap.removeFallingRocks, 100)

            selectionBox.currentlyHoveredTile = "none"

            applyCameraShake()

            //Tile appereance change
            let gridPosition = [tileMapPosition[0], tileMapPosition[1]]

            let tilePositions = [
                [gridPosition[0], gridPosition[1]],
                [gridPosition[0] + 1, gridPosition[1]],
                [gridPosition[0] - 1, gridPosition[1]],
                [gridPosition[0] + 1, gridPosition[1] + 1],
                [gridPosition[0] + 1, gridPosition[1] - 1],
                [gridPosition[0] - 1, gridPosition[1] + 1],
                [gridPosition[0] - 1, gridPosition[1] - 1],
                [gridPosition[0], gridPosition[1] + 1],
                [gridPosition[0], gridPosition[1] - 1]
            ]

            tilePositions.forEach(tilePosition => {
                tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
            })

            //Tile particles
            for (let i = 0; i < 25; i++){
                let particle = new Particle([10, 10], "Images/PixelArt/DirtParticle.png", [Random.getFloatNumber(-2, 1), Random.getFloatNumber(-5, -3)], Random.getNumber(50, 100), [tileX, tileY], true)
            }
        }
        else{
            let s = (1/maxHealth) * (tileHealth - damage)
            let imageURL = "Images/PixelArt/Broken1.png"

            s = 1 - s

            if (imageURL !== ""){
                let damageImageExists = false

                for (let i = 0; i < selectionBox.currentlyHoveredTile.children.length; i++){
                    let c = selectionBox.currentlyHoveredTile.children[i]

                    if (c.classList.contains("damage-image")){
                        damageImageExists = true

                        c.setAttribute("src", imageURL)
                        c.style.opacity = s

                        break
                    }
                }

                if (!damageImageExists){
                    let c = document.createElement("img")
                    c.classList.add("damage-image")
                    c.setAttribute("src", imageURL)
                    c.style.opacity = s
                    selectionBox.currentlyHoveredTile.append(c)
                }
            }

            selectionBox.currentlyHoveredTile.style.animation = "block-hit 1 0.2s"
            selectionBox.currentlyHoveredTile.addEventListener("animationend", () => {
                if (selectionBox.currentlyHoveredTile && selectionBox.currentlyHoveredTile.style){
                    selectionBox.currentlyHoveredTile.style.animation = "none"
                }
            })

            applyCameraShake()

            let cTileStyle = window.getComputedStyle(selectionBox.currentlyHoveredTile)
            let tileX = StringConverter.floatFromPixelString(cTileStyle.left) + mainTileMap._scale/2
            let tileY = StringConverter.floatFromPixelString(cTileStyle.top) + mainTileMap._scale/2
            //Tile particles
            for (let i = 0; i < 5; i++){
                let particle = new Particle([10, 10], "Images/PixelArt/DirtParticle.png", [Random.getFloatNumber(-2, 1), Random.getFloatNumber(-5, -3)], Random.getNumber(50, 100), [tileX, tileY], true)
            }
        }
    }
}

function onMouseDown(e){
    playerData.mouseHold = true
}

function onMouseUp(e){
    playerData.mouseHold = false
}

function onToolAnimEnd(){
    isPickaxeAnim = false
    playerData._playerTool.style.animation = "none"
}

let currentCameraY = 0
let currentCameraX = 0
let tileMoveChange = 0
let liftMoveDelayCounter = 0
function mainLoop(deltaTime){
    playerData.handleUpdate(deltaTime)
    playerData.animateElement(deltaTime, isPickaxeAnim)
    selectionBox.updateTileDistance(mainTileMap, playerData)
    darknessEffect.trackPlayer(mainTileMap, playerData)

    playerData.mineCounter += 1 * deltaTime

    if (inventoryElement.style.visibility === "hidden" && shop.style.visibility === "hidden" && sellData.style.visibility === "hidden" && !isMinecartAnim){
        if (gamePlayerStats.equippedToolType === "drill"){
            if (playerData.mouseHold && gamePlayerStats.drillFuel > 0){
                isPickaxeAnim = true
    
                if (playerData._playerTool.style.transform === "scaleY(-1)"){
                    playerData._playerTool.style.animation = "drill-left 1 0.15s"
                }
                else{
                    playerData._playerTool.style.animation = "drill-right 1 0.15s"
                }

                gamePlayerStats.drillFuel -= 0.002
                gamePlayerStats._updateStatToolFuelBar()
            }
            else{
                isPickaxeAnim = false
            }
        }
    
        if (playerData.mouseHold && playerData.horizontal === 0 && selectionBox._targetTile !== "none" && selectionBox.currentlyHoveredTile !== "none" && selectionBox.currentlyHoveredTile === selectionBox._targetTile){
            if (playerData.mineCounter >= 33 && gamePlayerStats.equippedToolType === "pickaxe" && !isPickaxeAnim){
                playerData.mineCounter = 0
                isPickaxeAnim = true
    
                if (playerData._playerTool.style.transform === "scaleY(-1)"){
                    playerData._playerTool.style.animation = "tool-swing-left 1 0.4s"
                }
                else{
                    playerData._playerTool.style.animation = "tool-swing-right 1 0.4s"
                }
        
                setTimeout(mineBlock, 250)
            }
            else if (playerData.mineCounter >= 11 && gamePlayerStats.equippedToolType === "drill" && gamePlayerStats.drillFuel > 0){
                playerData.mineCounter = 0
        
                setTimeout(mineBlock, 50)
            } 
        }
    }

    if (currentCameraY !== cameraY){
        /*
        document.documentElement.scrollTop = cameraY
        document.documentElement.scrollLeft = 0
        */
        gameHolderElement.scrollTop = cameraY

        currentCameraY = cameraY
    }

    if (currentCameraX !== cameraX){
        gameHolderElement.scrollLeft = cameraX

        currentCameraX = cameraX
    }

    let gpy = playerData.getPlayerGridPosition(mainTileMap)[1]
    let playerPosition = playerData.getPlayerPosition()

    cameraY = playerPosition[1] - 500
    cameraX = playerPosition[0] - window.innerWidth/2
    if (cameraX < 0) cameraX = 0
    if (cameraX > 1910 - window.innerWidth) cameraX = 1910 - window.innerWidth

    if (Math.abs(tileMoveChange - gpy) > 1){
        tileMapRenderer.renderTiles()
        tileMoveChange = gpy

        if (gpy > 200){
            if (gpy > 700){
                shopHintElement.style.top = `${1000 * mainTileMap._scale + 200}px`
                sellHint.style.top = `${1000 * mainTileMap._scale + 250}px`
                minecart.style.top = `${1000 * mainTileMap._scale + 247}px`
            }
            else{
                shopHintElement.style.top = `${500 * mainTileMap._scale + 200}px`
                sellHint.style.top = `${500 * mainTileMap._scale + 250}px`
                minecart.style.top = `${500 * mainTileMap._scale + 247}px`
            }
        }
        else{
            shopHintElement.style.top = `${200}px`
            sellHint.style.top = `${250}px`
            minecart.style.top = `${247}px`
        }
    }

    liftMoveDelayCounter++
    if (liftMoveDelayCounter >= 100){
        liftMoveDelayCounter = 0
        mainTileMap.updateLifts()
    }

    oreAlert.handleUpdate(deltaTime)
    Particle.handleParticles(deltaTime)

    updateStats()
    handleSellHintVisibility()
    handleShopHintVisibility()
}

let lastTime = 0
let frames = 0
let framesText = document.querySelector("#fps")
framesText.style.visibility = "hidden"
function loopHandler(time){
    const deltaTime = (time - lastTime) / 10
    lastTime = time

    mainLoop(deltaTime)

    frames++

    window.requestAnimationFrame(loopHandler)
}

function fpsCounter(){
    earlyAccess.innerText = "Early access - version 1 (FPS: " + frames +")"
    //framesText.innerText = "FPS: " + frames
    frames = 0
}

function onWindowLoad(){
    document.documentElement.scrollTop = 500
}

function setup(){
    mainTileMap.setElementStorage(blocks)
    mainTileMap.createTileMapElementsStructure()
    generateBaseTilesData()
    spawnOutposts()

    playerData.setGroundTileMap(mainTileMap)

    playerData._playerTool.addEventListener("animationend", onToolAnimEnd)

    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)

    document.querySelector("#sky").style.width = `${1950}px`
    inventoryElement.style.visibility = "hidden"
    inventoryPlaceInteraction.style.visibility = "hidden"
    inventoryUseInteraction.style.visibility = "hidden"
    inventoryEquipInteraction.style.visibility = "hidden"
    shopHintElement.style.visibility = "hidden"
    shop.style.visibility = "hidden"
    sellData.style.visibility = "hidden"
    promptMenu.setActive(false)
    liftStat.style.visibility = "hidden"
    grapplingHookInfo.style.visibility = "hidden"
    statToolFuelBarHolder.style.visibility = "hidden"

    minecart.addEventListener("animationend", () => {
        minecart.style.animation = "none"
        isMinecartAnim = false
    })

    tileMapRenderer._removeAllTiles()
    tileMapRenderer.renderTiles()

    renderInventoryContent()

    loadingText.innerText = "Loading"
    setTimeout(() => {
        loadingText.innerText = "Loading ."
    }, 500)
    setTimeout(() => {
        loadingText.innerText = "Loading .."
    }, 1000)
    setTimeout(() => {
        loadingText.innerText = "Loading ..."
    }, 1500)

    setTimeout(() => {
        SavingSystem.loadData(gamePlayerStats, darknessEffect, backpack, playerData, mainTileMap, tileMapRenderer)
        dataLoaded = true

        loading.style.visibility = "hidden"
    }, 1000)

    window.addEventListener("beforeunload", () => {
        if (dataLoaded){
            SavingSystem.saveData(gamePlayerStats, darknessEffect, backpack, playerData, mainTileMap)
        }
    })

    setInterval(() => {
        if (dataLoaded){
            SavingSystem.saveData(gamePlayerStats, darknessEffect, backpack, playerData, mainTileMap)
        }
    }, 5000000)

    let bottomBedrockImage = document.createElement("div")
    bottomBedrockImage.style.position = "absolute"
    bottomBedrockImage.style.left = "-75px"
    bottomBedrockImage.style.top = `${(mainTileMap.height - 1) * mainTileMap.scale}px`
    bottomBedrockImage.style.backgroundImage = 'url("Images/PixelArt/BedrockTile.png")'
    bottomBedrockImage.style.imageRendering = "pixelated"
    bottomBedrockImage.style.zIndex = 80
    bottomBedrockImage.style.backgroundSize = "75px 75px"
    bottomBedrockImage.style.width = "150%"
    bottomBedrockImage.style.height = "1000px"
    gameHolderElement.append(bottomBedrockImage)

    setInterval(fpsCounter, 1000)
    window.requestAnimationFrame(loopHandler)
}

setup()