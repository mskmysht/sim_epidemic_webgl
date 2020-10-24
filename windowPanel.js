// デバッグ用 :: Bitmap Font設定
PIXI.BitmapFont.from(
  'myBMfont', // BitmapTextの`fontName`として使用する登録名
  {
    // ビットマップフォントの基本スタイルを指定
    fill: "#AAFFAA",
    fontSize: 40,
  }
);

// オブジェクトの生成
function createNode(x, y) {
  const dot = new PIXI.Graphics();
  dot.width = 20;
  dot.height = 20;
  dot.x = x;
  dot.y = y;

  // オブジェクトの描画設定
  dot.beginFill(0xffffff);
  dot.drawRect(0, 0, 20, 20);
  dot.endFill();

  return dot;
}

// 人工の読み込み
async function loadPopulation(worldId, t) {
  const content = await axios.get(`/data/${worldId}/${t}.json`);
  return content.data;
}

class WindowPanel {
  // 描画用
  app = null;
  field = null;
  dt = 0;

  worldid = '';
  population = [];

  // プリセットデータ用
  nextTime = 0;
  maxCount = 0;
  interval = 10;

  changed = false;

  // デバッグ用
  log = null;

  constructor(view, world, width, height) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x555555,
      // transparent: true,
      view
    });
    this.field = new PIXI.Container();

    this.field.scale.x = width / 12000;
    this.field.scale.y = height / 10000;
    this.app.stage.addChild(this.field);

    // プリセットデータ用
    this.worldId = world.name;
    this.maxCount = world.count;

    // デバッグ用
    this.log = new PIXI.BitmapText('test', { fontName: "myBMfont", fontSize: 15, align: "right" });
    this.app.stage.addChild(this.log);
    this.log.text = 0;
  }

  async initialize() {
    await this.updatePopulation();

    // ノードの作成
    this.population.forEach(v => {
      this.field.addChild(createNode(v[0], v[1]));
    });

    this.app.ticker.stop()
    this.app.ticker.add(delta => this.loop(delta))
    this.app.ticker.update();
  }

  // 次の人工の読み込み
  async updatePopulation() {
    if (this.nextTime < this.maxCount) {
      this.population = await loadPopulation(this.worldId, this.nextTime);
      this.nextTime++;
      this.changed = true;
    } else {
      this.changed = false;
    }
  }

  // 位置の更新
  updateLocations() {
    if (this.changed) {
      // 読み込まれるノードの個数は一定であることが前提
      this.population.forEach((v, i) => {
        const n = this.field.getChildAt(i)
        n.x = v[0];
        n.y = v[1];
      })
    }
  }

  async tick() {
    this.dt = 0;
    await this.updatePopulation();
  }

  //-------------------
  // アニメーション処理
  //-------------------
  async loop(delta) {
    this.log.text = this.dt;
    if (this.dt >= this.interval) {
      await this.tick();
    }
    this.updateLocations();
    this.dt += delta;
  }

  async reset() {
    this.nextTime = 0;
    await this.tick();
    this.app.ticker.update();
  }

  async step() {
    await this.tick();
    this.app.ticker.update();
  }

  pauseOrResume() {
    if (this.app.ticker.started) {
      this.app.ticker.stop();
    } else {
      this.app.ticker.start();
    }
  }

  finalize() {
    this.field.removeChildren();
  }
}
