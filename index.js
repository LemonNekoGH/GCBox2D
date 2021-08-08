(function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

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
  new DebugDraw();
  const g_camera = new Camera();

  var world;
  var ctx;
  var canvas_width;
  var canvas_height;
  //box2d to canvas scale , therefor 1 metre of box2d = 100px of canvas :)
  var scale = 100;
  /*
      Draw a world
      this method is called in a loop to redraw the world
  */
  function draw_world(world, context) {
      //first clear the canvas
      ctx.clearRect(0, 0, canvas_width, canvas_height);
      ctx.fillStyle = '#FFF4C9';
      ctx.fillRect(0, 0, canvas_width, canvas_height);
      //convert the canvas coordinate directions to cartesian
      ctx.save();
      ctx.translate(0, canvas_height);
      ctx.scale(1, -1);
      ctx.restore();
      world.DebugDraw();
      ctx.font = 'bold 18px arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText('Box2d Hello World Example', 400, 20);
      ctx.font = 'bold 14px arial';
      ctx.fillText('Click the screen to add more objects', 400, 40);
  }
  //Create box2d world object
  function createWorld() {
      //Gravity vector x, y - 10 m/s2 - thats earth!!
      var gravity = new GCBox2D.Vec2(0, -10);
      world = new GCBox2D.World(gravity, true);
      //setup debug draw
      var debugDraw = new DebugDraw();
      world.SetDebugDraw(debugDraw);
      createBox(world, 4, 1, 4, 0.5, { type: GCBox2D.BodyType.b2_staticBody });
      return world;
  }
  //Function to create a ball
  function createBall(world, x, y, r, options) {
      var body_def = new GCBox2D.BodyDef();
      var fix_def = new GCBox2D.FixtureDef;
      fix_def.density = 1.0;
      fix_def.friction = 0.5;
      fix_def.restitution = 0.5;
      var shape = new GCBox2D.CircleShape(r);
      fix_def.shape = shape;
      body_def.position.Set(x, y);
      body_def.linearDamping = 0.0;
      body_def.angularDamping = 0.0;
      body_def.type = GCBox2D.BodyType.b2_dynamicBody;
      body_def.userData = options.user_data;
      var b = world.CreateBody(body_def);
      b.CreateFixture(fix_def);
      return b;
  }
  //Create some elements
  function createHelloWorld() {
      // H
      createBox(world, .5, 2.2, .1, .2);
      createBox(world, .9, 2.2, .1, .2);
      createBox(world, .7, 1.95, .3, .05);
      createBox(world, .5, 1.7, .1, .2);
      createBox(world, .9, 1.7, .1, .2);
  }
  //Create standard boxes of given height , width at x,y
  function createBox(world, x, y, width, height, options) {
      //default setting
      options = $__default['default'].extend(true, {
          'density': 1.0,
          'friction': 1.0,
          'restitution': 0.5,
          'linearDamping': 0.0,
          'angularDamping': 0.0,
          'type': GCBox2D.BodyType.b2_dynamicBody
      }, options);
      var body_def = new GCBox2D.BodyDef();
      var fix_def = new GCBox2D.FixtureDef();
      fix_def.density = options.density;
      fix_def.friction = options.friction;
      fix_def.restitution = options.restitution;
      const shape = new GCBox2D.PolygonShape();
      shape.SetAsBox(width, height);
      fix_def.shape = shape;
      body_def.position.Set(x, y);
      body_def.linearDamping = options.linearDamping;
      body_def.angularDamping = options.angularDamping;
      body_def.type = options.type;
      body_def.userData = options.user_data;
      var b = world.CreateBody(body_def);
      b.CreateFixture(fix_def);
      return b;
  }
  /*
      This method will draw the world again and again
      called by settimeout , self looped
  */
  function step() {
      var fps = 60;
      var timeStep = 1.0 / fps;
      //move the world ahead , step ahead man!!
      world.Step(timeStep, 8, 3);
      world.ClearForces();
      draw_world(world);
  }
  /*
      Convert coordinates in canvas to box2d world
  */
  function get_real(p) {
      return new GCBox2D.Vec2(p.x + 0, 6 - p.y);
  }
  // main entry point
  $__default['default'](function () {
      var canvas = $__default['default']('#canvas');
      ctx = canvas.get(0).getContext('2d');
      //first create the world
      world = createWorld();
      //get internal dimensions of the canvas
      canvas_width = parseInt(canvas.attr('width'));
      canvas_height = parseInt(canvas.attr('height'));
      //create the hello world boxes in the world
      createHelloWorld();
      //click event handler on our world
      canvas.click(function (e) {
          var p = get_real(new GCBox2D.Vec2(e.clientX / scale, e.clientY / scale));
          //create shape
          if (Math.random() > 0.5) {
              //Square box
              createBox(world, p.x, p.y, .1, .1);
          }
          else {
              //circle
              createBall(world, p.x, p.y, 0.2, { 'user_data': { 'fill_color': 'rgba(204,100,0,0.3)', 'border_color': '#555' } });
          }
      });
      window.setInterval(step, 1000 / 60);
  });

}($));
