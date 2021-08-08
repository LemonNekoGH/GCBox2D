declare module GCBox2D {
    /**
     * Box2D 世界
     */
    export class World {
        m_bodyList: Body

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

        Step(dt: number, velocityIterations: number, positionIterations: number): void
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

        constructor()

        CreateFixture(fixtureDef: FixtureDef): Fixture
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
        density: number
        friction: number
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

    export class Draw {}

    export const pi: number
}