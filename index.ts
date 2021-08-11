import {g_debugDraw} from "./draw";
import Vec2 = GCBox2D.Vec2;
import BodyDef = GCBox2D.BodyDef;

class Main {
    ctx: CanvasRenderingContext2D
    world: GCBox2D.World

    constructor() {
        document.body.style.backgroundColor = "rgba(51,51,51,1.0)"
        const canvas = (document.querySelector("#canvas") as HTMLCanvasElement)
        this.ctx = canvas.getContext('2d')

        canvas.addEventListener('click', (event) => {
            this.createCircle(this.world, 20, new Vec2(event.x, event.y), GCBox2D.BodyType.b2_dynamicBody)
        })

        this.world = this.createWorld(new GCBox2D.Vec2(0, 200))

        this.createGround(this.world)

        g_debugDraw.m_ctx = this.ctx
        g_debugDraw.SetFlags(GCBox2D.DrawFlags.e_shapeBit)
        this.world.SetDebugDraw(g_debugDraw)
        this.world.SetAllowSleeping(true)

        setInterval(this.step, 100 / 6, this)
    }


    newDefaultFixtureDef(shape: GCBox2D.Shape): GCBox2D.FixtureDef {
        const def = new GCBox2D.FixtureDef()
        def.density = 20
        def.friction = 1
        def.restitution = 0.8
        def.shape = shape
        return def
    }

    newDefaultBodyDef(position: GCBox2D.Vec2, bodyType: GCBox2D.BodyType): GCBox2D.BodyDef {
        const bodyDef = new GCBox2D.BodyDef()
        bodyDef.type = bodyType
        bodyDef.position.Set(position.x, position.y)
        return bodyDef
    }

    createCircle(world: GCBox2D.World, radius: number, position: GCBox2D.Vec2, type: GCBox2D.BodyType): GCBox2D.Body {
        const bodyDef = this.newDefaultBodyDef(position, type)
        const shape = new GCBox2D.CircleShape(radius)
        const fixtureDef = this.newDefaultFixtureDef(shape)

        const body = world.CreateBody(bodyDef)
        body.CreateFixture(fixtureDef)

        return body
    }

    createBox(world: GCBox2D.World, height: number, width: number, position: Vec2, type: GCBox2D.BodyType): GCBox2D.Body {
        let shape = new GCBox2D.PolygonShape()
        shape = shape.SetAsBox(width / 2, height / 2)

        const bodyDef = this.newDefaultBodyDef(position, type)
        const fixtureDef = this.newDefaultFixtureDef(shape)

        const body = world.CreateBody(bodyDef)
        body.CreateFixture(fixtureDef)

        return body
    }

    createGround(world: GCBox2D.World) {
        const bodyDef = new BodyDef()
        const ground = world.CreateBody(bodyDef)

        const shape = new GCBox2D.EdgeShape()
        shape.SetTwoSided(new Vec2(0, 350), new Vec2(640, 350))

        ground.CreateFixture(shape, 0)
    }

    createWorld(gravity: Vec2): GCBox2D.World {
        const world = new GCBox2D.World(gravity, true)
        return world
    }

    step(self: Main) {
        self.ctx.clearRect(0,0,self.ctx.canvas.width,self.ctx.canvas.height)
        self.world.Step(1 / 60, 8, 3)
        self.world.DebugDraw()
        self.ctx.restore()
    }
}
export const app = new Main()
