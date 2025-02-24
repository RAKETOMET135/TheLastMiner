const particles = document.querySelector("#particles")

export class Particle{
    static particles = []

    static handleParticles(deltaTime){
        Particle.particles.forEach(particle => {
            particle.handleMovement(deltaTime)
        })
    }

    constructor(size, particleImage, velocity, lifetime, position, applyGravity){
        this._size = size
        this._speedX = velocity[0]
        this._speedY = velocity[1]
        this._x = position[0]
        this._y = position[1]
        this._gravity = 0
        this._image = particleImage
        this._element = this._createElement()
        this._lifetime = lifetime
        this._time = 0
        this._applyGravity = applyGravity

        Particle.particles.push(this)
    }

    _createElement(){
        let particleElement = document.createElement("img")
        particleElement.classList.add("particle")
        particleElement.setAttribute("src", this._image)
        particleElement.style.width = this._size[0] + "px"
        particleElement.style.height = this._size[1] + "px"

        particles.append(particleElement)

        return particleElement
    }

    handleMovement(deltaTime){
        if (this._applyGravity){
            this._gravity += 0.1 * deltaTime
        }

        this._x += this._speedX * deltaTime
        this._y += (this._speedY + this._gravity) * deltaTime

        this._element.style.left = this._x + "px"
        this._element.style.top = this._y + "px"

        this._time += deltaTime

        if (this._time >= this._lifetime){
            Particle.particles.splice(Particle.particles.indexOf(this), 1)
            this._element.remove()
            delete this
        }
    }
}