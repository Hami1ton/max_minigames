// 変数宣言
let movedTile = null;
let toTile = null;
const goroku = [
    "空を飛ぶ方法は一つじゃないから",
    "仕事が丁寧な人なんやな",
    "あ～さすが本質をついている",
    "私に不可能はない",
    "いつも、いつも、ありがとう...",
    "もう気付いてしまったとはな、伊達に修羅場をくぐっていない",
    "さすが切れ者よ",
    "アー...賢いなァ",
    "でもな～こうしても生産性ないんだよなあ",
    "その目でどこまで...先を見ているんだろうね",
]

// ページが読み込まれたら実行
window.onload = () => {
    createPazzle();
};


const createPazzle= () => {
    // タイルの並び順
    const pazzleOrder = ["0-2", "2-0", "1-2", "0-0", "0-1", "2-1", "1-1", "1-0", "2-2"];


    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {

            const tileName = pazzleOrder.shift();

            // 盤面に敷き詰めるタイル生成
            let tile = document.createElement("img");
            const id = row.toString() + "-" + col.toString();
            tile.id = id;
            if (tileName == "2-2") {
                tile.src = "./assets/parts/2-2.png";
            } else {
                tile.src = "./assets/parts/" + tileName + ".png";
            }            
            tile.setAttribute("tileName", tileName);
            tile.className = "tile__img";

            document.getElementById("pazzle").append(tile);

            // dragイベント登録
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
        }
    }
}


// dragStart時
const dragStart = (event) => {
    // ドラッグしようとした画像を取得
    movedTile = event.target;
}


// dragOver時
const dragOver = (event) => {
    event.preventDefault();
}


// dragEnter時
const dragEnter = (event) => {
    event.preventDefault();
}


// dragLeave時
const dragLeave = (event) => {
    event.preventDefault();
}


// dragDrop時
const dragDrop = (event) => {
    toTile = event.target;
}


// dragEnd時
const dragEnd = () => {
    // console.log("dragEnd");
    if (!toTile.getAttribute("src").includes("2-2")) {
        // ドラッグ先が空きスペースでなければreturn
        return;
    }

    if (isMovable()) {
        // imageの入れ替え
        const currImg = movedTile.src;
        const otherImg = toTile.src;

        movedTile.src = otherImg;
        toTile.src = currImg;

        // クリア判定に利用するため入れ替えを行う
        const currName = movedTile.getAttribute("tileName");
        const otherName = toTile.getAttribute("tileName");
        movedTile.setAttribute("tileName", otherName);
        toTile.setAttribute("tileName", currName);

        // クリア判定
        isComplete();
    }
}


const isMovable = () => {
    // 上・下・右・左にしか移動不可
    const currCoords = movedTile.id.split("-")
    const row = parseInt(currCoords[0]);
    const col = parseInt(currCoords[1]);

    const toCoords = toTile.id.split("-");
    const row2 = parseInt(toCoords[0]);
    const col2 = parseInt(toCoords[1]);

    const moveLeft = row == row2 && col2 == col - 1;
    const moveRight = row == row2 && col2 == col + 1;

    const moveUp = col == col2 && row2 == row - 1;
    const moveDown = col == col2 && row2 == row + 1;

    return moveLeft || moveRight || moveUp || moveDown;

}


const isComplete = () => {
    // クリア判定
    const list = [
        document.getElementById("0-0"),
        document.getElementById("0-1"),
        document.getElementById("0-2"),
        document.getElementById("1-0"),
        document.getElementById("1-1"),
        document.getElementById("1-2"),
        document.getElementById("2-0"),
        document.getElementById("2-1"),
        document.getElementById("2-2")       
    ];

    const isCorrect = list.every((item, index) => {
        // idとtileNameが全て同じならクリア
        return item.getAttribute("id") === item.getAttribute("tileName");
    })

    if (isCorrect) {
        // 語録表示
        document.getElementById("message").innerText = goroku[Math.floor(Math.random() * goroku.length)];

        // イベント解除
        list.map((item, index) => {
            if (item) {
                item.removeEventListener("dragstart", dragStart);
                item.removeEventListener("dragover", dragOver);
                item.removeEventListener("dragenter", dragEnter);
                item.removeEventListener("dragleave", dragLeave);
                item.removeEventListener("drop", dragDrop);
                item.removeEventListener("dragend", dragEnd);
            }
        })
    } else {
    }
}


const reset= () => {
    // 状態初期化
    movedTile = null;
    toTile = null;
    document.getElementById("0-0").remove();
    document.getElementById("0-1").remove();
    document.getElementById("0-2").remove();
    document.getElementById("1-0").remove();
    document.getElementById("1-1").remove();
    document.getElementById("1-2").remove();
    document.getElementById("2-0").remove();
    document.getElementById("2-1").remove();
    document.getElementById("2-2").remove();
    document.getElementById("message").innerText = "";

    // パズル再生成
    createPazzle();
}