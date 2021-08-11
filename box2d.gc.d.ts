declare module GCBox2D {
    /**
     * Box2D 世界
     */
    export class World {
        m_bodyList: Body
        m_debugDraw: Draw
        m_gravity: Vec2
        m_controllerList: Controller
        m_clearForces: boolean

        /**
         * 创建一个世界
         * @param gravity 重力向量
         * @param allowSleep 是否允许休眠
         */
        constructor(gravity: Vec2, allowSleep: boolean)
        /**
         * 创建刚体
         */
        CreateBody(bd: BodyDef): Body

        DebugDraw(): void

        ClearForces(): void
        SetContinuousPhysics(b: boolean)
        Step(dt: number, velocityIterations: number, positionIterations: number): void
        SetWarmStarting(b: boolean)
        SetDebugDraw(draw: Draw)
        SetAllowSleeping(allow: boolean)
        AddController(c: Controller)
    }

    /**
     * 平面向量
     */
    export class Vec2 implements XY{
        x: number
        y: number

        constructor(x?: number, y?: number)

        Set(x: number, y: number): this
        Copy(other: XY): this

        static SubVV<T extends XY>(a: XY, b: XY, out: XY): T
        static AddVV<T extends XY>(a: XY, b: XY, out: XY): T
        static MulSV<T extends XY>(s: number, v: XY, out: XY): T
    }

    /**
     * 物体的位置和旋转
     */
    export class Transform {
        p: Vec2
        q: Rot
    }

    export class Rot {
        s: number
        c: number

        GetAngle(): number
    }

    /**
     * 刚体
     */
    export class Body {
        m_fixtureList: Fixture
        m_xf: Transform
        m_type: BodyType
        m_prev: Body
        m_next: Body
        /**
         * 受到的力
         */
        m_force: Vec2

        constructor()

        CreateFixture(fixtureDef: FixtureDef): Fixture
        CreateFixture(shape: Shape): Fixture
        CreateFixture(shape: Shape, density: number): Fixture
    }

    export class CircleShape extends Shape{
        constructor(r: number)
    }

    export class Shape {
        m_radius: number
        m_type: ShapeType
    }

    export class FixtureDef {
        shape: Shape
        /**
         * 物体密度
         */
        density: number
        /**
         * 摩擦系数
         */
        friction: number
        /**
         * 弹力
         */
        restitution: number

        constructor()
    }

    export class Fixture {
        m_shape: Shape
    }

    /**
     * 多边形
     */
    export class PolygonShape extends Shape {
        /**
         * 多边形边数
         */
        m_count: number

        SetAsBox(x: number, y: number, center?: XY, angle?: number): PolygonShape
    }

    /**
     * 刚体定义
     */
    export class BodyDef {
        type: BodyType
        position: Vec2
        linearDamping: number
        angularDamping: number
        userData: any

        constructor()
    }

    /**
     * 刚体类型
     */
    export enum BodyType {
        b2_unknown = -1,
        b2_staticBody = 0,
        b2_kinematicBody = 1,
        b2_dynamicBody = 2,
    }

    /**
     * 形状类型
     */
    export enum ShapeType {
        e_unknown = -1,
        e_circleShape = 0,
        e_edgeShape = 1,
        e_polygonShape = 2,
        e_chainShape = 3,
        e_shapeTypeCount = 4,
    }

    export interface XY {
        x: number
        y: number
    }

    export class Settings {}

    export class Joint {}

    export class MassData {}

    export class AABB {
        lowerBound: Vec2
        upperBound: Vec2
    }

    export class Color {
        static RED: Color
        static GREEN: Color

        constructor(r?: number,g?: number,b?: number, a?: number)

        MakeStyleString(alpha?: number)
    }

    export abstract class Draw {
        m_drawFlags: DrawFlags

        SetFlags(flags: DrawFlags)
        GetFlags(): DrawFlags
        AppendFlags(flags: DrawFlags)
        ClearFlags(flags: DrawFlags)

        abstract PushTransform(xf: Transform)
        abstract PopTransform(xf: Transform)
        abstract DrawPolygon(vertices: XY[], vertexCount: number, color: RGBA)
        abstract DrawSolidPolygon(vertices: XY[], vertexCount: number, color: RGBA)
        abstract DrawCircle(center: XY, radius: number, color: RGBA)
        abstract DrawSolidCircle(center: XY, radius: number, axis: XY, color: RGBA)
        abstract DrawParticles(centers: XY[], radius: number, colors: RGBA[], count: number): void
        abstract DrawSegment(p1: XY, p2: XY, color: RGBA): void
        abstract DrawTransform(xf: Transform): void
        abstract DrawPoint(p: XY, size: number, color: RGBA): void
    }

    export class RGBA {}

    export const pi: number

    export enum DrawFlags {
        e_none = 0,
        e_shapeBit = 0x0001,
        e_jointBit = 0x0002,
        e_aabbBit = 0x0004,
        e_pairBit = 0x0008,
        e_centerOfMassBit = 0x0010,
        e_particleBit = 0x0020,
        e_controllerBit = 0x0040,
        e_all = 0x003f
    }

    export class TimeStep {
        public dt: number
        public inv_dt: number
        public dtRatio: number
        public velocityIterations: number
        public positionIterations: number
        public particleIterations: number
        public warmStarting: boolean

        public Copy(step: TimeStep): TimeStep
    }

    export abstract class Controller {
        m_prev: Controller
        m_next: Controller

        abstract Step(step: TimeStep)
        abstract AddBody(bd: Body)
    }

    /**
     * 重力控制器
     */
    export class GravityController extends Controller {
        Step(step: TimeStep)
        AddBody(bd: GCBox2D.Body)
    }

    /**
     * 边界
     */
    export class EdgeShape extends Shape {
        SetTwoSided(vec1: XY, vec2: XY): EdgeShape
    }
}
