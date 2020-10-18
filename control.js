function main() {
    // 外部(canvas外)インターフェースの取得
    const prBtn = document.getElementById('pause_resume');
    const stepBtn = document.getElementById('step');

    // Bitmap Font設定
    PIXI.BitmapFont.from(
        'myBMfont', // BitmapTextの`fontName`として使用する登録名
        {
            // ビットマップフォントの基本スタイルを指定
            fill: "#333333",
            fontSize: 40,
        }
    );

    //-------------------
    // Application設定
    //-------------------

    // Applicationの作成
    const app = new PIXI.Application({
        width: 600,
        height: 500,
        backgroundColor: 0x55CC55,
        view: document.getElementById('pixi')// $('#pixi')
    });

    // ApplicationをDOMへ追加 (canvasとして追加される)
    // document.body.appendChild(app.view);

    //-------------------
    // オブジェクト設定
    //-------------------

    // オブジェクトの生成
    const square = new PIXI.Graphics();
    square.width = 100;
    square.height = 100;
    square.x = 50;
    square.y = 50;

    // オブジェクトの描画設定
    square.beginFill(0xffffff);
    square.drawRect(0, 0, 100, 100)
    square.endFill();

    // オブジェクトの登録
    app.stage.addChild(square);

    const text = new PIXI.BitmapText('test', { fontName: "myBMfont", align: "right" });
    app.stage.addChild(text);
    text.text = square.x;

    //-------------------
    // アニメーション処理
    //-------------------
    function loop(delta) {
        square.x += 5;
        text.text = square.x;
    }

    //-------------------
    // イベント処理
    //-------------------
    // pause/resume button
    prBtn.addEventListener('click', event => {
        if (app.ticker.started) {
            app.ticker.stop()
        } else {
            app.ticker.start()
        }
    })

    // step button
    stepBtn.addEventListener('click', event => {
        app.ticker.update()
    })

    // 初回だけ描画
    app.ticker.update()
    app.ticker.stop()
    app.ticker.add(loop)
}

window.onload = main
