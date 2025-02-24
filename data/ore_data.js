export class OreData{
    static createdOres = []

    constructor(oreName, oreValue, oreImageURL, oreHeightRange, oreChance, tileCode){
        this._oreName = oreName
        this._oreValue = oreValue
        this._oreImageURL = oreImageURL
        this._oreHeightRange = oreHeightRange
        this._oreChance = oreChance
        this._tileCode = tileCode

        OreData.createdOres.push(this)
    }

    static getOreData(oresData, tileCode){
        for (let i = 0; i < oresData.length; i++){
            const oreData = oresData[i]

            if (oreData.tileCode === tileCode){
                return oreData
            }
        }

        return NaN
    }

    static getOrePrice(oreName){
        for (let i = 0; i < OreData.createdOres.length; i++){
            let ore = OreData.createdOres[i]

            if (ore.oreName !== oreName) continue

            return ore.oreValue
        }
    }

    get oreName(){
        return this._oreName
    }

    get oreValue(){
        return this._oreValue
    }

    get oreImageURL(){
        return this._oreImageURL
    }

    get oreHeightRange(){
        return this._oreHeightRange
    }

    get oreChance(){
        return this._oreChance
    }

    get tileCode(){
        return this._tileCode
    }
}

export let oresData = [
    new OreData("Copper", 15, "CopperOre.png", [5, 75], 1000, 2),
    new OreData("Silver", 30, "SilverOre.png", [5, 125], 1000, 3),
    new OreData("Nickel", 40, "Nickel.png", [5, 200], 950, 39),
    new OreData("Bauxite", 50, "Bauxite.png", [7, 250], 940, 40),
    new OreData("Iron", 75, "IronOre.png", [10, 275], 900, 4),
    new OreData("Citrine", 100, "CitrineOre.png", [10, 375], 850, 9),
    new OreData("Gold", 165, "GoldOre.png", [20, 500], 550, 5),
    new OreData("Diamond", 275, "DiamondOre.png", [50, 500], 125, 6),
    new OreData("Lead", 300, "Lead.png", [150, 450], 750, 41),
    new OreData("Emerald", 375, "EmeraldOre.png", [50, 500], 75, 7),
    new OreData("Manganese", 500, "Manganese.png", [250, 500], 700, 42),
    new OreData("Zinc", 900, "Zinc.png", [400, 500], 650, 43),
    new OreData("Amethyst", 1150, "AmethystOre.png", [75, 500], 50, 8),
    new OreData("Ruby", 1350, "RubyOre.png", [75, 500], 45, 10),
    new OreData("Jade", 2100, "JadeOre.png", [100, 500], 25, 11),

    new OreData("Agate", 1500, "Agate.png", [500, 1000], 3000, 17),
    new OreData("Apatite", 1750, "Apatite.png", [500, 1000], 2750, 18),
    new OreData("Magma stone", 3500, "MagmaStoneOre.png", [500, 1000], 1000, 12),
    new OreData("Gemstone", 6000, "GemstoneOre.png", [500, 1000], 750, 13),
    new OreData("Green crystal", 15000, "GreenCrystalOre.png", [500, 1000], 350, 14),
    new OreData("Yellow crystal", 17500, "YellowCrystalOre.png", [500, 1000], 275, 15),
    new OreData("Sammyum", 32000, "SammyumOre.png", [650, 1000], 100, 16),
    new OreData("Garnet", 45000, "Garnet.png", [800, 1000], 100, 19),
    new OreData("Opal", 90000, "Opal.png", [850, 1000], 50, 20),
    new OreData("Peridot", 65000, "Peridot.png", [800, 1000], 85, 21),

    new OreData("Sapphire", 25000, "Sapphire.png", [1000, 1400], 5000, 22),
    new OreData("Topaz", 30000, "Topaz.png", [1000, 1400], 4000, 23),
    new OreData("Onyx", 50000, "Onyx.png", [1000, 1400], 1000, 24),
    new OreData("Tourmaline", 75000, "Tourmaline.png", [1000, 1400], 650, 25),
    new OreData("Tanzanite", 100000, "Tanzanite.png", [1100, 1400], 250, 26),
    new OreData("Zircon", 145000, "Zircon.png", [1100, 1400], 200, 27),
    new OreData("Adamite", 190000, "Adamite.png", [1200, 1400], 115, 28),
    new OreData("Chrysoberyl", 250000, "Chrysoberyl.png", [1250, 1400], 75, 29),
    new OreData("Azurite", 310000, "Azurite.png", [1350, 1500], 50, 30),
    new OreData("Pink diamond", 550000, "PinkDiamond.png", [1400, 1500], 20, 31),
    new OreData("Malachite", 980000, "Malachite.png", [1405, 1500], 150, 33),
    new OreData("Void stone", 2250000, "Voidstone.png", [1405, 1500], 50, 34),
    new OreData("Vermilionite", 2300000, "Vermilionite.png", [1405, 1500], 50, 35),
    new OreData("Eclipsium", 4250000, "Eclipsium.png", [1405, 1500], 35, 36),
    new OreData("Abyssite", 7000000, "Abyssite.png", [1455, 1500], 25, 37),
    new OreData("Thalrax", 9000000, "Thalrax.png", [1455, 1500], 15, 38),

    new OreData("Red diamond", 10000000, "RedDiamond.png", [1500, 1505], 10000000, 32),

    //Rock has tile data 100
    //Fake tile has tile data 101
    //Bedrock tile has tile data 102



]