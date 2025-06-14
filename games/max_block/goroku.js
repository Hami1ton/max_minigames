const createGoroku = (elapsedTime) => {
    let message;

    if (elapsedTime < 10) {
        message = "やってくれましたね";
    } else if (elapsedTime < 15) {
        message = "確実に俺を仕留めることを考えてると思うと恐いよね";
    } else if (elapsedTime < 30) {
        message = "時代はいつも些細な出来事から変わっていくんやで";
    } else if (elapsedTime < 50) {
        message = "まァ、常に予想外を行くから";
    } else if (elapsedTime < 65) {
        message = "やはりこれだけ戦ってるとお互い実力が分かってくるな";
    } else if (elapsedTime < 80) {
        message = "いいんか？今から勝利を見定めとかんで";
    } else {
        message = "まだ微分たりない気分";
    }
    return message;
};

const gameOverGoroku = () => {
    return "アーッ！アーッ！";
};

