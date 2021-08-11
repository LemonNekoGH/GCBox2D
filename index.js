(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.test = {}));
}(this, (function (exports) { 'use strict';

  // MIT License
  // Copyright (c) 2019 Erin Catto
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.
  class Camera {
      constructor() {
          this.m_center = new GCBox2D.Vec2(0, 20);
          ///public readonly m_roll: Rot = new Rot(DegToRad(0));
          this.m_extent = 25;
          this.m_zoom = 1;
          this.m_width = 1280;
          this.m_height = 800;
      }
      ConvertScreenToWorld(screenPoint, out) {
          return this.ConvertElementToWorld(screenPoint, out);
      }
      ConvertWorldToScreen(worldPoint, out) {
          return this.ConvertWorldToElement(worldPoint, out);
      }
      ConvertViewportToElement(viewport, out) {
          // 0,0 at center of canvas, x right and y up
          const element_x = viewport.x + (0.5 * this.m_width);
          const element_y = (0.5 * this.m_height) - viewport.y;
          return out.Set(element_x, element_y);
      }
      ConvertElementToViewport(element, out) {
          // 0,0 at center of canvas, x right and y up
          const viewport_x = element.x - (0.5 * this.m_width);
          const viewport_y = (0.5 * this.m_height) - element.y;
          return out.Set(viewport_x, viewport_y);
      }
      ConvertProjectionToViewport(projection, out) {
          const viewport = out.Copy(projection);
          GCBox2D.Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
          ///GCBox2D.Vec2.MulSV(this.m_extent, viewport, viewport);
          GCBox2D.Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
          return viewport;
      }
      ConvertViewportToProjection(viewport, out) {
          const projection = out.Copy(viewport);
          ///GCBox2D.Vec2.MulSV(1 / this.m_extent, projection, projection);
          GCBox2D.Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
          GCBox2D.Vec2.MulSV(this.m_zoom, projection, projection);
          return projection;
      }
      ConvertWorldToProjection(world, out) {
          const projection = out.Copy(world);
          GCBox2D.Vec2.SubVV(projection, this.m_center, projection);
          ///Rot.MulTRV(this.m_roll, projection, projection);
          return projection;
      }
      ConvertProjectionToWorld(projection, out) {
          const world = out.Copy(projection);
          ///Rot.MulRV(this.m_roll, world, world);
          GCBox2D.Vec2.AddVV(this.m_center, world, world);
          return world;
      }
      ConvertElementToWorld(element, out) {
          const viewport = this.ConvertElementToViewport(element, out);
          const projection = this.ConvertViewportToProjection(viewport, out);
          return this.ConvertProjectionToWorld(projection, out);
      }
      ConvertWorldToElement(world, out) {
          const projection = this.ConvertWorldToProjection(world, out);
          const viewport = this.ConvertProjectionToViewport(projection, out);
          return this.ConvertViewportToElement(viewport, out);
      }
      ConvertElementToProjection(element, out) {
          const viewport = this.ConvertElementToViewport(element, out);
          return this.ConvertViewportToProjection(viewport, out);
      }
  }
  // This class implements debug drawing callbacks that are invoked
  // inside b2World::Step.
  class DebugDraw extends GCBox2D.Draw {
      constructor() {
          super();
          this.m_ctx = null;
      }
      PushTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.save();
              ctx.translate(xf.p.x, xf.p.y);
              ctx.rotate(xf.q.GetAngle());
          }
      }
      PopTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.restore();
          }
      }
      DrawPolygon(vertices, vertexCount, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              for (let i = 1; i < vertexCount; i++) {
                  ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              ctx.closePath();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawSolidPolygon(vertices, vertexCount, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              for (let i = 1; i < vertexCount; i++) {
                  ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              ctx.closePath();
              ctx.fillStyle = color.MakeStyleString(0.5);
              ctx.fill();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawCircle(center, radius, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.arc(center.x, center.y, radius, 0, GCBox2D.pi * 2, true);
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawSolidCircle(center, radius, axis, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              const cx = center.x;
              const cy = center.y;
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, GCBox2D.pi * 2, true);
              ctx.moveTo(cx, cy);
              ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
              ctx.fillStyle = color.MakeStyleString(0.5);
              ctx.fill();
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      // #if B2_ENABLE_PARTICLE
      DrawParticles(centers, radius, colors, count) {
          const ctx = this.m_ctx;
          if (ctx) {
              if (colors !== null) {
                  for (let i = 0; i < count; ++i) {
                      const center = centers[i];
                      const color = colors[i];
                      ctx.fillStyle = color.MakeStyleString();
                      // ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                      ctx.beginPath();
                      ctx.arc(center.x, center.y, radius, 0, GCBox2D.pi * 2, true);
                      ctx.fill();
                  }
              }
              else {
                  ctx.fillStyle = "rgba(255,255,255,0.5)";
                  // ctx.beginPath();
                  for (let i = 0; i < count; ++i) {
                      const center = centers[i];
                      // ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                      ctx.beginPath();
                      ctx.arc(center.x, center.y, radius, 0, GCBox2D.pi * 2, true);
                      ctx.fill();
                  }
                  // ctx.fill();
              }
          }
      }
      // #endif
      DrawSegment(p1, p2, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = color.MakeStyleString(1);
              ctx.stroke();
          }
      }
      DrawTransform(xf) {
          const ctx = this.m_ctx;
          if (ctx) {
              this.PushTransform(xf);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(1, 0);
              ctx.strokeStyle = GCBox2D.Color.RED.MakeStyleString(1);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, 1);
              ctx.strokeStyle = GCBox2D.Color.GREEN.MakeStyleString(1);
              ctx.stroke();
              this.PopTransform(xf);
          }
      }
      DrawPoint(p, size, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.fillStyle = color.MakeStyleString();
              size *= g_camera.m_zoom;
              size /= g_camera.m_extent;
              const hsize = size / 2;
              ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
          }
      }
      DrawString(x, y, message) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.font = "15px DroidSans";
              const color = DebugDraw.DrawString_s_color;
              ctx.fillStyle = color.MakeStyleString();
              ctx.fillText(message, x, y);
              ctx.restore();
          }
      }
      DrawStringWorld(x, y, message) {
          const ctx = this.m_ctx;
          if (ctx) {
              const p = DebugDraw.DrawStringWorld_s_p.Set(x, y);
              // world -> viewport
              const vt = g_camera.m_center;
              GCBox2D.Vec2.SubVV(p, vt, p);
              ///const vr = g_camera.m_roll;
              ///Rot.MulTRV(vr, p, p);
              const vs = g_camera.m_zoom;
              GCBox2D.Vec2.MulSV(1 / vs, p, p);
              // viewport -> canvas
              const cs = 0.5 * g_camera.m_height / g_camera.m_extent;
              GCBox2D.Vec2.MulSV(cs, p, p);
              p.y *= -1;
              const cc = DebugDraw.DrawStringWorld_s_cc.Set(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
              GCBox2D.Vec2.AddVV(p, cc, p);
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.font = "15px DroidSans";
              const color = DebugDraw.DrawStringWorld_s_color;
              ctx.fillStyle = color.MakeStyleString();
              ctx.fillText(message, p.x, p.y);
              ctx.restore();
          }
      }
      DrawAABB(aabb, color) {
          const ctx = this.m_ctx;
          if (ctx) {
              ctx.strokeStyle = color.MakeStyleString();
              const x = aabb.lowerBound.x;
              const y = aabb.lowerBound.y;
              const w = aabb.upperBound.x - aabb.lowerBound.x;
              const h = aabb.upperBound.y - aabb.lowerBound.y;
              ctx.strokeRect(x, y, w, h);
          }
      }
  }
  DebugDraw.DrawString_s_color = new GCBox2D.Color(0.9, 0.6, 0.6);
  DebugDraw.DrawStringWorld_s_p = new GCBox2D.Vec2();
  DebugDraw.DrawStringWorld_s_cc = new GCBox2D.Vec2();
  DebugDraw.DrawStringWorld_s_color = new GCBox2D.Color(0.5, 0.9, 0.5);
  const g_debugDraw = new DebugDraw();
  const g_camera = new Camera();

  var Vec2 = GCBox2D.Vec2;
  var BodyDef = GCBox2D.BodyDef;
  class Main {
      constructor() {
          document.body.style.backgroundColor = "rgba(51,51,51,1.0)";
          const canvas = document.querySelector("#canvas");
          this.ctx = canvas.getContext('2d');
          canvas.addEventListener('click', (event) => {
              this.createCircle(this.world, 20, new Vec2(event.x, event.y), GCBox2D.BodyType.b2_dynamicBody);
          });
          this.world = this.createWorld(new GCBox2D.Vec2(0, 200));
          this.createGround(this.world);
          g_debugDraw.m_ctx = this.ctx;
          g_debugDraw.SetFlags(GCBox2D.DrawFlags.e_shapeBit);
          this.world.SetDebugDraw(g_debugDraw);
          this.world.SetAllowSleeping(true);
          setInterval(this.step, 100 / 6, this);
      }
      newDefaultFixtureDef(shape) {
          const def = new GCBox2D.FixtureDef();
          def.density = 20;
          def.friction = 1;
          def.restitution = 0.8;
          def.shape = shape;
          return def;
      }
      newDefaultBodyDef(position, bodyType) {
          const bodyDef = new GCBox2D.BodyDef();
          bodyDef.type = bodyType;
          bodyDef.position.Set(position.x, position.y);
          return bodyDef;
      }
      createCircle(world, radius, position, type) {
          const bodyDef = this.newDefaultBodyDef(position, type);
          const shape = new GCBox2D.CircleShape(radius);
          const fixtureDef = this.newDefaultFixtureDef(shape);
          const body = world.CreateBody(bodyDef);
          body.CreateFixture(fixtureDef);
          return body;
      }
      createBox(world, height, width, position, type) {
          let shape = new GCBox2D.PolygonShape();
          shape = shape.SetAsBox(width / 2, height / 2);
          const bodyDef = this.newDefaultBodyDef(position, type);
          const fixtureDef = this.newDefaultFixtureDef(shape);
          const body = world.CreateBody(bodyDef);
          body.CreateFixture(fixtureDef);
          return body;
      }
      createGround(world) {
          const bodyDef = new BodyDef();
          const ground = world.CreateBody(bodyDef);
          const shape = new GCBox2D.EdgeShape();
          shape.SetTwoSided(new Vec2(0, 350), new Vec2(640, 350));
          ground.CreateFixture(shape, 0);
      }
      createWorld(gravity) {
          const world = new GCBox2D.World(gravity, true);
          return world;
      }
      step(self) {
          self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
          self.world.Step(1 / 60, 8, 3);
          self.world.DebugDraw();
          self.ctx.restore();
      }
  }
  const app = new Main();

  exports.app = app;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
