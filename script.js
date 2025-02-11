const gameContainer = document.getElementById('game-container');
const cells = [];
const mines = [];
const revealedCells = [];
const markedCells = [];

// 生成地雷位置
for (let i = 0; i < 20; i++) {
    const row = Math.floor(Math.random() * 12);
    const col = Math.floor(Math.random() * 12);
    mines.push([row, col]);
}

// 创建游戏格子
for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        gameContainer.appendChild(cell);
        cells.push(cell);
    }
}

// 为每个格子添加点击事件
let touchStartTime = 0;
let touchStartCell = null;

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // 如果是地雷，则游戏结束
        if (isMine(row, col)) {
            alert('Game Over!');
            revealAllMines();
            return;
        }

        // 如果不是地雷，则显示格子的内容
        revealCell(row, col);
    });

    cell.addEventListener('contextmenu', event => {
        event.preventDefault();
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // 标记格子
        markCell(row, col);
    });

    cell.addEventListener('touchstart', event => {
        event.preventDefault();
        touchStartTime = new Date().getTime();
        touchStartCell = cell;
    });

    cell.addEventListener('touchend', event => {
        event.preventDefault();
        const touchEndTime = new Date().getTime();
        if (touchEndTime - touchStartTime > 500) {
            const row = parseInt(touchStartCell.dataset.row);
            const col = parseInt(touchStartCell.dataset.col);
            markCell(row, col);
        } else {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            // 如果是地雷，则游戏结束
            if (isMine(row, col)) {
                alert('Game Over!');
                revealAllMines();
                return;
            }

            // 如果不是地雷，则显示格子的内容
            revealCell(row, col);
        }
    });
});

// 检查是否是地雷
function isMine(row, col) {
    return mines.some(mine => mine[0] === row && mine[1] === col);
}

// 显示格子的内容
function revealCell(row, col) {
    const cell = cells.find(cell => cell.dataset.row === row.toString() && cell.dataset.col === col.toString());
    if (cell.classList.contains('revealed') || cell.classList.contains('marked')) {
        return;
    }

    cell.classList.add('revealed'); // 添加 revealed 类别
    revealedCells.push([row, col]);

    const adjacentMines = countAdjacentMines(row, col);
    if (adjacentMines > 0) {
        cell.textContent = adjacentMines.toString();
    } else {
        // 如果周围没有地雷，则递归显示周围的格子
        revealAdjacentCells(row, col);
    }

    // 检查是否游戏胜利
    if (revealedCells.length === 144 - 20) {
        alert('Congratulations! You won!');
    }
}

// 标记格子
function markCell(row, col) {
    const cell = cells.find(cell => cell.dataset.row === row.toString() && cell.dataset.col === col.toString());
    if (cell.classList.contains('revealed') || cell.classList.contains('marked')) {
        cell.classList.remove('marked'); // 删除 marked 类别
        markedCells.splice(markedCells.indexOf([row, col]), 1);
    } else {
        cell.classList.add('marked'); // 添加 marked 类别
        markedCells.push([row, col]);
    }
}

// 计算周围的地雷数量
function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const adjacentRow = row + i;
            const adjacentCol = col + j;
            if (adjacentRow >= 0 && adjacentRow < 12 && adjacentCol >= 0 && adjacentCol < 12) {
                if (isMine(adjacentRow, adjacentCol)) {
                    count++;
                }
            }
        }
    }
    return count;
}

// 递归显示周围的格子
function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const adjacentRow = row + i;
            const adjacentCol = col + j;
            if (adjacentRow >= 0 && adjacentRow < 12 && adjacentCol >= 0 && adjacentCol < 12) {
                revealCell(adjacentRow, adjacentCol);
            }
        }
    }
}

// 显示所有地雷
function revealAllMines() {
    mines.forEach(mine => {
        const cell = cells.find(cell => cell.dataset.row === mine[0].toString() && cell.dataset.col === mine[1].toString());
        cell.classList.add('mine'); // 添加 mine 类别
        cell.classList.remove('revealed'); // 删除 revealed 类别
    });
}
