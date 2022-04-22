// LICENSE
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Get URL parameters
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let pSeed = params.seed;
let pLight = params.light;
let pBurned = params.burned;

var DEFAULT_SIZE = 800;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var DIM = Math.min(WIDTH, HEIGHT);
var M = DIM / DEFAULT_SIZE;

let paperSize = {
// https://gokcetaskan.com/artofcode/high-quality-export
  width: 3300,
  height: 4200
}

let c = [] // cloud seeds
let ci = 0;
let r = DIM/2 - 50*M;
let sca = DIM/3;
let str = 5;
let sf // scale factor, for zoom
let of = [0,0]; // offset, for zoom
let randSeed = Date.now()|0;
let seed = randSeed;
let darkmode = true; // light or dark background
let unburned = true; // is it burned?
if(pSeed) seed = parseInt(pSeed);
if(pLight && pLight=="true") darkmode = false;
if(pBurned && pBurned=="true") unburned = false;
let px = Math.max(2, DIM/200) | 0 // pixel size for points
let step = 0;

let metadata = {seed:0, water:0, forest:0, aridity:0, total:0}
if(pSeed){
  metadata.seed = pSeed;
}else{
  metadata.seed = randSeed;
}


function setup() {
  colorMode(HSB,100);
  createCanvas(WIDTH, HEIGHT);
  if (darkmode){
    background(0,0,20);
  } else {
    background(0,0,90);
  }
  randomSeed(seed);
  noiseSeed(seed);
  sf = random(0.9,1.1);
  of = [random(-width/8,width/8), random(-width/8,width/8)]

  if(unburned){
    translate(width/2, height/2);
    noFill();
    scale(sf);
    translate(of[0],of[1]);

    // plot planet, if not burned
    rotate(radians(-23.4));

    // create cloud vectors
    for(let i=0; i<500; i++){
      x = random(-r,r);
      y = random(-r,r);
      s = random(-px*2.5,px*2.5);
      if((x**2 + y**2) < (r-5)**2) {
        c.push({x:x,y:y,s:s});
      }
    }

    // add water and land
    let ff = [] // forest and desert vector
    strokeWeight(px);
    for(let x = -r; x < r; x+=px*.9){
      for(let y = -r; y < r; y+=px*.9){
        let z = noise((x+r)/(sca/1.5), (y+r)/(sca/1.5));
        if((x**2 + y**2) < (r)**2) {
          metadata.total ++
          if(z < 0.5){
            metadata.water ++
            // water #161915 86 sat
            stroke(100*207/360,86,random(50,70));
            point(x,y);
          } else{
            if(random(1) < 0.005){
              // forest seed
              ff.push({x:x,y:y});
            }
            stroke(100*71/360,44,53);
            point(x,y);
          }
        }
      }
    }

    strokeWeight(px);
    for(let j=0; j<Math.min(ff.length,30); j++){
      let space = ff[j]
      if(random(1) > 0.66){
        // dark forest addition
        stroke(100*132/360,42,29,66);
        for(let i=0; i<50; i++){
          metadata.forest ++
          point(space.x, space.y);
          randx = space.x + random([-px,0,px]);
          randy = space.y + random([-px,0,px]);
          randz = noise((randx+r)/(sca/1.5), (randy+r)/(sca/1.5));
          if(((randx**2 + randy**2) < (r)**2) & randz > 0.51) {
            space.x = randx
            space.y = randy
          }
        }
      }else{
        // desert
        stroke(100*40/360,34,84,66);
        for(let i=0; i<r*2; i++){
          point(space.x, space.y);
          randx = space.x + random([-px,0,px,px*2]);
          randy = space.y + random([-px*2,-px,0,px,px*2]);
          same = (randx == space.x) & (randy == space.y);
          randz = noise((randx+r)/(sca/1.5), (randy+r)/(sca/1.5));
          if(((randx**2 + randy**2) < (r)**2) & randz > 0.55 & !same) {
            metadata.aridity ++
            space.x = randx
            space.y = randy
          }
        }
      }
    }

    if (darkmode) {
      strokeWeight(px);
    } else{
      strokeWeight(px/2);
    }
    stroke(100*97/360,59,9,50);
    // vertical dots
    for(let xi = -r; xi <= r; xi += px*10){
      for(let a = 90; a<=270; a+=2){
        y = r * sin(radians(a));
        x = xi * cos(radians(a));
        point(x,y);
      }
    }
    rotate(radians(23.4));

  }

}

function draw() {
  translate(width/2, height/2);
  noFill();
  scale(sf);
  translate(of[0],of[1]);

  if(step == 0){
    randomSeed(seed);
    noiseSeed(seed);

    step = 1;
    // ellipse(0,0,r*2);

    // outer space
    strokeWeight(px*2);
    for(let j=0; j<height; j+=DIM/20){
      let space = {x:random(-width/2,width/2),y:j};
      for(let i=0; i<15000; i++){
        if(Math.random()<0.0012){
          // stars
          strokeWeight(random(px*2))
          if (darkmode){
            stroke(100*192/365,11,99);
          } else {
            stroke(100*192/365,11,25);
          }
          point(space.x, space.y);
          strokeWeight(px*2);
        // add space
        } else if(darkmode){
          stroke(100*192/365,44,13,25);
          point(space.x, space.y);
        }
        randx = space.x + randomGaussian(0,px*2.5);
        randy = space.y + randomGaussian(0,px*2.5);
        if((randx**2 + randy**2) > (r)**2) {
          space.x = randx
          space.y = randy
        }
      }
    }

  }

  randomSeed(randSeed);
  noiseSeed(randSeed);

  sca = DIM/random(8);
  str = 5;

  // cloud wisps
  for(let i=0; i<c.length; i++){
    stroke(100*217/365,8,97,33);
    strokeWeight(abs(c[i].s*random(0.9,1.5)));
    let angle = noise((c[i].x+r)/sca, (c[i].y+r)/sca)*str;
    c[i].x += cos(angle)*c[i].s;
    c[i].y += sin(angle)*c[i].s;
    if((c[i].x**2 + c[i].y**2) < (r-2)**2) {
      point(c[i].x,c[i].y)
    }else{
      c[i].x = random(-r,r)
      c[i].y = random(-r,r)
      c[i].s = random(-px*2.5,px*2.5)
    }
    c[i].s *= random(0.95,1);
  }

  // random cloud spots
  if(unburned){
    if (ci < 250){
      stroke(100,0,100,66)
      for(let j = 0; j<random(50); j++){
        strokeWeight(random(1,px*4))
        x = random(-r,r);
        y = random(-r,r);
        if(x**2 + y**2 < (r-10)**2){
          point(x,y);
        }
        ci ++
      }
    } else {
      noLoop();
      // horiz hatches
      rotate(radians(-random(-20,50)));
      let sa = random(-85,0);
      stroke(0,0,20,30);
      strokeWeight(px*1.5);
      for (let a = -90; a < 90; a ++){
        x = r*cos(radians(a));
        y = r*sin(radians(a));
        x0 = r*cos(radians(a-180));
        if(sa > 0){
            x1 = x - x*cos(radians(sa));
        }else{
            x1 = x*cos(radians(sa)) - x;
        }
        for (let z = x0; z < x1; z +=px*2) point(z,y);
      }
    }
  }

}
